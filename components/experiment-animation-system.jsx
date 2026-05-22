"use client";

import { useMemo, useState } from "react";

export const themeByLevel = {
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

export async function resumeDemoAudio() {
  const context = getAudioContext();

  if (context?.state === "suspended") {
    await context.resume();
  }

  return context;
}

export function playPlaybackTone(type) {
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

export function getDemoStepsForExperiment(experiment) {
  return experiment.demoSteps?.length ? experiment.demoSteps : buildFallbackSteps(experiment);
}

export function inferDemoKind(experiment) {
  const slug = experiment.slug;

  if (slug.includes("carbon-dioxide")) {
    return "fizz-transfer";
  }

  if (slug.includes("indicator")) {
    return "indicator";
  }

  if (slug.includes("magnesium") || slug.includes("burning")) {
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

  if (slug.includes("electrolysis")) {
    return "electrolysis";
  }

  if (slug.includes("rate-control")) {
    return "rate";
  }

  if (slug.includes("inference")) {
    return "inference";
  }

  return "reaction";
}

function resolvePhaseKey(kind, stepIndex, totalSteps) {
  if (kind === "fizz-transfer") {
    if (stepIndex === 0) return "idle";
    if (stepIndex === 1) return "reacting";
    if (stepIndex === 2) return "transferring";
    return "verified";
  }

  if (stepIndex === 0) return "setup";
  if (stepIndex >= totalSteps - 1) return "complete";
  if (stepIndex >= Math.max(1, totalSteps - 2)) return "observing";
  return "reacting";
}

export function createExperimentAnimationState({ experiment, stepIndex, totalSteps, kindOverride }) {
  const kind = kindOverride ?? inferDemoKind(experiment);
  const progress = totalSteps > 1 ? stepIndex / (totalSteps - 1) : 0;
  const theme = themeByLevel[experiment.levelKey] ?? themeByLevel.intermediate;

  return {
    experiment,
    kind,
    theme,
    stepIndex,
    totalSteps,
    progress,
    phaseKey: resolvePhaseKey(kind, stepIndex, totalSteps),
    flags: {
      reactionStarted: stepIndex >= 1,
      transferActive: stepIndex >= 2,
      finished: stepIndex >= totalSteps - 1
    }
  };
}

export function useExperimentPlaybackController({
  steps,
  controlledStepIndex,
  onAdvance,
  onReset,
  toneOnAdvance = "react"
}) {
  const [localStepIndex, setLocalStepIndex] = useState(0);
  const stepIndex = controlledStepIndex ?? localStepIndex;

  const updateStepIndex = (nextStep) => {
    if (controlledStepIndex !== undefined) {
      onAdvance?.(nextStep);
      return;
    }

    setLocalStepIndex(nextStep);
  };

  const handleAdvance = async () => {
    await resumeDemoAudio();
    const nextStep = Math.min(steps.length - 1, stepIndex + 1);
    updateStepIndex(nextStep);
    playPlaybackTone(nextStep >= 1 ? toneOnAdvance : "click");
  };

  const handleReset = async () => {
    await resumeDemoAudio();

    if (onReset) {
      onReset();
    } else {
      setLocalStepIndex(0);
    }

    playPlaybackTone("click");
  };

  const handleStepChange = async (nextStep) => {
    await resumeDemoAudio();
    updateStepIndex(nextStep);
    playPlaybackTone(nextStep >= 1 ? toneOnAdvance : "click");
  };

  return {
    stepIndex,
    handleAdvance,
    handleReset,
    handleStepChange
  };
}

function RepeatedSpans({ count }) {
  return Array.from({ length: count }).map((_, index) => <span key={index} />);
}

function Tube({ tone }) {
  return (
    <div className={`demo-tube demo-tube-${tone}`}>
      <span className="demo-tube-glass" />
      <span className="demo-tube-liquid" />
      <span className="demo-tube-badge" />
    </div>
  );
}

function Vessel({ side, leftLiquidClass, rightLiquidClass, showSediment = true, showVapor = true }) {
  return (
    <>
      <div className={`demo-vessel demo-vessel-${side}`}>
        <div className={`demo-liquid ${side === "left" ? leftLiquidClass : rightLiquidClass}`} />
        {showSediment ? <div className="demo-sediment">{RepeatedSpans({ count: 3 })}</div> : null}
        {showVapor && side === "right" ? <div className="demo-vapor">{RepeatedSpans({ count: 3 })}</div> : null}
      </div>
    </>
  );
}

function ParticleField({ count = 8 }) {
  return <div className="demo-particles">{RepeatedSpans({ count })}</div>;
}

function StageBridge() {
  return (
    <div className="demo-stage-bridge">
      <span className="demo-bridge-dot" />
    </div>
  );
}

function LabBeaker({ side, liquidClassName, children }) {
  return (
    <div className={`lab-beaker lab-beaker-${side}`}>
      <div className={`lab-liquid ${liquidClassName}`} />
      {children}
    </div>
  );
}

function IndicatorScene() {
  return (
    <div className="demo-scene demo-scene-indicator">
      {["pink", "violet", "amber"].map((tone) => (
        <Tube key={tone} tone={tone} />
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
      <div className="demo-spark-field">{RepeatedSpans({ count: 7 })}</div>
      <div className="demo-metal-strip" />
    </div>
  );
}

function CrystalScene() {
  return (
    <div className="demo-scene demo-scene-crystal">
      <div className="demo-dish">
        <div className="demo-dish-liquid" />
        <div className="demo-dish-crystals">{RepeatedSpans({ count: 6 })}</div>
      </div>
      <div className="demo-heat-wave">{RepeatedSpans({ count: 4 })}</div>
    </div>
  );
}

function PrecipitateScene() {
  return (
    <div className="demo-scene demo-scene-precipitate">
      <div className="demo-mix-vessel">
        <div className="demo-mix-liquid demo-mix-left" />
        <div className="demo-mix-liquid demo-mix-right" />
        <div className="demo-cloud-bloom">{RepeatedSpans({ count: 6 })}</div>
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
      <div className="demo-vapor-trail">{RepeatedSpans({ count: 5 })}</div>
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

function ElectrolysisScene() {
  return (
    <div className="demo-scene demo-scene-electroplate">
      <div className="demo-cell">
        <div className="demo-cell-liquid" />
        <span className="demo-electrode demo-electrode-left" />
        <span className="demo-electrode demo-electrode-right" />
      </div>
      <div className="demo-circuit">
        <span className="demo-wire demo-wire-left" />
        <span className="demo-wire demo-wire-right" />
        <span className="demo-battery" />
      </div>
      <ParticleField count={8} />
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
          <div className="demo-rate-bubbles">{RepeatedSpans({ count: 4 + index * 2 })}</div>
        </div>
      ))}
    </div>
  );
}

function InferenceScene() {
  return (
    <div className="demo-scene demo-scene-inference">
      <div className="demo-card-grid">{RepeatedSpans({ count: 4 })}</div>
      <div className="demo-link-lines">{RepeatedSpans({ count: 3 })}</div>
      <div className="demo-focus-ring" />
    </div>
  );
}

function ReactionScene() {
  return (
    <div className="demo-scene demo-scene-reaction">
      <div className="demo-stage-orbit" />
      <Vessel side="left" leftLiquidClass="demo-liquid-left" rightLiquidClass="demo-liquid-right" showVapor={false} />
      <StageBridge />
      <Vessel side="right" leftLiquidClass="demo-liquid-left" rightLiquidClass="demo-liquid-right" />
      <ParticleField count={8} />
    </div>
  );
}

function FizzTransferScene() {
  return (
    <div className="lab-stage-shell">
      <LabBeaker side="left" liquidClassName="lab-liquid-reactant">
        <div className="lab-rocks">{RepeatedSpans({ count: 3 })}</div>
        <div className="lab-bubbles">{RepeatedSpans({ count: 9 })}</div>
      </LabBeaker>

      <div className="lab-transfer-line">
        <span className="lab-flow-dot" />
      </div>

      <LabBeaker side="right" liquidClassName="lab-liquid-limewater">
        <div className="lab-clouds">{RepeatedSpans({ count: 3 })}</div>
      </LabBeaker>
    </div>
  );
}

function renderScene(kind) {
  switch (kind) {
    case "fizz-transfer":
      return <FizzTransferScene />;
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
    case "electrolysis":
      return <ElectrolysisScene />;
    case "rate":
      return <RateScene />;
    case "inference":
      return <InferenceScene />;
    default:
      return <ReactionScene />;
  }
}

export function ExperimentAnimationStage({ experiment, stepIndex, totalSteps, kindOverride }) {
  const state = useMemo(
    () => createExperimentAnimationState({ experiment, stepIndex, totalSteps, kindOverride }),
    [experiment, kindOverride, stepIndex, totalSteps]
  );

  if (state.kind === "fizz-transfer") {
    return <div className={`lab-stage phase-${state.phaseKey}`}>{renderScene(state.kind)}</div>;
  }

  return (
    <div
      className={`demo-stage demo-stage-${state.kind} demo-phase-${state.phaseKey}`}
      style={{
        "--demo-left": state.theme.left,
        "--demo-right": state.theme.right,
        "--demo-glow": state.theme.glow,
        "--demo-accent": state.theme.accent
      }}
    >
      {renderScene(state.kind)}
    </div>
  );
}
