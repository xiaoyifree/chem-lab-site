"use client";

import { useMemo, useState } from "react";

const flowSteps = [
  {
    title: "加入大理石",
    note: "锥形瓶中先放入块状碳酸钙，为反应提供稳定表面积。"
  },
  {
    title: "滴加稀盐酸",
    note: "酸液接触碳酸钙后开始放出二氧化碳，锥形瓶内出现持续气泡。"
  },
  {
    title: "导入石灰水",
    note: "气体通过导管进入澄清石灰水，逐渐使其变浑浊。"
  },
  {
    title: "完成检验",
    note: "石灰水明显浑浊，说明我们得到并确认了二氧化碳。"
  }
];

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

  if (type === "fizz") {
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(420, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(130, context.currentTime + 0.18);
    gainNode.gain.setValueAtTime(0.0001, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.06, context.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
    return;
  }

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(600, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(900, context.currentTime + 0.12);
  gainNode.gain.setValueAtTime(0.0001, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.05, context.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.14);
}

export function CarbonDioxideLabDemo() {
  const [stepIndex, setStepIndex] = useState(0);

  const phase = useMemo(() => {
    if (stepIndex === 0) {
      return "idle";
    }

    if (stepIndex === 1) {
      return "reacting";
    }

    if (stepIndex === 2) {
      return "transferring";
    }

    return "verified";
  }, [stepIndex]);

  const handleAdvance = async () => {
    const context = getAudioContext();

    if (context?.state === "suspended") {
      await context.resume();
    }

    const nextStep = Math.min(flowSteps.length - 1, stepIndex + 1);
    setStepIndex(nextStep);
    playTone(nextStep >= 1 ? "fizz" : "click");
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
    <section className="lab-demo-panel">
      <div className={`lab-stage phase-${phase}`}>
        <div className="lab-beaker lab-beaker-left">
          <div className="lab-liquid lab-liquid-reactant" />
          <div className="lab-rocks">
            <span />
            <span />
            <span />
          </div>
          <div className="lab-bubbles">
            {Array.from({ length: 9 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
        </div>

        <div className="lab-transfer-line">
          <span className="lab-flow-dot" />
        </div>

        <div className="lab-beaker lab-beaker-right">
          <div className="lab-liquid lab-liquid-limewater" />
          <div className="lab-clouds">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className="lab-demo-copy">
        <p className="eyebrow">Live Demo</p>
        <h3>{flowSteps[stepIndex].title}</h3>
        <p>{flowSteps[stepIndex].note}</p>
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
