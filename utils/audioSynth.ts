// Web Audio API Synthesizer for Realistic Melodic Previews
class AudioSynthEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: number | null = null;
  private gainNode: GainNode | null = null;
  private currentStep: number = 0;
  private bpm: number = 120;
  private scale: number[] = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C major pentatonic / pop scale
  private bassScale: number[] = [130.81, 146.83, 164.81, 196.00, 220.00];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public start(bpm: number = 120, genre: string = "Pop") {
    this.stop();
    this.bpm = bpm;
    this.isPlaying = true;
    this.currentStep = 0;

    const ctx = this.getContext();
    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    this.gainNode.connect(ctx.destination);

    // Pick scale based on genre
    const lowerGenre = (genre || "").toLowerCase();
    if (lowerGenre.includes("r&b") || lowerGenre.includes("ballad") || lowerGenre.includes("soul")) {
      this.scale = [261.63, 311.13, 349.23, 392.00, 466.16, 523.25, 622.25]; // Minor pentatonic / soul
      this.bassScale = [130.81, 155.56, 174.61, 196.00];
    } else if (lowerGenre.includes("edm") || lowerGenre.includes("synth") || lowerGenre.includes("dance")) {
      this.scale = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99]; // D Major / Uplifting EDM
      this.bassScale = [146.83, 164.81, 185.00, 220.00];
    } else if (lowerGenre.includes("hip") || lowerGenre.includes("trap") || lowerGenre.includes("drill")) {
      this.scale = [220.00, 233.08, 261.63, 293.66, 329.63, 349.23, 440.00]; // Phrygian / Dark trap
      this.bassScale = [110.00, 116.54, 130.81, 146.83];
    } else {
      this.scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
      this.bassScale = [130.81, 146.83, 164.81, 196.00, 220.00];
    }

    const stepDurationMs = (60 / this.bpm / 2) * 1000; // 8th notes

    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying) return;
      this.playNoteStep(ctx);
      this.currentStep = (this.currentStep + 1) % 16;
    }, stepDurationMs);
  }

  private playNoteStep(ctx: AudioContext) {
    if (!this.gainNode) return;

    const now = ctx.currentTime;
    
    // Melody synth voice
    const melodyIndex = (this.currentStep * 3 + Math.floor(this.currentStep / 4)) % this.scale.length;
    const freq = this.scale[melodyIndex];

    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = this.currentStep % 4 === 0 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, now);

    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + 0.3);

    // Bassline pulse on downbeats (step 0, 4, 8, 12)
    if (this.currentStep % 4 === 0) {
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      const bassFreq = this.bassScale[Math.floor(this.currentStep / 4) % this.bassScale.length];

      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.exponentialRampToValueAtTime(0.25, now + 0.03);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      bassOsc.connect(bassGain);
      bassGain.connect(this.gainNode);

      bassOsc.start(now);
      bassOsc.stop(now + 0.5);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const audioSynth = new AudioSynthEngine();
