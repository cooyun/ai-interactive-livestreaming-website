import confetti from "canvas-confetti";

export function triggerConfetti() {
  if (typeof window === "undefined") return;

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#38bdf8", "#818cf8", "#c084fc", "#f43f5e", "#fbbf24"],
  });
}

export function triggerGiftConfetti(type: string) {
  if (typeof window === "undefined") return;

  if (type === "rocket" || type === "crown") {
    // Big double blast
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#ec4899", "#8b5cf6", "#3b82f6", "#eab308"],
    });
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 250);
  } else {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#10b981", "#06b6d4", "#3b82f6"],
    });
  }
}
