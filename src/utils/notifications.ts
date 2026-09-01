/**
 * Notifications utility for Fronteira Cutelaria
 * Handles Browser Push Notifications, In-App Audio Feedback & Alerts
 */

export class NotificationService {
  private static audioCtx: AudioContext | null = null;

  private static getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Request push notification permissions from browser
   */
  public static async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  /**
   * Check if notifications are supported and permitted
   */
  public static isSupported(): boolean {
    return 'Notification' in window;
  }

  public static getPermission(): NotificationPermission {
    if (!('Notification' in window)) return 'denied';
    return Notification.permission;
  }

  /**
   * Play an artisan metallic success chime or positive notification sound
   */
  public static playSuccessChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Harmonic chime (anvil-like resonant tone)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.25); // D6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.85);
      osc2.stop(now + 0.85);
    } catch {
      // Ignore audio failure
    }
  }

  /**
   * Play celebratory target achieved fanfare
   */
  public static playCelebrationFanfare() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.1;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.65);
      });
    } catch {
      // Ignore audio failure
    }
  }

  /**
   * Send a push notification (and trigger local alerts)
   */
  public static sendNotification(title: string, body: string, iconUrl?: string): boolean {
    // Play chime
    this.playSuccessChime();

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: iconUrl || 'https://i.ibb.co/NgSQ0Fvt/Chat-GPT-Image-30-de-ago-de-2026-14-51-51.png',
          badge: iconUrl || 'https://i.ibb.co/NgSQ0Fvt/Chat-GPT-Image-30-de-ago-de-2026-14-51-51.png',
          tag: 'fronteira-daily-target',
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}
