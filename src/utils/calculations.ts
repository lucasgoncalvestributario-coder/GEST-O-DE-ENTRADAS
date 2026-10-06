import {
  Sale,
  Expense,
  ClosedPeriod,
  TargetCalculation,
  GoalStatus,
  DailyClosingData,
  DayWeightTier,
  DayTargetInfo,
  GorduraUsage,
  GorduraBalance,
  GorduraDaySummary,
} from '../types';
import { MONTH_NAMES_PT } from './constants';
import { getBrasiliaDateParts, getTodayBrasilia, DAY_OF_WEEK_NAMES_BR } from './dateUtils';
import { appStorage } from '../services/storage';

export const DAY_OF_WEEK_NAMES = DAY_OF_WEEK_NAMES_BR;

/**
 * Format a number as Brazilian Real (R$)
 */
export function formatCurrency(value: number): string {
  if (isNaN(value) || value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (isNaN(value) || value === null || value === undefined) return '0%';
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format date string YYYY-MM-DD to DD/MM/YYYY
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Get formatted month string, e.g. "Agosto/2026"
 */
export function formatMonthYear(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split('-');
  const monthIdx = parseInt(monthStr, 10) - 1;
  const monthName = MONTH_NAMES_PT[monthIdx] || monthStr;
  return `${monthName}/${yearStr}`;
}

/**
 * Get weight and tier for day of week:
 * - Segunda-feira: Média (peso 1.0)
 * - Terça, Quarta, Quinta: Baixa (peso 0.7)
 * - Sexta, Sábado, Domingo: Alta (peso 1.4)
 */
export function getDayWeightAndTier(dayOfWeek: number): {
  tier: DayWeightTier;
  tierLabel: string;
  weight: number;
  emoji: string;
} {
  switch (dayOfWeek) {
    case 1: // Segunda-feira
      return { tier: 'media', tierLabel: 'Meta Média', weight: 1.0, emoji: '⚡' };
    case 2: // Terça-feira
    case 3: // Quarta-feira
    case 4: // Quinta-feira
      return { tier: 'baixa', tierLabel: 'Meta Baixa', weight: 0.7, emoji: '🌱' };
    case 5: // Sexta-feira
    case 6: // Sábado
    case 0: // Domingo
    default:
      return { tier: 'alta', tierLabel: 'Meta Alta', weight: 1.4, emoji: '🔥' };
  }
}

/**
 * Check if a date string (YYYY-MM-DD) is in a closed period
 */
export function isDateInClosedPeriods(
  dateStr: string,
  closedPeriods: ClosedPeriod[] = []
): { isClosed: boolean; reason?: string; name?: string } {
  for (const period of closedPeriods) {
    if (dateStr >= period.startDate && dateStr <= period.endDate) {
      return { isClosed: true, reason: period.reason, name: period.name };
    }
  }
  return { isClosed: false };
}

/**
 * Calculate the exact weighted daily targets for all days of the month,
 * with dynamic equal redistribution of unachieved targets to remaining operational days.
 */
export function calculateDayTargetsForMonth(
  monthKey: string,
  targetAmount: number,
  closedPeriods: ClosedPeriod[] = [],
  sales: Sale[] = [],
  gorduraUsages: GorduraUsage[] = [],
  currentDateObj: Date = new Date()
): DayTargetInfo[] {
  const [yearStr, monthStr] = (monthKey || '2026-09').split('-');
  const year = parseInt(yearStr, 10) || 2026;
  const monthIndex = (parseInt(monthStr, 10) || 9) - 1;
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();

  const brParts = getBrasiliaDateParts(currentDateObj);
  const currentYear = brParts.year;
  const currentMonthIdx = brParts.monthIndex;
  const currentDay = brParts.day;

  // Determine current day context
  let evaluatedDay: number;
  if (year === currentYear && monthIndex === currentMonthIdx) {
    evaluatedDay = Math.min(currentDay, totalDays);
  } else if (year < currentYear || (year === currentYear && monthIndex < currentMonthIdx)) {
    evaluatedDay = totalDays; // Past month: all days evaluated
  } else {
    evaluatedDay = 0; // Future month: no past days evaluated
  }

  const days: DayTargetInfo[] = [];
  let totalWeightOpenDays = 0;

  // Step 1: Identify days, day-of-week, closed status and weights
  for (let day = 1; day <= totalDays; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `${yearStr}-${monthStr}-${dayStr}`;
    const dateMidday = new Date(`${dateStr}T12:00:00-03:00`);
    const dayOfWeek = dateMidday.getUTCDay();
    const dayOfWeekName = DAY_OF_WEEK_NAMES[dayOfWeek];
    const { isClosed, reason } = isDateInClosedPeriods(dateStr, closedPeriods);
    const { tier, tierLabel, weight } = getDayWeightAndTier(dayOfWeek);

    if (!isClosed) {
      totalWeightOpenDays += weight;
    }

    days.push({
      date: dateStr,
      dayNumber: day,
      dayOfWeek,
      dayOfWeekName,
      tier,
      tierLabel,
      weight: isClosed ? 0 : weight,
      isClosed,
      closedReason: reason,
      baseTarget: 0,
      deficitAdded: 0,
      target: 0,
      sales: 0,
      gorduraUsed: 0,
      effectiveSales: 0,
      isMet: false,
      missingDeficit: 0,
    });
  }

  // Step 2: Compute base weighted target for each open day (sum === targetAmount)
  if (totalWeightOpenDays > 0 && targetAmount > 0) {
    let accumulated = 0;
    const openDays = days.filter((d) => !d.isClosed);
    openDays.forEach((d, idx) => {
      if (idx === openDays.length - 1) {
        // Last open day absorbs any fractional cent difference
        d.baseTarget = Math.max(0, Math.round((targetAmount - accumulated) * 100) / 100);
      } else {
        const val = Math.round(((targetAmount * d.weight) / totalWeightOpenDays) * 100) / 100;
        d.baseTarget = val;
        accumulated += val;
      }
      d.target = d.baseTarget;
      d.deficitAdded = 0;
    });
  }

  // Step 3: If sales exist or past days have elapsed, dynamically redistribute unachieved deficits
  const monthSales = (sales || []).filter((s) => s.monthKey === monthKey);
  const monthUsages = (gorduraUsages || []).filter((u) => u.monthKey === monthKey);

  const openDays = days.filter((d) => !d.isClosed);

  for (let i = 0; i < openDays.length; i++) {
    const currentOpenDay = openDays[i];
    const daySalesList = monthSales.filter((s) => s.date === currentOpenDay.date);
    const daySalesTotal = daySalesList.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
    const dayUsages = monthUsages.filter((u) => u.date === currentOpenDay.date);
    const dayGorduraUsed = dayUsages.reduce((acc, u) => acc + (u.amount || 0), 0);
    const effectiveTotal = daySalesTotal + dayGorduraUsed;

    currentOpenDay.sales = daySalesTotal;
    currentOpenDay.gorduraUsed = dayGorduraUsed;
    currentOpenDay.effectiveSales = effectiveTotal;
    currentOpenDay.isMet = currentOpenDay.target > 0 && effectiveTotal >= currentOpenDay.target;

    // Check if this day is completed (strictly in the past relative to evaluatedDay)
    const isPastDay = currentOpenDay.dayNumber < evaluatedDay;

    if (isPastDay && currentOpenDay.target > 0) {
      if (effectiveTotal < currentOpenDay.target) {
        // Day missed target: calculate missing deficit
        const deficit = Math.max(0, currentOpenDay.target - effectiveTotal);
        currentOpenDay.missingDeficit = Math.round(deficit * 100) / 100;

        // Distribute this deficit equally among remaining open days (i+1 to end)
        const remainingOpenDays = openDays.slice(i + 1);
        if (remainingOpenDays.length > 0 && deficit > 0) {
          const sharePerDay = deficit / remainingOpenDays.length;
          for (let k = i + 1; k < openDays.length; k++) {
            openDays[k].deficitAdded += sharePerDay;
            openDays[k].target = Math.round((openDays[k].baseTarget + openDays[k].deficitAdded) * 100) / 100;
          }
        }
      } else {
        currentOpenDay.missingDeficit = 0;
      }
    }
  }

  return days;
}

/**
 * Calculate the Gordura (Surplus / Reserve) balance for a month.
 * - Gordura is generated whenever a day's sales exceed that day's target.
 * - Gordura is consumed when used to complete the target of a day.
 */
export function calculateGorduraBalance(
  monthKey: string,
  targetAmount: number,
  sales: Sale[] = [],
  closedPeriods: ClosedPeriod[] = [],
  gorduraUsages: GorduraUsage[] = [],
  currentDateObj: Date = new Date()
): GorduraBalance {
  const dayTargets = calculateDayTargetsForMonth(
    monthKey,
    targetAmount,
    closedPeriods,
    sales,
    gorduraUsages,
    currentDateObj
  );
  const monthSales = (sales || []).filter((s) => s.monthKey === monthKey);
  const monthUsages = (gorduraUsages || []).filter((u) => u.monthKey === monthKey);

  const daysWithSurplus: GorduraDaySummary[] = [];
  let totalGenerated = 0;

  dayTargets.forEach((dayInfo) => {
    const daySalesList = monthSales.filter((s) => s.date === dayInfo.date);
    const daySalesTotal = daySalesList.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
    const dayUsages = monthUsages.filter((u) => u.date === dayInfo.date);
    const dayGorduraUsed = dayUsages.reduce((acc, u) => acc + (u.amount || 0), 0);
    const surplusGenerated = !dayInfo.isClosed ? Math.max(0, daySalesTotal - dayInfo.target) : 0;
    const effectiveTotal = daySalesTotal + dayGorduraUsed;
    const isMet = dayInfo.target > 0 && effectiveTotal >= dayInfo.target;

    totalGenerated += surplusGenerated;

    let status: 'surplus' | 'used' | 'met' | 'under' = 'under';
    if (surplusGenerated > 0) status = 'surplus';
    else if (dayGorduraUsed > 0) status = 'used';
    else if (isMet) status = 'met';

    if (daySalesTotal > 0 || dayGorduraUsed > 0 || surplusGenerated > 0) {
      daysWithSurplus.push({
        date: dayInfo.date,
        dayNumber: dayInfo.dayNumber,
        dayOfWeekName: dayInfo.dayOfWeekName,
        dailyTarget: dayInfo.target,
        sales: daySalesTotal,
        surplusGenerated,
        gorduraUsed: dayGorduraUsed,
        effectiveTotal,
        isMet,
        status,
      });
    }
  });

  const totalUsed = monthUsages.reduce((acc, u) => acc + (u.amount || 0), 0);
  const available = Math.max(0, totalGenerated - totalUsed);

  return {
    monthKey,
    totalGenerated,
    totalUsed,
    available,
    daysWithSurplus,
    usages: monthUsages,
  };
}

/**
 * Calculate full target, projections, operational days, rhythm, and Gordura reserve
 */
export function calculateMonthTarget(
  monthKey: string,
  targetAmount: number,
  sales: Sale[] = [],
  expenses: Expense[] = [],
  closedPeriods: ClosedPeriod[] = [],
  currentDateObj: Date = new Date(),
  gorduraUsages: GorduraUsage[] = []
): TargetCalculation {
  const [yearStr, monthStr] = (monthKey || '2026-09').split('-');
  const year = parseInt(yearStr, 10) || 2026;
  const monthIndex = (parseInt(monthStr, 10) || 9) - 1;

  const safeSales = sales || [];
  const safeExpenses = expenses || [];
  const safeClosedPeriods = closedPeriods || [];
  const safeUsages = gorduraUsages || [];

  // Number of days in this month
  const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Filter sales and expenses for this month
  const monthSales = safeSales.filter((s) => s.monthKey === monthKey);
  const monthExpenses = safeExpenses.filter((e) => e.monthKey === monthKey);

  const totalSales = monthSales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
  const totalExpenses = monthExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const netResult = totalSales - totalExpenses;

  // Calculate weighted day targets with dynamic deficit redistribution for the whole month
  const dayTargets = calculateDayTargetsForMonth(
    monthKey,
    targetAmount,
    safeClosedPeriods,
    safeSales,
    safeUsages,
    currentDateObj
  );

  // Gordura Reserve balance
  const gorduraBalance = calculateGorduraBalance(
    monthKey,
    targetAmount,
    safeSales,
    safeClosedPeriods,
    safeUsages,
    currentDateObj
  );

  // Determine current day in the context of the selected month strictly in America/Sao_Paulo
  const brParts = getBrasiliaDateParts(currentDateObj);
  const currentYear = brParts.year;
  const currentMonthIdx = brParts.monthIndex;
  const currentDay = brParts.day;

  let evaluatedDay: number;
  let isCurrentMonth = false;

  if (year === currentYear && monthIndex === currentMonthIdx) {
    // Current active month
    evaluatedDay = Math.min(currentDay, totalDaysInMonth);
    isCurrentMonth = true;
  } else if (year < currentYear || (year === currentYear && monthIndex < currentMonthIdx)) {
    // Past month
    evaluatedDay = totalDaysInMonth;
  } else {
    // Future month
    evaluatedDay = 0;
  }

  // Find today's target info
  const todayDayStr = evaluatedDay > 0 ? (evaluatedDay < 10 ? `0${evaluatedDay}` : `${evaluatedDay}`) : '01';
  const todayDateStr = isCurrentMonth ? brParts.dateStr : `${yearStr}-${monthStr}-${todayDayStr}`;
  const todayDayInfo = dayTargets.find((d) => d.date === todayDateStr) || dayTargets[0] || {
    target: 0,
    baseTarget: 0,
    deficitAdded: 0,
    tier: 'media' as DayWeightTier,
    tierLabel: 'Meta Média',
    dayOfWeekName: 'Hoje',
  };

  const todayTarget = todayDayInfo.target || 0;
  const todayBaseTarget = todayDayInfo.baseTarget || todayTarget;
  const todayDeficitAdded = todayDayInfo.deficitAdded || 0;
  const todayTier = todayDayInfo.tier || ('media' as DayWeightTier);
  const todayTierLabel = todayDayInfo.tierLabel || 'Meta Média';
  const todayDayOfWeekName = todayDayInfo.dayOfWeekName || 'Hoje';

  // Total deficit redistributed across the month
  const totalDeficitRedistributed = dayTargets.reduce((acc, d) => acc + (d.missingDeficit || 0), 0);

  // Calculate sales made today (evaluated day)
  const todaySalesList = monthSales.filter((s) => s.date === todayDateStr);
  const todaySales = todaySalesList.reduce((acc, s) => acc + (s.totalAmount || 0), 0);

  // Gordura used today
  const todayUsages = safeUsages.filter((u) => u.date === todayDateStr);
  const todayGorduraUsed = todayUsages.reduce((acc, u) => acc + (u.amount || 0), 0);
  const todayEffectiveSales = todaySales + todayGorduraUsed;

  const todayRemainingTarget = Math.max(0, todayTarget - todayEffectiveSales);
  const isTodayTargetMet = todayTarget > 0 && todayEffectiveSales >= todayTarget;
  const todaySurplus = Math.max(0, todaySales - todayTarget);

  // Count closed days in this month
  let closedDaysCount = 0;
  let elapsedOperationalDays = 0;
  let remainingOperationalDays = 0;

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `${yearStr}-${monthStr}-${dayStr}`;
    const { isClosed } = isDateInClosedPeriods(dateStr, safeClosedPeriods);

    if (isClosed) {
      closedDaysCount++;
    } else {
      if (day <= evaluatedDay) {
        elapsedOperationalDays++;
      } else {
        remainingOperationalDays++;
      }
    }
  }

  const operationalDaysTotal = Math.max(1, totalDaysInMonth - closedDaysCount);

  // Operational daily average = total sales / elapsed operational days
  const effectiveElapsed = Math.max(1, elapsedOperationalDays);
  const operationalDailyAverage =
    elapsedOperationalDays > 0 ? totalSales / effectiveElapsed : totalSales > 0 ? totalSales : 0;

  // Projection formula
  let projectionAmount: number;
  if (!isCurrentMonth && evaluatedDay === totalDaysInMonth) {
    projectionAmount = totalSales;
  } else {
    projectionAmount = totalSales + operationalDailyAverage * remainingOperationalDays;
  }

  // Target math
  const isTargetMet = targetAmount > 0 && totalSales >= targetAmount;
  const remainingToTarget = Math.max(0, targetAmount - totalSales);
  const surplusAmount = Math.max(0, totalSales - targetAmount);
  const progressPercentage = targetAmount > 0 ? (totalSales / targetAmount) * 100 : 0;

  // Required per operational day:
  const effectiveRemainingDays = Math.max(1, remainingOperationalDays);
  const requiredPerOperationalDay = isTargetMet ? 0 : remainingToTarget / effectiveRemainingDays;

  // Rhythm and status determination
  let status: GoalStatus = 'on_pace';
  let statusTitle = 'NO RITMO';
  let statusMessage = 'Estamos no ritmo para atingir a meta.';

  if (monthSales.length === 0) {
    status = 'attention';
    statusTitle = 'AGUARDANDO VENDAS';
    statusMessage = 'Ainda não há vendas registradas neste mês. Registre a primeira venda para começar a acompanhar o ritmo.';
  } else if (isTargetMet) {
    status = 'target_achieved';
    statusTitle = 'META ATINGIDA!';
    statusMessage = `Excelente! Você ultrapassou a meta em ${formatCurrency(surplusAmount)}.`;
  } else if (projectionAmount >= targetAmount * 1.05) {
    status = 'above_pace';
    statusTitle = 'ACIMA DO RITMO';
    statusMessage = 'Excelente! A projeção está acima da meta.';
  } else if (projectionAmount >= targetAmount * 0.95) {
    status = 'on_pace';
    statusTitle = 'NO RITMO';
    statusMessage = 'Estamos no ritmo para atingir a meta.';
  } else if (projectionAmount >= targetAmount * 0.75) {
    status = 'attention';
    statusTitle = 'ATENÇÃO';
    statusMessage = 'Estamos próximos, mas precisamos aumentar o ritmo.';
  } else {
    status = 'behind_pace';
    statusTitle = 'ABAIXO DO RITMO';
    statusMessage = 'Precisamos acelerar as vendas para atingir a meta.';
  }

  return {
    monthKey,
    year,
    monthIndex,
    targetAmount,
    totalSales,
    totalExpenses,
    netResult,
    progressPercentage,
    totalDaysInMonth,
    closedDaysCount,
    operationalDaysTotal,
    elapsedOperationalDays,
    remainingOperationalDays,
    operationalDailyAverage,
    projectionAmount,
    requiredPerOperationalDay,
    todayBaseTarget,
    todayDeficitAdded,
    totalDeficitRedistributed,
    todayTarget,
    todaySales,
    todayGorduraUsed,
    todayEffectiveSales,
    todayRemainingTarget,
    isTodayTargetMet,
    todaySurplus,
    todayTier,
    todayTierLabel,
    todayDayOfWeekName,
    dayTargets,
    remainingToTarget,
    isTargetMet,
    surplusAmount,
    status,
    statusTitle,
    statusMessage,
    salesCount: monthSales.length,
    expensesCount: monthExpenses.length,
    gorduraBalance,
  };
}

/**
 * Calculate Daily Closing Data for a given date using the weighted day target and Gordura
 */
export function calculateDailyClosing(
  targetDateStr: string,
  sales: Sale[] = [],
  expenses: Expense[] = [],
  targetCalc?: TargetCalculation,
  closedPeriods: ClosedPeriod[] = [],
  gorduraUsages: GorduraUsage[] = []
): DailyClosingData {
  const safeSales = sales || [];
  const safeExpenses = expenses || [];
  const safeUsages = gorduraUsages || [];

  const daySales = safeSales.filter((s) => s.date === targetDateStr);
  const dayExpenses = safeExpenses.filter((e) => e.date === targetDateStr);

  const salesToday = daySales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
  const expensesToday = dayExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const resultToday = salesToday - expensesToday;

  // Extract monthKey and day from date string
  const safeDateStr = targetDateStr || getTodayBrasilia();
  const [yearStr, monthStr, dayStr] = safeDateStr.split('-');
  const dateMidday = new Date(`${safeDateStr}T12:00:00-03:00`);
  const dayOfWeek = dateMidday.getUTCDay();
  const dayOfWeekName = DAY_OF_WEEK_NAMES[dayOfWeek];
  const { tier, tierLabel } = getDayWeightAndTier(dayOfWeek);

  // Find exact weighted daily target and redistribution info from targetCalc dayTargets
  let dailyTarget = 0;
  let baseDailyTarget = 0;
  let deficitAddedToday = 0;

  if (targetCalc && targetCalc.dayTargets && targetCalc.dayTargets.length > 0) {
    const match = targetCalc.dayTargets.find((d) => d.date === targetDateStr);
    if (match) {
      dailyTarget = match.target;
      baseDailyTarget = match.baseTarget;
      deficitAddedToday = match.deficitAdded;
    }
  }

  // Fallback if not found in targetCalc
  if (dailyTarget === 0 && targetCalc) {
    const targetAmt = targetCalc.targetAmount || 20000;
    const targets = calculateDayTargetsForMonth(`${yearStr}-${monthStr}`, targetAmt, closedPeriods);
    const match = targets.find((d) => d.date === targetDateStr);
    dailyTarget = match ? match.target : targetAmt / 26;
    baseDailyTarget = match ? match.baseTarget : dailyTarget;
  }

  // Gordura used on this specific day
  const dayUsages = safeUsages.filter((u) => u.date === targetDateStr);
  const gorduraUsedToday = dayUsages.reduce((acc, u) => acc + (u.amount || 0), 0);
  const effectiveSalesToday = salesToday + gorduraUsedToday;

  const isDailyTargetMet = dailyTarget > 0 ? effectiveSalesToday >= dailyTarget : true;
  const remainingDailyTarget = Math.max(0, dailyTarget - effectiveSalesToday);
  const diff = Math.abs(effectiveSalesToday - dailyTarget);

  // Calculate redistribution impact if target was not met
  const dayNum = parseInt(dayStr, 10) || 1;
  const remainingOpenDays = targetCalc?.dayTargets?.filter((d) => !d.isClosed && d.dayNumber > dayNum) || [];
  const remainingOpenDaysCount = remainingOpenDays.length;
  const unmetDeficit = Math.max(0, dailyTarget - effectiveSalesToday);
  const unmetDeficitDistributedPerDay =
    remainingOpenDaysCount > 0 && unmetDeficit > 0 ? unmetDeficit / remainingOpenDaysCount : 0;

  const availableGordura = targetCalc?.gorduraBalance?.available ?? 0;
  const registerRecord = appStorage.getDailyRegisterForDate(targetDateStr);

  return {
    date: targetDateStr,
    salesToday,
    expensesToday,
    resultToday,
    dailyTarget,
    baseDailyTarget,
    deficitAddedToday,
    unmetDeficitDistributedPerDay,
    remainingOpenDaysCount,
    gorduraUsedToday,
    effectiveSalesToday,
    remainingDailyTarget,
    availableGordura,
    dayTier: tier,
    dayTierLabel: tierLabel,
    dayOfWeekName,
    isDailyTargetMet,
    diff,
    salesCount: daySales.length,
    expensesCount: dayExpenses.length,
    registerRecord,
  };
}
