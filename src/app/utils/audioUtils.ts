import hbdSound from './elvis-presleyy.mp3';

let currentAudio: HTMLAudioElement | null = null;
let stopTimer: ReturnType<typeof setTimeout> | null = null;

const clearStopTimer = () => {
  if (stopTimer) {
    clearTimeout(stopTimer);
    stopTimer = null;
  }
};

export const playHBD = () => {
  clearStopTimer();

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(hbdSound);
  currentAudio.volume = 0.5;
  currentAudio.loop = true;

  currentAudio.play().catch(e => console.error('Audio play failed:', e));

  // Durasi 26 detik (26000 ms)
  stopTimer = setTimeout(() => {
    stopHBD();
  }, 34000);
};

export const stopHBD = () => {
  clearStopTimer();

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

