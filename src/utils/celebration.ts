import confetti from 'canvas-confetti';
import { NotificationService } from './notifications';

/**
 * Multi-stage celebration effect with confetti cannons, star bursts, and fanfare sound
 */
export function triggerCelebrationEffect(type: 'month' | 'day' = 'month') {
  // 1. Play musical celebration fanfare
  try {
    NotificationService.playCelebrationFanfare();
  } catch {
    // Ignore audio restrictions
  }

  // 2. High-impact confetti cannon bursts
  try {
    const count = type === 'month' ? 200 : 120;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#fbbf24', '#f97316', '#34d399', '#ffffff'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    // Initial burst
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.4,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    // Side cannons (Left & Right)
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ['#f59e0b', '#10b981', '#fbbf24', '#ffffff'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ['#f59e0b', '#10b981', '#fbbf24', '#ffffff'],
      });
    }, 250);

    // Delayed grand star shower for monthly goal
    if (type === 'month') {
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.4 },
          shapes: ['circle', 'square'],
          colors: ['#f59e0b', '#10b981', '#eab308', '#ffffff'],
        });
      }, 600);
    }
  } catch {
    // Ignore canvas-confetti error on unsupported browsers
  }
}
