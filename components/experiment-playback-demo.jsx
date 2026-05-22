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

function inferDemoKind(experiment) {
  const slug = experiment.slug;

  if (slug.includes("indicator")) {
    return "indicator";
  }

  if (slug.includes("burning")) {
    return "flame";
  }

  if (slug.includes("crystallization") || slug.includes("heating")) {
    return "crystal";
  }

  if (slug.includes("precipitation") || slug.includes("hydroxide") || slug.includes("silver")) {
    return "precipitate";
  }

  if (slug.includes("distillation")) {
    return "distillation";
  }

  if (slug.includes("electroplating")) {
    return "electroplate";
  }

  if (slug.includes("rate-control")) {
    return "rate";
  }

  if (slug.includes("inference")) {
    return "inference";
  }

  return "reaction";
}

function IndicatorScene() {
  return (
    <div className="demo-scene demo-scene-indicator">
      {["pink", "violet", "amber"].map((tone, index) => (
        <div className={`demo-tube demo-tube-${tone}`} key={tone} style={{ "--tube-index": index }}>
          <span className="demo-tube-glass" />
          <span className="demo-tube-liquid" />
          <span className="demo-tube-badge" />
        </div>
      ))}
    </div>
  );
}

function FlameScene() {
  return (
    <div className="demo-scene demo-scene-flame">
      <div className="demo-burner">
        <span className="demo-burner-stem" />
        <span className="demo-burner-base" />
      </div>
      <div className="demo-flame-stack">
        <span className="demo-flame demo-flame-outer" />
        <span className="demo-flame demo-flame-middle" />
        <span className="demo-flame demo-flame-core" />
      </div>
      <div className="demo-spark-field">
        {Array.from({ length: 7 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="demo-metal-strip" />
    </div>
  );
}

function CrystalScene() {
  return (
    <div className="demo-scene demo-scene-crystal">
      <div className="demo-dish">
        <div className="demo-dish-liquid" />
        <div className="demo-dish-crystals">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>
      <div className="demo-heat-wave">
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}

function PrecipitateScene() {
  return (
    <div className="demo-scene demo-scene-precipitate">
      <div className="demo-mix-vessel">
        <div className="demo-mix-liquid demo-mix-left" />
        <div className="demo-mix-liquid demo-mix-right" />
        <div className="demo-cloud-bloom">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>
      <div className="demo-dropper" />
    </div>
  );
}

function DistillationScene() {
  return (
    <div className="demo-scene demo-scene-distillation">
      <div className="demo-flask">
        <div className="demo-flask-liquid" />
      </div>
      <div className="demo-condenser">
        <span className="demo-condenser-tube" />
        <span className="demo-condenser-flow" />
      </div>
      <div className="demo-receiver">
        <div className="demo-receiver-liquid" />
      </div>
      <div className="demo-vapor-trail">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}

function ElectroplateScene() {
  return (
    <div className="demo-scene demo-scene-electroplate">
      <div className="demo-cell">
        <div className="demo-cell-liquid" />
        <span className="demo-electrode demo-electrode-left" />
        <span className="demo-electrode demo-electrode-right" />
        <span className="demo-copper-coat" />
      </div>
      <div className="demo-circuit">
        <span className="demo-wire demo-wire-left" />
        <span className="demo-wire demo-wire-right" />
        <span className="demo-battery" />
      </div>
    </div>
  );
}

function RateScene() {
  return (
    <div className="demo-scene demo-scene-rate">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="demo-rate-vessel" key={index}>
          <span className="demo-rate-label">{index + 1}</span>
          <div className="demo-rate-liquid" />
          <div className="demo-rate-bubbles">
            {Array.from({ length: 4 + index * 2 }).map((__, bubbleIndex) => (
              <span key={bubbleIndex} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function InferenceScene() {
  return (
    <div className="demo-scene demo-scene-inference">
      <div className="demo-card-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="demo-link-lines">
        <span />
        <span />
        <span />
      </div>
      <div className="demo-focus-ring" />
    </div>
  );
}

function ReactionScene() {
  return (
    <div className="demo-scene demo-scene-reaction">
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
  );
}

function renderScene(kind) {
  switch (kind) {
    case "indicator":
      return <IndicatorScene />;
    case "flame":
      return <FlameScene />;
    case "crystal":
      return <CrystalScene />;
    case "precipitate":
      return <PrecipitateScene />;
    case "distillation":
      return <DistillationScene />;
    case "electroplate":
      return <ElectroplateScene />;
    case "rate":
      return <RateScene />;
    case "inference":
      return <InferenceScene />;
    default:
      return <ReactionScene />;
  }
}

export function ExperimentPlaybackDemo({ experiment }) {
  const demoSteps = experiment.demoSteps?.length ? experiment.demoSteps : buildFallbackSteps(experiment);
  const [stepIndex, setStepIndex] = useState(0);

  const theme = themeByLevel[experiment.levelKey] ?? themeByLevel.intermediate;
  const demoKind = inferDemoKind(experiment);

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
        className={`demo-stage demo-stage-${demoKind} demo-phase-${phase}`}
        style={{
          "--demo-left": theme.left,
          "--demo-right": theme.right,
          "--demo-glow": theme.glow,
          "--demo-accent": theme.accent
        }}
      >
        {renderScene(demoKind)}
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
