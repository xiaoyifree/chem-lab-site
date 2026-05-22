"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

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

const motionProfileByKind = {
  "fizz-transfer": {
    motionPreset: "gas-transfer",
    emphasisPhase: "transferring",
    transitionPreset: "reactive"
  },
  indicator: {
    motionPreset: "tone-shift",
    emphasisPhase: "reacting",
    transitionPreset: "gentle"
  },
  flame: {
    motionPreset: "flame-pulse",
    emphasisPhase: "reacting",
    transitionPreset: "energized"
  },
  crystal: {
    motionPreset: "growth-bloom",
    emphasisPhase: "observing",
    transitionPreset: "measured"
  },
  precipitate: {
    motionPreset: "cloud-bloom",
    emphasisPhase: "reacting",
    transitionPreset: "reactive"
  },
  distillation: {
    motionPreset: "flow-path",
    emphasisPhase: "observing",
    transitionPreset: "measured"
  },
  electroplate: {
    motionPreset: "deposit-build",
    emphasisPhase: "observing",
    transitionPreset: "measured"
  },
  electrolysis: {
    motionPreset: "charge-rise",
    emphasisPhase: "reacting",
    transitionPreset: "reactive"
  },
  rate: {
    motionPreset: "compare-speed",
    emphasisPhase: "observing",
    transitionPreset: "gentle"
  },
  inference: {
    motionPreset: "signal-map",
    emphasisPhase: "observing",
    transitionPreset: "gentle"
  },
  reaction: {
    motionPreset: "reaction-wave",
    emphasisPhase: "reacting",
    transitionPreset: "gentle"
  }
};

const transitionByPreset = {
  gentle: {
    type: "spring",
    stiffness: 180,
    damping: 24,
    mass: 0.92
  },
  reactive: {
    type: "spring",
    stiffness: 240,
    damping: 22,
    mass: 0.82
  },
  energized: {
    type: "spring",
    stiffness: 280,
    damping: 18,
    mass: 0.75
  },
  measured: {
    duration: 0.34,
    ease: [0.22, 1, 0.36, 1]
  }
};

const stageInteractionProfiles = {
  "fizz-transfer": {
    idle: {
      id: "marble-charge",
      icon: "🪨",
      label: "拖入大理石",
      helper: "把大理石拖到左侧反应瓶底部",
      toolTone: "stone",
      start: { x: 0.12, y: 0.2 },
      target: { x: 0.27, y: 0.78 },
      targetSide: "left",
      radius: 78,
      nextStep: 1
    },
    loaded: {
      id: "acid-pour",
      icon: "🧪",
      label: "拖入稀盐酸",
      helper: "把稀盐酸拖到左侧瓶口开始反应",
      toolTone: "acid",
      start: { x: 0.12, y: 0.7 },
      target: { x: 0.27, y: 0.34 },
      targetSide: "left",
      radius: 82,
      nextStep: 2
    },
    reacting: {
      id: "limewater-check",
      icon: "🫙",
      label: "拖入石灰水",
      helper: "把澄清石灰水拖到右侧检验位",
      toolTone: "lime",
      start: { x: 0.88, y: 0.2 },
      target: { x: 0.73, y: 0.35 },
      targetSide: "right",
      radius: 86,
      nextStep: 3
    }
  }
};

const ExperimentConsoleMotionContext = createContext(false);

export function ExperimentConsoleMotionProvider({ children, enabled = true }) {
  return <ExperimentConsoleMotionContext.Provider value={enabled}>{children}</ExperimentConsoleMotionContext.Provider>;
}

function useExperimentConsoleMotionEnabled() {
  return useContext(ExperimentConsoleMotionContext);
}

function resolveInteractionProfile(kind, phaseKey) {
  return stageInteractionProfiles[kind]?.[phaseKey] ?? null;
}

function resolveStagePoint(bounds, point) {
  return {
    x: bounds.width * point.x,
    y: bounds.height * point.y
  };
}

function getPointDistance(pointA, pointB) {
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}

function useStageBounds(containerRef) {
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    const node = containerRef.current;

    if (!node) {
      return undefined;
    }

    const updateBounds = () => {
      const nextWidth = node.clientWidth;
      const nextHeight = node.clientHeight;

      if (!nextWidth || !nextHeight) {
        return;
      }

      setBounds((currentBounds) => {
        if (currentBounds?.width === nextWidth && currentBounds?.height === nextHeight) {
          return currentBounds;
        }

        return {
          width: nextWidth,
          height: nextHeight
        };
      });
    };

    updateBounds();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateBounds);
      return () => window.removeEventListener("resize", updateBounds);
    }

    const observer = new ResizeObserver(updateBounds);
    observer.observe(node);

    return () => observer.disconnect();
  }, [containerRef]);

  return bounds;
}

export function resolveMotionTransition(preset, reduceMotion = false) {
  if (reduceMotion) {
    return {
      duration: 0.16,
      ease: "easeOut"
    };
  }

  return transitionByPreset[preset] ?? transitionByPreset.gentle;
}

function MotionElement({ as = "div", enabled, motionProps, children, ...rest }) {
  const Component = enabled ? motion[as] : as;

  if (!enabled) {
    return <Component {...rest}>{children}</Component>;
  }

  return (
    <Component initial={false} {...motionProps} {...rest}>
      {children}
    </Component>
  );
}

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
    if (stepIndex === 1) return "loaded";
    if (stepIndex === 2) return "reacting";
    if (stepIndex === 3) return "transferring";
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
  const motionProfile = motionProfileByKind[kind] ?? motionProfileByKind.reaction;
  const phaseKey = resolvePhaseKey(kind, stepIndex, totalSteps);
  const isFizzTransfer = kind === "fizz-transfer";

  return {
    experiment,
    kind,
    theme,
    stepIndex,
    totalSteps,
    progress,
    phaseKey,
    motionPreset: motionProfile.motionPreset,
    emphasisPhase: motionProfile.emphasisPhase,
    transitionPreset: motionProfile.transitionPreset,
    interactionProfile: resolveInteractionProfile(kind, phaseKey),
    flags: {
      chargeLoaded: isFizzTransfer ? stepIndex >= 1 : stepIndex >= 0,
      reactionStarted: isFizzTransfer ? stepIndex >= 2 : stepIndex >= 1,
      receiverReady: isFizzTransfer ? stepIndex >= 3 : false,
      transferActive: isFizzTransfer ? stepIndex >= 3 : stepIndex >= 2,
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

const stageToolSize = {
  width: 138,
  height: 76
};

function StageDragTool({ containerRef, interaction, onCommit, reduceMotion }) {
  const bounds = useStageBounds(containerRef);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStatus, setDragStatus] = useState("ready");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
    setDragStatus("ready");
    setIsDragging(false);
  }, [interaction?.id, interaction?.nextStep]);

  if (!interaction || !bounds) {
    return null;
  }

  const startCenter = resolveStagePoint(bounds, interaction.start);
  const targetCenter = resolveStagePoint(bounds, interaction.target);
  const snapOffset = {
    x: targetCenter.x - startCenter.x,
    y: targetCenter.y - startCenter.y
  };
  const isSnapping = dragStatus === "snapping";
  const animateTarget = isSnapping ? snapOffset : dragOffset;

  return (
    <>
      <div
        className={`lab-drop-zone lab-drop-zone-${interaction.targetSide} ${
          isDragging || isSnapping ? "lab-drop-zone-active" : ""
        }`}
        style={{
          left: targetCenter.x,
          top: targetCenter.y
        }}
      >
        <span>{interaction.targetSide === "left" ? "反应位" : "检验位"}</span>
      </div>

      <motion.button
        animate={
          reduceMotion
            ? { opacity: 1, x: animateTarget.x, y: animateTarget.y, scale: 1 }
            : {
                opacity: 1,
                x: animateTarget.x,
                y: animateTarget.y,
                scale: isSnapping ? 1.04 : isDragging ? 1.02 : 1,
                rotate: isDragging ? [0, -2, 2, 0] : 0
              }
        }
        className={`lab-stage-tool lab-stage-tool-${interaction.toolTone} ${
          isDragging ? "lab-stage-tool-dragging" : ""
        }`}
        drag={!isSnapping}
        dragConstraints={containerRef}
        dragElastic={0.08}
        dragMomentum={false}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -10 }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 14 }}
        key={interaction.id}
        onAnimationComplete={() => {
          if (dragStatus === "snapping") {
            setDragStatus("committed");
            onCommit?.(interaction.nextStep);
          }
        }}
        onDragEnd={(_, info) => {
          setIsDragging(false);

          const releaseCenter = {
            x: startCenter.x + info.offset.x,
            y: startCenter.y + info.offset.y
          };

          if (getPointDistance(releaseCenter, targetCenter) <= interaction.radius) {
            setDragStatus("snapping");
            setDragOffset(snapOffset);
            return;
          }

          setDragStatus("ready");
          setDragOffset({ x: 0, y: 0 });
        }}
        onDragStart={() => setIsDragging(true)}
        style={{
          left: startCenter.x - stageToolSize.width / 2,
          top: startCenter.y - stageToolSize.height / 2,
          width: stageToolSize.width,
          minHeight: stageToolSize.height
        }}
        transition={
          isSnapping
            ? {
                type: "spring",
                stiffness: 320,
                damping: 26,
                mass: 0.72
              }
            : resolveMotionTransition("reactive", reduceMotion)
        }
        type="button"
        whileDrag={reduceMotion ? undefined : { scale: 1.04, boxShadow: "0 18px 36px rgba(4, 8, 17, 0.24)" }}
      >
        <span className="lab-stage-tool-icon">{interaction.icon}</span>
        <span className="lab-stage-tool-copy">
          <strong>{interaction.label}</strong>
          <small>{interaction.helper}</small>
        </span>
      </motion.button>
    </>
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

function FlameScene({ state, motionEnabled, reduceMotion }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const isActive = state.flags.reactionStarted;

  return (
    <div className="demo-scene demo-scene-flame">
      <div className="demo-burner">
        <span className="demo-burner-stem" />
        <span className="demo-burner-base" />
      </div>
      <MotionElement
        as="div"
        className="demo-flame-stack"
        enabled={motionEnabled}
        motionProps={{
          animate: reduceMotion
            ? { opacity: 1 }
            : isActive
              ? {
                  scale: [0.98, 1.04, 1, 1.06, 1.02],
                  y: [0, -2, 1, -3, 0],
                  filter: [
                    "brightness(1)",
                    "brightness(1.16)",
                    "brightness(1.04)",
                    "brightness(1.2)",
                    "brightness(1.06)"
                  ]
                }
              : { scale: 0.96, y: 2, filter: "brightness(0.95)" },
          transition: isActive
            ? {
                ...transition,
                duration: 1.4,
                repeat: Infinity,
                repeatType: "mirror"
              }
            : transition
        }}
      >
        <span className="demo-flame demo-flame-outer" />
        <span className="demo-flame demo-flame-middle" />
        <span className="demo-flame demo-flame-core" />
      </MotionElement>
      <MotionElement
        as="div"
        className="demo-spark-field"
        enabled={motionEnabled}
        motionProps={{
          animate: reduceMotion
            ? { opacity: 1 }
            : isActive
              ? {
                  opacity: [0.48, 1, 0.74],
                  y: [0, -8, -2]
                }
              : { opacity: 0.38, y: 4 },
          transition: isActive
            ? {
                duration: 1.1,
                ease: "easeOut",
                repeat: Infinity,
                repeatType: "mirror"
              }
            : transition
        }}
      >
        {RepeatedSpans({ count: 7 })}
      </MotionElement>
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

function PrecipitateScene({ state, motionEnabled, reduceMotion }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const isMixing = state.phaseKey === "reacting";
  const isSettling = state.phaseKey === "observing" || state.phaseKey === "complete";

  return (
    <div className="demo-scene demo-scene-precipitate">
      <div className="demo-mix-vessel">
        <div className="demo-mix-liquid demo-mix-left" />
        <div className="demo-mix-liquid demo-mix-right" />
        <MotionElement
          as="div"
          className="demo-cloud-bloom"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : {
                  opacity: isMixing ? [0.42, 0.9, 0.72] : isSettling ? 0.94 : 0.25,
                  scale: isMixing ? [0.78, 1.08, 0.96] : isSettling ? 1 : 0.72,
                  y: isMixing ? [8, -4, 0] : isSettling ? 4 : 12
                },
            transition: isMixing
              ? {
                  ...transition,
                  duration: 0.95
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 6 })}
        </MotionElement>
      </div>
      <MotionElement
        as="div"
        className="demo-dropper"
        enabled={motionEnabled}
        motionProps={{
          animate: reduceMotion
            ? { opacity: 1 }
            : {
                y: isMixing ? [-10, 10, 2] : -2,
                rotate: isMixing ? [0, 4, -2, 0] : 0,
                scale: isMixing ? [1, 1.02, 0.98, 1] : 1
              },
          transition: isMixing
            ? {
                ...transition,
                duration: 0.88
              }
            : transition
        }}
      />
    </div>
  );
}

function DistillationScene({ state, motionEnabled, reduceMotion }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const isFlowing = state.phaseKey === "observing" || state.phaseKey === "complete";

  return (
    <div className="demo-scene demo-scene-distillation">
      <div className="demo-flask">
        <div className="demo-flask-liquid" />
      </div>
      <div className="demo-condenser">
        <span className="demo-condenser-tube" />
        <MotionElement
          as="span"
          className="demo-condenser-flow"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isFlowing
                ? {
                    opacity: [0.45, 0.95, 0.65],
                    scaleX: [0.8, 1.05, 0.92]
                  }
                : { opacity: 0.24, scaleX: 0.74 },
            transition: isFlowing
              ? {
                  duration: 1,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        />
      </div>
      <div className="demo-receiver">
        <MotionElement
          as="div"
          className="demo-receiver-liquid"
          enabled={motionEnabled}
          motionProps={{
            style: { transformOrigin: "center bottom" },
            animate: reduceMotion
              ? { opacity: 1 }
              : {
                  scaleY: isFlowing ? 0.78 + state.progress * 0.22 : 0.68,
                  opacity: isFlowing ? 0.88 : 0.52
                },
            transition
          }}
        />
      </div>
      <MotionElement
        as="div"
        className="demo-vapor-trail"
        enabled={motionEnabled}
        motionProps={{
          animate: reduceMotion
            ? { opacity: 1 }
            : isFlowing
              ? {
                  opacity: [0.28, 0.8, 0.44],
                  x: [0, 10, 2],
                  y: [0, -10, -4]
                }
              : { opacity: 0.2, x: -2, y: 2 },
          transition: isFlowing
            ? {
                duration: 1.2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }
            : transition
        }}
      >
        {RepeatedSpans({ count: 5 })}
      </MotionElement>
    </div>
  );
}

function ElectroplateScene({ state, motionEnabled, reduceMotion }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const depositionProgress = 0.28 + state.progress * 0.72;
  const isCharging = state.flags.reactionStarted;

  return (
    <div className="demo-scene demo-scene-electroplate">
      <div className="demo-cell">
        <div className="demo-cell-liquid" />
        <span className="demo-electrode demo-electrode-left" />
        <span className="demo-electrode demo-electrode-right" />
        <MotionElement
          as="span"
          className="demo-copper-coat"
          enabled={motionEnabled}
          motionProps={{
            style: { transformOrigin: "center bottom" },
            animate: reduceMotion
              ? { opacity: 1 }
              : {
                  scaleY: depositionProgress,
                  opacity: isCharging ? 0.45 + state.progress * 0.55 : 0.2
                },
            transition
          }}
        />
      </div>
      <MotionElement
        as="div"
        className="demo-circuit"
        enabled={motionEnabled}
        motionProps={{
          animate: reduceMotion
            ? { opacity: 1 }
            : isCharging
              ? {
                  opacity: [0.52, 0.92, 0.66],
                  scale: [0.98, 1.02, 1]
                }
              : { opacity: 0.42, scale: 0.98 },
          transition: isCharging
            ? {
                duration: 1.1,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }
            : transition
        }}
      >
        <span className="demo-wire demo-wire-left" />
        <span className="demo-wire demo-wire-right" />
        <span className="demo-battery" />
      </MotionElement>
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

function FizzTransferScene({ state, motionEnabled, reduceMotion, interactive, onInteractiveStepChange }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const sceneRef = useRef(null);
  const isCharged = state.flags.chargeLoaded;
  const isReacting = state.flags.reactionStarted;
  const isTransferring = state.phaseKey === "transferring" || state.phaseKey === "verified";
  const isVerified = state.phaseKey === "verified";
  const interaction = interactive ? state.interactionProfile : null;
  const stageHint = interaction
    ? interaction.helper
    : isVerified
      ? "石灰水已经明显变浑浊，完成二氧化碳检验。"
      : isTransferring
        ? "观察导管中的气体持续进入石灰水。"
        : "现在进入观察阶段，确认反应是否稳定进行。";

  return (
    <div className={`lab-stage-shell ${interactive ? "lab-stage-shell-interactive" : ""}`} ref={sceneRef}>
      <AnimatePresence initial={false} mode="wait">
        <MotionElement
          as="div"
          className="lab-stage-hint"
          enabled={motionEnabled}
          key={`${state.phaseKey}-hint`}
          motionProps={{
            initial: reduceMotion ? false : { opacity: 0, y: 10, scale: 0.985 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.985 },
            transition
          }}
        >
          <span className="lab-stage-hint-label">{interaction ? "拖拽交互" : "阶段提示"}</span>
          <strong>{interaction ? interaction.label : state.phaseKey === "verified" ? "完成检验" : "观察变化"}</strong>
          <p>{stageHint}</p>
        </MotionElement>
      </AnimatePresence>

      <LabBeaker side="left" liquidClassName="lab-liquid-reactant">
        <div className={`lab-rocks ${isCharged ? "lab-rocks-loaded" : ""}`}>{RepeatedSpans({ count: 3 })}</div>
        <MotionElement
          as="div"
          className="lab-bubbles"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isReacting
                ? {
                    opacity: [0.55, 1, 0.78],
                    scale: [0.82, 1.08, 0.94]
                  }
                : isTransferring
                  ? { opacity: 0.86, scale: 1 }
                  : { opacity: 0.18, scale: 0.72 },
            transition: isReacting
              ? {
                  ...transition,
                  duration: 0.9
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 9 })}
        </MotionElement>
        <MotionElement
          as="div"
          className="lab-reactive-ripple"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isReacting
                ? {
                    opacity: [0.2, 0.48, 0.24],
                    scale: [0.82, 1.08, 0.92]
                  }
                : { opacity: 0, scale: 0.72 },
            transition: isReacting
              ? {
                  duration: 1.2,
                  ease: "easeInOut",
                  repeat: Infinity
                }
              : transition
          }}
        />
      </LabBeaker>

      <div className={`lab-transfer-line ${isTransferring ? "lab-transfer-line-active" : ""}`}>
        <MotionElement
          as="span"
          className="lab-flow-dot"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isTransferring
                ? {
                    opacity: [0.35, 1, 0.45],
                    x: [0, 72, 0]
                  }
                : { opacity: 0.18, x: 0 },
            transition: isTransferring
              ? {
                  duration: 1.1,
                  ease: "easeInOut",
                  repeat: Infinity
                }
              : transition
          }}
        />
      </div>

      <LabBeaker
        side="right"
        liquidClassName={`lab-liquid-limewater ${isTransferring ? "lab-liquid-ready" : "lab-liquid-dormant"}`}
      >
        <MotionElement
          as="div"
          className="lab-clouds"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isVerified
                ? {
                    opacity: [0.48, 0.95, 0.72],
                    scale: [0.84, 1.08, 1]
                  }
                : isTransferring
                  ? { opacity: 0.58, scale: 0.9 }
                  : { opacity: 0.18, scale: 0.72 },
            transition: isVerified
              ? {
                  ...transition,
                  duration: 1
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 3 })}
        </MotionElement>
      </LabBeaker>

      {interactive ? (
        <StageDragTool
          containerRef={sceneRef}
          interaction={interaction}
          onCommit={onInteractiveStepChange}
          reduceMotion={reduceMotion}
        />
      ) : null}
    </div>
  );
}

function renderScene(kind, state, motionEnabled, reduceMotion, interactive, onInteractiveStepChange) {
  switch (kind) {
    case "fizz-transfer":
      return (
        <FizzTransferScene
          interactive={interactive}
          motionEnabled={motionEnabled}
          onInteractiveStepChange={onInteractiveStepChange}
          reduceMotion={reduceMotion}
          state={state}
        />
      );
    case "indicator":
      return <IndicatorScene />;
    case "flame":
      return <FlameScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    case "crystal":
      return <CrystalScene />;
    case "precipitate":
      return <PrecipitateScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    case "distillation":
      return <DistillationScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    case "electroplate":
      return <ElectroplateScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
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

export function ExperimentAnimationStage({
  experiment,
  stepIndex,
  totalSteps,
  kindOverride,
  interactive = false,
  onInteractiveStepChange
}) {
  const state = useMemo(
    () => createExperimentAnimationState({ experiment, stepIndex, totalSteps, kindOverride }),
    [experiment, kindOverride, stepIndex, totalSteps]
  );
  const motionEnabled = useExperimentConsoleMotionEnabled();
  const reduceMotion = useReducedMotion();
  const stageTransition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const stageScene = (
    <MotionElement
      as="div"
      className={state.kind === "fizz-transfer" ? "lab-stage-scene" : "demo-stage-scene"}
      enabled={motionEnabled}
      key={state.experiment.slug}
      motionProps={{
        initial:
          reduceMotion
            ? { opacity: 1 }
            : {
                opacity: 0,
                y: state.kind === "fizz-transfer" ? 18 : 16,
                scale: 0.98
              },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.985 },
        transition: stageTransition
      }}
    >
      {renderScene(state.kind, state, motionEnabled, reduceMotion, interactive, onInteractiveStepChange)}
    </MotionElement>
  );

  if (state.kind === "fizz-transfer") {
    return (
      <MotionElement
        as="div"
        className={`lab-stage phase-${state.phaseKey}`}
        data-motion-preset={state.motionPreset}
        enabled={motionEnabled}
        motionProps={{
          layout: !reduceMotion,
          animate: reduceMotion
            ? { opacity: 1 }
            : {
                opacity: 1,
                scale: state.phaseKey === state.emphasisPhase ? 1.01 : 1,
                boxShadow:
                  state.phaseKey === state.emphasisPhase
                    ? `0 0 42px ${state.theme.glow}`
                    : "0 0 0 rgba(0, 0, 0, 0)"
              },
          transition: stageTransition
        }}
      >
        {motionEnabled ? <AnimatePresence initial={false} mode="wait">{stageScene}</AnimatePresence> : stageScene}
      </MotionElement>
    );
  }

  return (
    <MotionElement
      as="div"
      className={`demo-stage demo-stage-${state.kind} demo-phase-${state.phaseKey}`}
      data-motion-preset={state.motionPreset}
      style={{
        "--demo-left": state.theme.left,
        "--demo-right": state.theme.right,
        "--demo-glow": state.theme.glow,
        "--demo-accent": state.theme.accent
      }}
      enabled={motionEnabled}
      motionProps={{
        layout: !reduceMotion,
        animate: reduceMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              scale: state.phaseKey === state.emphasisPhase ? 1.01 : 1,
              boxShadow:
                state.phaseKey === state.emphasisPhase
                  ? `0 0 38px ${state.theme.glow}`
                  : "0 0 0 rgba(0, 0, 0, 0)"
            },
        transition: stageTransition
      }}
    >
      {motionEnabled ? <AnimatePresence initial={false} mode="wait">{stageScene}</AnimatePresence> : stageScene}
    </MotionElement>
  );
}
