// Gravação de áudio pelo microfone (MediaRecorder).

export const canRecord = () =>
  typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';

export interface Recording {
  /** Para a gravação e devolve o áudio. */
  stop: () => Promise<{ blob: Blob; seconds: number }>;
}

/** Começa a gravar. Para sozinho depois de `maxMs`. */
export async function startRecording(maxMs = 30000): Promise<Recording> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const type = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg'].find((t) => MediaRecorder.isTypeSupported?.(t));
  const rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
  const chunks: Blob[] = [];
  const t0 = performance.now();
  rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  const done = new Promise<{ blob: Blob; seconds: number }>((res) => {
    rec.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      res({ blob: new Blob(chunks, { type: rec.mimeType || 'audio/webm' }), seconds: (performance.now() - t0) / 1000 });
    };
  });
  rec.start();
  const timer = setTimeout(() => { if (rec.state === 'recording') rec.stop(); }, maxMs);
  return {
    stop: () => {
      clearTimeout(timer);
      if (rec.state === 'recording') rec.stop();
      return done;
    },
  };
}
