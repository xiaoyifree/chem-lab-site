"use client";

import { useEffect, useRef, useState } from "react";

let sharedAudioContext = null;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!sharedAudioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    sharedAudioContext = new AudioContextClass();
  }

  return sharedAudioContext;
}

function playClickTone() {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(440, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(660, context.currentTime + 0.08);

  gainNode.gain.setValueAtTime(0.0001, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.14);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.16);
}

export function SoundToggle({ compact = false }) {
  const [enabled, setEnabled] = useState(false);
  const readyRef = useRef(false);

  useEffect(() => {
    const onWindowClick = (event) => {
      const target = event.target;

      if (enabled && target instanceof HTMLElement && target.closest("a, button")) {
        playClickTone();
      }
    };

    window.addEventListener("click", onWindowClick);

    return () => window.removeEventListener("click", onWindowClick);
  }, [enabled]);

  const handleToggle = async () => {
    const context = getAudioContext();

    if (context?.state === "suspended") {
      await context.resume();
    }

    if (!readyRef.current) {
      readyRef.current = true;
    }

    const nextValue = !enabled;
    setEnabled(nextValue);

    if (nextValue) {
      playClickTone();
    }
  };

  return (
    <button
      aria-pressed={enabled}
      className={`sound-button ${compact ? "sound-compact" : ""}`}
      onClick={handleToggle}
      type="button"
    >
      音效：{enabled ? "开启" : "关闭"}
    </button>
  );
}
