/**
 * Web Audio API Sound Synthesizer for Video Calling
 * Provides zero-dependency, crystal-clear, zero-latency ringtones:
 * - Incoming WhatsApp-style melodic ringtone
 * - Outgoing telephone / WhatsApp ringback dial tone
 * - Busy / Call Declined tone
 * - Call End / Hangup tone
 */

class CallSoundManager {
  constructor() {
    this.audioCtx = null;
    this.activeInterval = null;
    this.activeNodes = [];
    this.isPlaying = false;
  }

  getAudioContext() {
    if (!this.audioCtx || this.audioCtx.state === "closed") {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Stops any currently playing ringtones or tones
   */
  stopAll() {
    if (this.activeInterval) {
      clearInterval(this.activeInterval);
      this.activeInterval = null;
    }

    this.activeNodes.forEach(({ osc, gain }) => {
      try {
        if (gain) {
          gain.gain.setValueAtTime(0, this.audioCtx?.currentTime || 0);
        }
        if (osc) {
          osc.stop();
          osc.disconnect();
        }
      } catch {
        // ignore already stopped nodes
      }
    });

    this.activeNodes = [];
    this.isPlaying = false;
  }

  /**
   * Plays a WhatsApp-style melodic chime chord for incoming calls (loops until stopped)
   */
  playIncomingRingtone() {
    this.stopAll();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.isPlaying = true;

    // Harmonic marimba / chime melody notes (Frequencies in Hz: E5, G#5, B5, E6, B5, G#5, E5)
    const melody = [
      { note: 659.25, time: 0.0, dur: 0.18 }, // E5
      { note: 830.61, time: 0.18, dur: 0.18 }, // G#5
      { note: 987.77, time: 0.36, dur: 0.18 }, // B5
      { note: 1318.51, time: 0.54, dur: 0.28 }, // E6
      { note: 987.77, time: 0.84, dur: 0.18 }, // B5
      { note: 830.61, time: 1.02, dur: 0.18 }, // G#5
      { note: 659.25, time: 1.20, dur: 0.35 }, // E5
    ];

    const playPhrase = () => {
      if (!this.isPlaying || !this.audioCtx || this.audioCtx.state === "closed") return;
      const startTime = this.audioCtx.currentTime + 0.05;

      melody.forEach(({ note, time, dur }) => {
        try {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(note, startTime + time);

          // Gentle bell envelope
          gain.gain.setValueAtTime(0.001, startTime + time);
          gain.gain.exponentialRampToValueAtTime(0.28, startTime + time + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + time + dur);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(startTime + time);
          osc.stop(startTime + time + dur + 0.05);

          this.activeNodes.push({ osc, gain });
        } catch {
          // ignore
        }
      });
    };

    // Play immediately and repeat every 2.4 seconds
    playPhrase();
    this.activeInterval = setInterval(() => {
      this.activeNodes = this.activeNodes.filter(({ osc }) => {
        try {
          return osc.playbackState !== undefined;
        } catch {
          return false;
        }
      });
      playPhrase();
    }, 2400);
  }

  /**
   * Plays the standard US/WhatsApp outgoing dial ringback tone (440Hz + 480Hz, 1.5s on, 2.5s off)
   */
  playOutgoingRingtone() {
    this.stopAll();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.isPlaying = true;

    const playDialTone = () => {
      if (!this.isPlaying || !this.audioCtx || this.audioCtx.state === "closed") return;
      const startTime = this.audioCtx.currentTime + 0.05;
      const duration = 1.6;

      try {
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(440, startTime); // Standard 440 Hz

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(480, startTime); // Standard 480 Hz

        // Smooth fade-in & fade-out envelope
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.1);
        gain.gain.setValueAtTime(0.12, startTime + duration - 0.1);
        gain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + duration + 0.05);
        osc2.stop(startTime + duration + 0.05);

        this.activeNodes.push({ osc: osc1, gain }, { osc: osc2, gain });
      } catch {
        // ignore
      }
    };

    playDialTone();
    this.activeInterval = setInterval(() => {
      this.activeNodes = [];
      playDialTone();
    }, 4000);
  }

  /**
   * Plays a 3-beep busy / call declined tone
   */
  playDeclinedTone() {
    this.stopAll();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime + 0.05;
    const beepDuration = 0.22;
    const pauseDuration = 0.18;

    for (let i = 0; i < 3; i++) {
      const offset = i * (beepDuration + pauseDuration);
      try {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(480, startTime + offset);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(620, startTime + offset);

        gain.gain.setValueAtTime(0.001, startTime + offset);
        gain.gain.linearRampToValueAtTime(0.15, startTime + offset + 0.02);
        gain.gain.setValueAtTime(0.15, startTime + offset + beepDuration - 0.02);
        gain.gain.linearRampToValueAtTime(0.0001, startTime + offset + beepDuration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(startTime + offset);
        osc2.start(startTime + offset);
        osc1.stop(startTime + offset + beepDuration + 0.05);
        osc2.stop(startTime + offset + beepDuration + 0.05);
      } catch {
        // ignore
      }
    }
  }

  /**
   * Plays a soft double-beep hangup / call end tone
   */
  playEndTone() {
    this.stopAll();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime + 0.05;
    const beeps = [480, 360];

    beeps.forEach((freq, i) => {
      const offset = i * 0.18;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime + offset);

        gain.gain.setValueAtTime(0.001, startTime + offset);
        gain.gain.linearRampToValueAtTime(0.14, startTime + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + offset + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime + offset);
        osc.stop(startTime + offset + 0.16);
      } catch {
        // ignore
      }
    });
  }
}

export const callSounds = new CallSoundManager();
export default callSounds;
