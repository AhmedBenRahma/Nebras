import confetti from 'canvas-confetti';

export function triggerConfetti() {
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.35 },
    colors: ['#2563eb', '#06b6d4', '#f97316', '#10b981']
  });
}