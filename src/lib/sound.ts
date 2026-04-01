let audioCtx: AudioContext | null = null;

export function playBeep(enabled: boolean) {
  if (!enabled) return;

  if (typeof window === "undefined") return;

  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;

    if (!audioCtx) audioCtx = new Ctx();

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // Ignore audio failures (autoplay restrictions, unsupported browsers, etc.)
  }
}

