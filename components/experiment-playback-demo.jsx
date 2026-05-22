"use client";

import { useMemo, useState } from "react";

const themeByLevel = {
  beginner: {
    left: "rgba(45, 212, 191, 0.95)",
    right: "rgba(96, 165, 250, 0.95)",
    glow: "rgba(45, 212, 191, 0.36)",
    accent: "rgba(255, 255, 255, 0.88)"
  },
  intermediate: {
    left: "rgba(96, 165, 250, 0.95)",
    right: "rgba(59, 130, 246, 0.95)",
    glow: "rgba(59, 130, 246, 0.34)",
    accent: "rgba(255, 255, 255, 0.88)"
  },
  advanced: {
    left: "rgba(244, 114, 182, 0.88)",
    right: "rgba(251, 191, 36, 0.9)",
    glow: "rgba(251, 191, 36, 0.32)",
    accent: "rgba(255, 255, 255, 0.92)"
  }
};

let demoAudioContext = null;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!demoAudioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    demoAudioContext = new AudioContextClass();
  }

  return demoAudioContext;
}

function playTone(type) {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  if (type === "react") {
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(360, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(190, context.currentTime + 0.18);
    gainNode.gain.setValueAtTime(0.0001, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.07, context.currentTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
    return;
  }

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(580, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(860, context.currentTime + 0.12);
  gainNode.gain.setValueAtTime(0.0001, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.05, context.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.14);
}

function buildFallbackSteps(experiment) {
  const firstMaterials = experiment.materials.slice(0, 3).join("、");
  const firstQuestion = experiment.practice?.[0];

  return [
    {
      title: "准备器材",
      note: `先准备${firstMaterials}等核心器材和药品，确认分组操作顺序。`
    },
    {
      title: "开始反应",
      note: experiment.steps[1] || experiment.steps[0]
    },
    {
      title: "观察现象",
      note: experiment.observation
    },
    {
      title: "得出结论",
      note: firstQuestion
        ? `记录现象后，继续思考：${firstQuestion}`
        : `根据实验现象总结本节重点，并回到方程式 ${experiment.equation}。`
    }
  ];
}

export function ExperimentPlaybackDemo({ experiment }) {
  const demoSteps = experiment.demoSteps?.length ? experiment.demoSteps : buildFallbackSteps(experiment);
  const [stepIndex, setStepIndex] = useState(0);

  const theme = themeByLevel[experiment.levelKey] ?? themeByLevel.intermediate;

  const phase = useMemo(() => {
    if (stepIndex === 0) {
      return "setup";
    }

    if (stepIndex === 1) {
      return "reacting";
    }

    if (stepIndex === 2) {
      return "observing";
    }

    return "complete";
  }, [stepIndex]);

  const handleAdvance = async () => {
    const context = getAudioContext();

    if (context?.state === "suspended") {
      await context.resume();
    }

    const nextStep = Math.min(demoSteps.length - 1, stepIndex + 1);
    setStepIndex(nextStep);
    playTone(nextStep >= 1 ? "react" : "click");
  };

  const handleReset = async () => {
    const context = getAudioContext();

    if (context?.state === "suspended") {
      await context.resume();
    }

    setStepIndex(0);
    playTone("click");
  };

  return (
    <section className="lab-demo-panel generic-demo-panel">
      <div
        className={`demo-stage demo-phase-${phase}`}
        style={{
          "--demo-left": theme.left,
          "--demo-right": theme.right,
          "--demo-glow": theme.glow,
          "--demo-accent": theme.accent
        }}
      >
        <div className="demo-stage-orbit" />
        <div className="demo-vessel demo-vessel-left">
          <div className="demo-liquid demo-liquid-left" />
          <div className="demo-sediment">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="demo-stage-bridge">
          <span className="demo-bridge-dot" />
        </div>

        <div className="demo-vessel demo-vessel-right">
          <div className="demo-liquid demo-liquid-right" />
          <div className="demo-vapor">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="demo-particles">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>

      <div className="lab-demo-copy">
        <p className="eyebrow">Live Demo</p>
        <h3>{demoSteps[stepIndex].title}</h3>
        <p>{demoSteps[stepIndex].note}</p>
        <div className="chip-row demo-step-row">
          {demoSteps.map((step, index) => (
            <span className={`chip ${index === stepIndex ? "chip-active" : ""}`} key={step.title}>
              {step.title}
            </span>
          ))}
        </div>
        <div className="lab-demo-actions">
          <button className="button button-primary" onClick={handleAdvance} type="button">
            下一阶段
          </button>
          <button className="button button-secondary" onClick={handleReset} type="button">
            重新演示
          </button>
        </div>
      </div>
    </section>
  );
}
