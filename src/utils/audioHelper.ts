// Web Audio API based Meow Synthesizer
// Synthesizes a realistic, cute high-pitched meow sound without any audio assets!

let audioCtx: AudioContext | null = null;

export const playMeowSound = () => {
  try {
    // Initialize AudioContext on first user interaction
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    
    // 1. Create nodes
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    // 2. Connect nodes
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // 3. Configure Oscillator - Triangle wave gives a warm woodwind-like sound, perfect for formants
    osc.type = 'triangle';
    
    // Pitch sweep: "M-e-o-w" sweep starts slightly lower, climbs rapidly, then slides down.
    // e.g., 380Hz -> 760Hz (climb) -> 450Hz (slide)
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.35);

    // 4. Configure Filter to shape vocal formants (nasal, cat-like sound)
    filter.type = 'bandpass';
    filter.Q.value = 3.5;
    // Sweep the filter frequency to mimic the mouth opening ("eh" to "oo")
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(2800, now + 0.08);
    filter.frequency.exponentialRampToValueAtTime(700, now + 0.35);

    // 5. Volume Envelope (Attack-Decay-Sustain-Release)
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.25, now + 0.05); // quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.18, now + 0.15); // decay
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.38); // release

    // 6. Start and Stop
    osc.start(now);
    osc.stop(now + 0.4);
  } catch (error) {
    console.warn('Web Audio meow synthesis failed:', error);
  }
};
