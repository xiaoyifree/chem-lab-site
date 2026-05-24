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
  clock: {
    motionPreset: "clock-flash",
    emphasisPhase: "reacting",
    transitionPreset: "reactive"
  },
  mirror: {
    motionPreset: "mirror-build",
    emphasisPhase: "observing",
    transitionPreset: "measured"
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
  chromatography: {
    motionPreset: "band-separate",
    emphasisPhase: "observing",
    transitionPreset: "measured"
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

export const experimentRuleCatalog = {
  "carbonate-charge": {
    id: "carbonate-charge",
    title: "装入碳酸盐固体",
    inputReagents: ["calcium-carbonate"],
    reactants: ["CaCO3"],
    products: ["待加酸"],
    resultEffect: "setup",
    resultLabel: "等待酸化",
    observation: "大理石先进入反应瓶，系统等待酸液触发产气。"
  },
  "acid-carbonate-gas": {
    id: "acid-carbonate-gas",
    title: "酸 + 碳酸盐",
    inputReagents: ["calcium-carbonate", "hydrochloric-acid"],
    reactants: ["CaCO3", "HCl"],
    products: ["CO2", "CaCl2", "H2O"],
    resultEffect: "gas",
    resultLabel: "产生气体",
    observation: "酸液接触碳酸盐后产生 CO2，气泡和液面波纹明显增强。"
  },
  "carbon-dioxide-transfer": {
    id: "carbon-dioxide-transfer",
    title: "CO2 导管传输",
    inputReagents: ["carbon-dioxide"],
    reactants: ["CO2"],
    products: ["进入检验瓶"],
    resultEffect: "transfer",
    resultLabel: "气体流动",
    observation: "CO2 沿导管进入右侧检验瓶，准备与石灰水反应。"
  },
  "limewater-clouding": {
    id: "limewater-clouding",
    title: "CO2 + 石灰水",
    inputReagents: ["carbon-dioxide", "limewater"],
    reactants: ["CO2", "Ca(OH)2"],
    products: ["CaCO3↓", "H2O"],
    resultEffect: "clouding",
    resultLabel: "石灰水变浑浊",
    observation: "二氧化碳通入澄清石灰水后生成碳酸钙，液体出现乳白浑浊。"
  },
  "indicator-color-shift": {
    id: "indicator-color-shift",
    title: "酸碱指示剂变色",
    inputReagents: ["acid", "base", "indicator"],
    reactants: ["H+", "OH-", "indicator"],
    products: ["color-shift"],
    resultEffect: "color",
    resultLabel: "颜色突变",
    observation: "酸碱度变化驱动指示剂结构变化，画面用颜色扩散表现 pH 转换。"
  },
  "precipitate-formation": {
    id: "precipitate-formation",
    title: "离子沉淀反应",
    inputReagents: ["soluble-cation-salt", "soluble-anion-salt"],
    reactants: ["cation", "anion"],
    products: ["insoluble precipitate"],
    resultEffect: "precipitate",
    resultLabel: "沉淀扩散",
    observation: "两种离子混合后形成难溶物，浑浊云团先扩散再向底部聚沉。"
  },
  "combustion-oxidation": {
    id: "combustion-oxidation",
    title: "燃烧氧化",
    inputReagents: ["fuel", "oxygen", "heat"],
    reactants: ["fuel", "O2"],
    products: ["oxide", "heat", "light"],
    resultEffect: "flame",
    resultLabel: "火焰增强",
    observation: "可燃物与氧气反应放热发光，火焰主层、亮度脉冲和火星同步增强。"
  },
  crystallization: {
    id: "crystallization",
    title: "结晶析出",
    inputReagents: ["saturated-solution", "heat"],
    reactants: ["saturated solution"],
    products: ["crystals"],
    resultEffect: "crystal",
    resultLabel: "晶体生长",
    observation: "溶液浓缩或冷却后达到过饱和，晶核出现并逐步长成可见晶体。"
  },
  distillation: {
    id: "distillation",
    title: "沸点差分离",
    inputReagents: ["mixed-liquid", "heat"],
    reactants: ["mixed liquid", "heat"],
    products: ["distillate"],
    resultEffect: "flow",
    resultLabel: "冷凝流动",
    observation: "低沸点组分先汽化，经冷凝管液化并流入接收瓶。"
  },
  electroplating: {
    id: "electroplating",
    title: "电解沉积",
    inputReagents: ["metal-ion-solution", "electrode", "current"],
    reactants: ["metal ions", "electrons"],
    products: ["metal coating"],
    resultEffect: "coating",
    resultLabel: "金属镀层增长",
    observation: "金属离子在阴极得电子还原，表面镀层逐步增厚。"
  },
  electrolysis: {
    id: "electrolysis",
    title: "电解分解",
    inputReagents: ["electrolyte", "electrode", "current"],
    reactants: ["electrolyte", "current"],
    products: ["gas at electrodes"],
    resultEffect: "charge",
    resultLabel: "两极产物",
    observation: "电流驱动氧化还原反应，两极分别产生气体或金属沉积。"
  },
  "silver-mirror": {
    id: "silver-mirror",
    title: "银氨还原",
    inputReagents: ["aldehyde", "tollens-reagent"],
    reactants: ["aldehyde", "Ag(NH3)2+"],
    products: ["Ag mirror"],
    resultEffect: "coating",
    resultLabel: "银膜生成",
    observation: "醛基还原银氨络离子，试管壁逐渐出现明亮银镜。"
  },
  "iodine-clock": {
    id: "iodine-clock",
    title: "碘钟突变",
    inputReagents: ["iodate", "bisulfite", "starch"],
    reactants: ["iodate", "bisulfite", "starch"],
    products: ["starch-iodine complex"],
    resultEffect: "clock",
    resultLabel: "颜色瞬变",
    observation: "还原剂耗尽后碘迅速累积，淀粉络合物让溶液瞬间变深色。"
  },
  chromatography: {
    id: "chromatography",
    title: "层析分离",
    inputReagents: ["pigment-mix", "solvent", "chromatography-paper"],
    reactants: ["pigment mix", "solvent"],
    products: ["separated bands"],
    resultEffect: "separation",
    resultLabel: "色带分离",
    observation: "不同色素在固定相和流动相间分配不同，形成分层色带。"
  },
  "reaction-general": {
    id: "reaction-general",
    title: "反应现象匹配",
    reactants: ["reagents"],
    products: ["observable result"],
    resultEffect: "reaction",
    resultLabel: "现象生成",
    observation: "根据实验类型推导当前可观察结果，并交给动画层表现。"
  }
};

const phaseRuleByKind = {
  "fizz-transfer": {
    idle: "carbonate-charge",
    loaded: "acid-carbonate-gas",
    reacting: "acid-carbonate-gas",
    transferring: "carbon-dioxide-transfer",
    verified: "limewater-clouding"
  }
};

const defaultRuleByKind = {
  clock: "iodine-clock",
  mirror: "silver-mirror",
  indicator: "indicator-color-shift",
  flame: "combustion-oxidation",
  crystal: "crystallization",
  precipitate: "precipitate-formation",
  distillation: "distillation",
  electroplate: "electroplating",
  electrolysis: "electrolysis",
  chromatography: "chromatography",
  reaction: "reaction-general"
};

function resolveRuleId({ experiment, kind, phaseKey }) {
  if (experiment.ruleSet?.[phaseKey]) {
    return experiment.ruleSet[phaseKey];
  }

  if (experiment.ruleId) {
    return experiment.ruleId;
  }

  return phaseRuleByKind[kind]?.[phaseKey] ?? defaultRuleByKind[kind] ?? "reaction-general";
}

function resolveExperimentRule({ experiment, kind, phaseKey }) {
  const ruleId = resolveRuleId({ experiment, kind, phaseKey });
  return experimentRuleCatalog[ruleId] ?? experimentRuleCatalog["reaction-general"];
}

function normalizeReagentList(reagentIds) {
  return [...new Set(reagentIds)].map((reagentId) => String(reagentId).trim()).filter(Boolean).sort();
}

export function evaluateExperimentRule(reagentIds) {
  const normalizedReagents = normalizeReagentList(reagentIds);

  return (
    Object.values(experimentRuleCatalog).find((rule) => {
      const ruleReagents = normalizeReagentList(rule.inputReagents ?? []);

      if (!ruleReagents.length || ruleReagents.length !== normalizedReagents.length) {
        return false;
      }

      return ruleReagents.every((reagentId, index) => reagentId === normalizedReagents[index]);
    }) ?? null
  );
}

const stageInteractionProfiles = {
  "fizz-transfer": {
    idle: {
      id: "marble-charge",
      ruleId: "carbonate-charge",
      icon: "🪨",
      label: "拖入大理石",
      helper: "把大理石拖到左侧反应瓶底部",
      toolTone: "stone",
      start: { x: 0.12, y: 0.2 },
      target: { x: 0.27, y: 0.78 },
      targetSide: "left",
      radius: 78,
      commitEffect: "charge-drop",
      commitDelayMs: 520,
      pourPose: {
        rotate: -12,
        scale: 1.03
      },
      nextStep: 1
    },
    loaded: {
      id: "acid-pour",
      ruleId: "acid-carbonate-gas",
      icon: "🧪",
      label: "拖入稀盐酸",
      helper: "把稀盐酸拖到左侧瓶口开始反应",
      toolTone: "acid",
      start: { x: 0.12, y: 0.7 },
      target: { x: 0.27, y: 0.34 },
      targetSide: "left",
      radius: 82,
      commitEffect: "liquid-pour",
      commitDelayMs: 960,
      pourPose: {
        rotate: -24,
        scale: 1.04
      },
      nextStep: 2
    },
    reacting: {
      id: "limewater-check",
      ruleId: "limewater-clouding",
      icon: "🫙",
      label: "拖入石灰水",
      helper: "把澄清石灰水拖到右侧检验位",
      toolTone: "lime",
      start: { x: 0.88, y: 0.2 },
      target: { x: 0.73, y: 0.35 },
      targetSide: "right",
      radius: 86,
      commitEffect: "liquid-pour",
      commitDelayMs: 900,
      pourPose: {
        rotate: 22,
        scale: 1.04
      },
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

function resolveInteractionProfile(kind, phaseKey, rule) {
  const profile = stageInteractionProfiles[kind]?.[phaseKey] ?? null;

  if (!profile) {
    return null;
  }

  return {
    ...profile,
    rule: experimentRuleCatalog[profile.ruleId] ?? rule
  };
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

  if (slug.includes("iodine-clock")) {
    return "clock";
  }

  if (slug.includes("silver-mirror")) {
    return "mirror";
  }

  if (
    slug.includes("indicator") ||
    slug.includes("neutralization") ||
    slug.includes("titration") ||
    slug.includes("buffer") ||
    slug.includes("iodine-starch")
  ) {
    return "indicator";
  }

  if (slug.includes("magnesium") || slug.includes("burning")) {
    return "flame";
  }

  if (slug.includes("crystallization") || slug.includes("heating")) {
    return "crystal";
  }

  if (
    slug.includes("precipitation") ||
    slug.includes("hydroxide") ||
    slug.includes("silver") ||
    slug.includes("limewater") ||
    slug.includes("fehling") ||
    slug.includes("colloid")
  ) {
    return "precipitate";
  }

  if (slug.includes("distillation")) {
    return "distillation";
  }

  if (slug.includes("electroplating")) {
    return "electroplate";
  }

  if (slug.includes("electrolysis") || slug.includes("galvanic")) {
    return "electrolysis";
  }

  if (slug.includes("chromatography")) {
    return "chromatography";
  }

  if (slug.includes("rate-control") || slug.includes("rusting")) {
    return "rate";
  }

  if (slug.includes("inference")) {
    return "inference";
  }

  if (
    slug.includes("oxygen") ||
    slug.includes("peroxide") ||
    slug.includes("nitric-acid") ||
    slug.includes("aluminum-sodium") ||
    slug.includes("sodium-water") ||
    slug.includes("fountain") ||
    slug.includes("saponification") ||
    slug.includes("esterification") ||
    slug.includes("aspirin") ||
    slug.includes("sugar")
  ) {
    return "reaction";
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
  const rule = resolveExperimentRule({ experiment, kind, phaseKey });
  const isFizzTransfer = kind === "fizz-transfer";
  const reactionStarted = isFizzTransfer ? stepIndex >= 2 : stepIndex >= 1;

  return {
    experiment,
    kind,
    theme,
    stepIndex,
    totalSteps,
    progress,
    phaseKey,
    rule,
    resultEffect: rule.resultEffect,
    matchedReagents: rule.inputReagents ?? [],
    motionPreset: motionProfile.motionPreset,
    emphasisPhase: motionProfile.emphasisPhase,
    transitionPreset: motionProfile.transitionPreset,
    interactionProfile: resolveInteractionProfile(kind, phaseKey, rule),
    flags: {
      chargeLoaded: isFizzTransfer ? stepIndex >= 1 : stepIndex >= 0,
      reactionStarted,
      receiverReady: isFizzTransfer ? stepIndex >= 3 : false,
      transferActive: isFizzTransfer ? stepIndex >= 3 : stepIndex >= 2,
      gasProduced: reactionStarted && rule.resultEffect === "gas",
      precipitateFormed:
        reactionStarted && (rule.resultEffect === "precipitate" || rule.resultEffect === "clouding"),
      colorChanged:
        reactionStarted && (rule.resultEffect === "color" || rule.resultEffect === "clock"),
      coatingFormed: reactionStarted && rule.resultEffect === "coating",
      separationVisible: reactionStarted && rule.resultEffect === "separation",
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

function Tube({ tone, children }) {
  return (
    <div className={`demo-tube demo-tube-${tone}`}>
      <span className="demo-tube-glass" />
      <span className="demo-tube-liquid" />
      <span className="demo-tube-badge" />
      {children}
    </div>
  );
}

function Vessel({ side, leftLiquidClass, rightLiquidClass, showSediment = true, showVapor = true }) {
  return (
    <>
      <div className={`demo-vessel demo-vessel-${side}`}>
        <span className="demo-vessel-rim" />
        <span className="demo-vessel-highlight" />
        <span className="demo-vessel-graduations" />
        <div className={`demo-liquid ${side === "left" ? leftLiquidClass : rightLiquidClass}`}>
          <span className="demo-liquid-meniscus" />
        </div>
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
      <span className="demo-bridge-glass" />
      <span className="demo-bridge-dot" />
    </div>
  );
}

function SurfaceWave({ className, count = 3 }) {
  return <div className={className}>{RepeatedSpans({ count })}</div>;
}

function DiffusionField({ className, count = 4 }) {
  return <div className={className}>{RepeatedSpans({ count })}</div>;
}

function SedimentField({ className, count = 4 }) {
  return <div className={className}>{RepeatedSpans({ count })}</div>;
}

function LabBeaker({ side, liquidClassName, children }) {
  return (
    <div className={`lab-beaker lab-beaker-${side}`}>
      <span className="lab-beaker-rim" />
      <span className="lab-glass-highlight" />
      <span className="lab-measure-lines" />
      <div className={`lab-liquid ${liquidClassName}`}>
        <span className="lab-liquid-meniscus" />
      </div>
      {children}
    </div>
  );
}

const stageToolSize = {
  width: 152,
  height: 92
};

function StageDragTool({ containerRef, interaction, onCommit, reduceMotion }) {
  const bounds = useStageBounds(containerRef);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStatus, setDragStatus] = useState("ready");
  const [isDragging, setIsDragging] = useState(false);
  const commitTimerRef = useRef(null);

  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
    setDragStatus("ready");
    setIsDragging(false);
  }, [interaction?.id, interaction?.nextStep]);

  useEffect(() => {
    if (dragStatus !== "pouring") {
      return undefined;
    }

    const delay = reduceMotion ? 180 : interaction?.commitDelayMs ?? 760;
    commitTimerRef.current = window.setTimeout(() => {
      setDragStatus("committed");
      onCommit?.(interaction.nextStep);
    }, delay);

    return () => {
      if (commitTimerRef.current) {
        window.clearTimeout(commitTimerRef.current);
        commitTimerRef.current = null;
      }
    };
  }, [dragStatus, interaction, onCommit, reduceMotion]);

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
  const isPouring = dragStatus === "pouring";
  const activeOffset = isSnapping || isPouring ? snapOffset : dragOffset;
  const pourPose = interaction.pourPose ?? { rotate: 0, scale: 1.02 };
  const animateTarget = reduceMotion
    ? { opacity: 1, x: activeOffset.x, y: activeOffset.y, scale: 1, rotate: 0 }
    : {
        opacity: 1,
        x: activeOffset.x,
        y: activeOffset.y,
        scale: isPouring ? pourPose.scale ?? 1.03 : isSnapping ? 1.04 : isDragging ? 1.02 : 1,
        rotate: isPouring ? pourPose.rotate ?? 0 : isDragging ? [0, -2, 2, 0] : 0
      };

  return (
    <>
      <div
        className={`lab-drop-zone lab-drop-zone-${interaction.targetSide} ${
          isDragging || isSnapping || isPouring ? "lab-drop-zone-active" : ""
        }`}
        style={{
          left: targetCenter.x,
          top: targetCenter.y
        }}
      >
        <span>{interaction.targetSide === "left" ? "反应位" : "检验位"}</span>
      </div>

      <AnimatePresence initial={false}>
        {isPouring ? (
          <motion.div
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            className={`lab-stage-action lab-stage-action-${interaction.commitEffect} lab-stage-action-${interaction.toolTone}`}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: -8 }}
            key={`${interaction.id}-action`}
            style={{
              left: targetCenter.x,
              top: targetCenter.y
            }}
            transition={resolveMotionTransition("reactive", reduceMotion)}
          >
            {interaction.commitEffect === "charge-drop" ? (
              <div className="lab-stage-charge-field">{RepeatedSpans({ count: 4 })}</div>
            ) : (
              <>
                <span className="lab-stage-pour-stream" />
                <div className="lab-stage-pour-droplets">{RepeatedSpans({ count: 5 })}</div>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        animate={animateTarget}
        className={`lab-stage-tool lab-stage-tool-${interaction.toolTone} ${
          isDragging ? "lab-stage-tool-dragging" : ""
        } ${isPouring ? "lab-stage-tool-pouring" : ""}`}
        drag={!isSnapping && !isPouring}
        dragConstraints={containerRef}
        dragElastic={0.08}
        dragMomentum={false}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -10 }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 14 }}
        key={interaction.id}
        onAnimationComplete={() => {
          if (dragStatus === "snapping") {
            if (interaction.commitEffect) {
              setDragStatus("pouring");
              return;
            }

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
          isPouring
            ? {
                type: "spring",
                stiffness: 260,
                damping: 22,
                mass: 0.76
              }
            : isSnapping
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
        <span className="lab-stage-tool-icon" aria-hidden="true">
          <span className="lab-reagent-bottle-liquid" />
          <span className="lab-reagent-bottle-label">{interaction.icon}</span>
        </span>
        <span className="lab-stage-tool-copy">
          <strong>{isPouring ? "正在加入..." : interaction.label}</strong>
          <small>
            {isPouring
              ? interaction.rule?.resultLabel ?? "已经吸附到目标位，正在完成加入动作"
              : interaction.helper}
          </small>
        </span>
      </motion.button>
    </>
  );
}

function IndicatorScene({ state, motionEnabled, reduceMotion }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const isActive = state.flags.reactionStarted || state.phaseKey === "observing" || state.phaseKey === "complete";

  return (
    <div className="demo-scene demo-scene-indicator">
      {["pink", "violet", "amber"].map((tone, index) => (
        <Tube key={tone} tone={tone}>
          <MotionElement
            as="div"
            className="demo-tube-surface"
            enabled={motionEnabled}
            motionProps={{
              animate: reduceMotion
                ? { opacity: 1 }
                : isActive
                  ? {
                      opacity: [0.36, 0.82, 0.54],
                      y: [2, -3, 0],
                      scaleX: [0.95, 1.04, 0.99]
                    }
                  : { opacity: 0.24, y: 2, scaleX: 0.94 },
              transition: isActive
                ? {
                    duration: 1.08,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: index * 0.14
                  }
                : transition
            }}
          >
            {RepeatedSpans({ count: 3 })}
          </MotionElement>
          <MotionElement
            as="div"
            className="demo-tube-bloom"
            enabled={motionEnabled}
            motionProps={{
              animate: reduceMotion
                ? { opacity: 1 }
                : isActive
                  ? {
                      opacity: [0.16, 0.48, 0.24],
                      scale: [0.82, 1.06, 0.94],
                      y: [8, -2, 2]
                    }
                  : { opacity: 0.08, scale: 0.78, y: 10 },
              transition: isActive
                ? {
                    duration: 1.18,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: index * 0.16
                  }
                : transition
            }}
          >
            {RepeatedSpans({ count: 3 })}
          </MotionElement>
        </Tube>
      ))}
    </div>
  );
}

function ClockScene({ state, motionEnabled, reduceMotion }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const isTriggered = state.flags.reactionStarted || state.phaseKey === "observing" || state.phaseKey === "complete";
  const elapsed = Math.max(0, Math.round(state.progress * 90));

  return (
    <div className="demo-scene demo-scene-clock">
      <div className="demo-clock-vessel">
        <div className="demo-clock-liquid" />
        <MotionElement
          as="div"
          className="demo-clock-surface"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isTriggered
                ? { opacity: [0.34, 0.82, 0.52], y: [2, -3, 0], scaleX: [0.95, 1.04, 0.99] }
                : { opacity: 0.2, y: 3, scaleX: 0.92 },
            transition: isTriggered
              ? {
                  duration: 1.02,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 4 })}
        </MotionElement>
        <MotionElement
          as="div"
          className="demo-clock-bloom"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isTriggered
                ? { opacity: [0.18, 0.74, 0.42], scale: [0.78, 1.08, 0.96], y: [10, -4, 2] }
                : { opacity: 0.08, scale: 0.68, y: 14 },
            transition: isTriggered
              ? {
                  duration: 0.92,
                  ease: "easeInOut"
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 5 })}
        </MotionElement>
      </div>
      <MotionElement
        as="div"
        className="demo-clock-counter"
        enabled={motionEnabled}
        motionProps={{
          animate: reduceMotion
            ? { opacity: 1 }
            : isTriggered
              ? { scale: [0.98, 1.04, 1], boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 22px rgba(155, 140, 255, 0.22)", "0 0 0 rgba(0,0,0,0)"] }
              : { scale: 0.98 },
          transition: isTriggered
            ? {
                duration: 1.08,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }
            : transition
        }}
      >
        <span>反应计时</span>
        <strong>{elapsed}s</strong>
      </MotionElement>
      <div className="demo-clock-ring">{RepeatedSpans({ count: 3 })}</div>
      <div className="demo-clock-particles">{RepeatedSpans({ count: 8 })}</div>
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

function CrystalScene({ state, motionEnabled, reduceMotion }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const isGrowing = state.flags.reactionStarted || state.phaseKey === "observing" || state.phaseKey === "complete";

  return (
    <div className="demo-scene demo-scene-crystal">
      <div className="demo-dish">
        <div className="demo-dish-liquid" />
        <MotionElement
          as="div"
          className="demo-dish-surface"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isGrowing
                ? { opacity: [0.34, 0.78, 0.5], y: [2, -3, 0], scaleX: [0.96, 1.04, 1] }
                : { opacity: 0.2, y: 2, scaleX: 0.94 },
            transition: isGrowing
              ? {
                  duration: 1.12,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 4 })}
        </MotionElement>
        <MotionElement
          as="div"
          className="demo-dish-mist"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isGrowing
                ? { opacity: [0.12, 0.42, 0.2], scale: [0.84, 1.08, 0.96], y: [12, -4, 0] }
                : { opacity: 0.06, scale: 0.76, y: 14 },
            transition: isGrowing
              ? {
                  duration: 1.22,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 4 })}
        </MotionElement>
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
          className="demo-mix-surface"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isMixing
                ? { opacity: [0.52, 0.94, 0.68], y: [2, -4, 0], scaleX: [0.96, 1.04, 0.99] }
                : isSettling
                  ? { opacity: 0.82, y: 0, scaleX: 1 }
                  : { opacity: 0.34, y: 4, scaleX: 0.95 },
            transition: isMixing
              ? {
                  ...transition,
                  duration: 1
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 4 })}
        </MotionElement>
        <MotionElement
          as="div"
          className="demo-mix-diffusion"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isMixing
                ? { opacity: [0.28, 0.72, 0.46], scale: [0.82, 1.08, 0.96], y: [14, -4, 2] }
                : isSettling
                  ? { opacity: 0.38, scale: 1, y: 8 }
                  : { opacity: 0.18, scale: 0.76, y: 16 },
            transition: isMixing
              ? {
                  ...transition,
                  duration: 1.08
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 5 })}
        </MotionElement>
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
        <MotionElement
          as="div"
          className="demo-mix-sediment"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isSettling
                ? { opacity: 0.88, scaleY: 1, y: 0 }
                : isMixing
                  ? { opacity: [0.12, 0.38, 0.22], scaleY: [0.7, 1, 0.84], y: [12, 0, 6] }
                  : { opacity: 0.08, scaleY: 0.62, y: 16 },
            transition
          }}
        >
          {RepeatedSpans({ count: 5 })}
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

function MirrorScene({ state, motionEnabled, reduceMotion }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const mirrorProgress = 0.22 + state.progress * 0.78;
  const isCoating = state.phaseKey === "observing" || state.phaseKey === "complete";

  return (
    <div className="demo-scene demo-scene-mirror">
      <div className="demo-mirror-tube">
        <div className="demo-mirror-liquid" />
        <MotionElement
          as="div"
          className="demo-mirror-surface"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isCoating
                ? { opacity: [0.32, 0.74, 0.5], y: [1, -2, 0], scaleX: [0.96, 1.03, 0.99] }
                : { opacity: 0.18, y: 3, scaleX: 0.94 },
            transition: isCoating
              ? {
                  duration: 1.1,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 3 })}
        </MotionElement>
        <MotionElement
          as="div"
          className="demo-mirror-coat"
          enabled={motionEnabled}
          motionProps={{
            style: { transformOrigin: "left center" },
            animate: reduceMotion
              ? { opacity: 1 }
              : { scaleX: mirrorProgress, opacity: isCoating ? 0.46 + state.progress * 0.44 : 0.18 },
            transition
          }}
        />
        <MotionElement
          as="div"
          className="demo-mirror-sheen"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isCoating
                ? { opacity: [0.22, 0.8, 0.28], x: [-18, 18, -6] }
                : { opacity: 0.08, x: -20 },
            transition: isCoating
              ? {
                  duration: 1.3,
                  ease: "easeInOut",
                  repeat: Infinity
                }
              : transition
          }}
        />
      </div>
      <div className="demo-water-bath">
        <div className="demo-water-bath-liquid" />
        <div className="demo-water-bath-wave">{RepeatedSpans({ count: 4 })}</div>
      </div>
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
        <MotionElement
          as="div"
          className="demo-flask-surface"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isFlowing
                ? { opacity: [0.42, 0.86, 0.58], y: [2, -3, 0], scaleX: [0.96, 1.04, 0.99] }
                : { opacity: 0.28, y: 2, scaleX: 0.94 },
            transition: isFlowing
              ? {
                  duration: 1.18,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 3 })}
        </MotionElement>
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
        <MotionElement
          as="div"
          className="demo-receiver-surface"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isFlowing
                ? { opacity: [0.34, 0.72, 0.5], y: [1, -2, 0], scaleX: [0.95, 1.03, 1] }
                : { opacity: 0.2, y: 2, scaleX: 0.95 },
            transition: isFlowing
              ? {
                  duration: 1.1,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 3 })}
        </MotionElement>
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
        <MotionElement
          as="div"
          className="demo-cell-surface"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isCharging
                ? { opacity: [0.42, 0.84, 0.58], y: [2, -3, 0], scaleX: [0.96, 1.04, 0.99] }
                : { opacity: 0.28, y: 2, scaleX: 0.95 },
            transition: isCharging
              ? {
                  duration: 1.08,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 3 })}
        </MotionElement>
        <span className="demo-electrode demo-electrode-left" />
        <span className="demo-electrode demo-electrode-right" />
        <MotionElement
          as="div"
          className="demo-ion-trails"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isCharging
                ? { opacity: [0.24, 0.68, 0.32], scale: [0.88, 1.06, 0.96], y: [8, -4, 2] }
                : { opacity: 0.16, scale: 0.82, y: 10 },
            transition: isCharging
              ? {
                  ...transition,
                  duration: 1.06
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 6 })}
        </MotionElement>
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

function ElectrolysisScene({ state, motionEnabled, reduceMotion }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const isCharging = state.flags.reactionStarted || state.phaseKey === "observing" || state.phaseKey === "complete";

  return (
    <div className="demo-scene demo-scene-electroplate">
      <div className="demo-cell">
        <div className="demo-cell-liquid" />
        <MotionElement
          as="div"
          className="demo-cell-surface"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isCharging
                ? { opacity: [0.4, 0.82, 0.56], y: [2, -3, 0], scaleX: [0.96, 1.04, 0.99] }
                : { opacity: 0.24, y: 2, scaleX: 0.94 },
            transition: isCharging
              ? {
                  duration: 1.02,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 3 })}
        </MotionElement>
        <span className="demo-electrode demo-electrode-left" />
        <span className="demo-electrode demo-electrode-right" />
        <MotionElement
          as="div"
          className="demo-ion-trails"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isCharging
                ? { opacity: [0.22, 0.64, 0.34], scale: [0.88, 1.06, 0.96], y: [8, -4, 2] }
                : { opacity: 0.14, scale: 0.8, y: 10 },
            transition: isCharging
              ? {
                  ...transition,
                  duration: 1.08
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 6 })}
        </MotionElement>
        <MotionElement
          as="div"
          className="demo-electrolysis-bubbles demo-electrolysis-bubbles-left"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isCharging
                ? { opacity: [0.42, 0.96, 0.66], scale: [0.84, 1.04, 0.94] }
                : { opacity: 0.18, scale: 0.72 },
            transition: isCharging
              ? {
                  duration: 0.96,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 4 })}
        </MotionElement>
        <MotionElement
          as="div"
          className="demo-electrolysis-bubbles demo-electrolysis-bubbles-right"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isCharging
                ? { opacity: [0.28, 0.72, 0.46], scale: [0.84, 1.02, 0.94] }
                : { opacity: 0.14, scale: 0.72 },
            transition: isCharging
              ? {
                  duration: 1.08,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 3 })}
        </MotionElement>
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

function RateScene({ state, motionEnabled, reduceMotion }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const intensity = 0.88 + state.progress * 0.28;

  return (
    <div className="demo-scene demo-scene-rate">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="demo-rate-vessel" key={index}>
          <span className="demo-rate-label">{index + 1}</span>
          <div className="demo-rate-liquid" />
          <MotionElement
            as="div"
            className="demo-rate-surface"
            enabled={motionEnabled}
            motionProps={{
              animate: reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: [0.34, 0.78, 0.5],
                    y: [2, -2, 0],
                    scaleX: [0.95, 1.04, 0.99]
                  },
              transition: {
                duration: 1.04 + index * 0.14,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }
            }}
          >
            {RepeatedSpans({ count: 3 })}
          </MotionElement>
          <MotionElement
            as="div"
            className="demo-rate-current"
            enabled={motionEnabled}
            motionProps={{
              animate: reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: [0.16, 0.42 * intensity, 0.22],
                    scale: [0.82, 1.08, 0.96],
                    y: [10, -4, 2]
                  },
              transition: {
                duration: 1.12 + index * 0.16,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }
            }}
          >
            {RepeatedSpans({ count: 3 })}
          </MotionElement>
          <div className="demo-rate-bubbles">{RepeatedSpans({ count: 4 + index * 2 })}</div>
        </div>
      ))}
    </div>
  );
}

function ChromatographyScene({ state, motionEnabled, reduceMotion }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const isSeparating = state.phaseKey === "observing" || state.phaseKey === "complete";

  return (
    <div className="demo-scene demo-scene-chromatography">
      <div className="demo-chamber">
        <div className="demo-solvent" />
        <MotionElement
          as="div"
          className="demo-solvent-front"
          enabled={motionEnabled}
          motionProps={{
            style: { transformOrigin: "center bottom" },
            animate: reduceMotion
              ? { opacity: 1 }
              : { scaleY: 0.24 + state.progress * 0.52, opacity: isSeparating ? 0.78 : 0.52 },
            transition
          }}
        />
        <div className="demo-paper-strip">
          <MotionElement
            as="div"
            className="demo-chroma-band demo-chroma-band-orange"
            enabled={motionEnabled}
            motionProps={{
              animate: reduceMotion ? { y: -34 } : { y: isSeparating ? [-14, -54, -34] : -10, opacity: [0.7, 1, 0.82] },
              transition: isSeparating ? { duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" } : transition
            }}
          />
          <MotionElement
            as="div"
            className="demo-chroma-band demo-chroma-band-gold"
            enabled={motionEnabled}
            motionProps={{
              animate: reduceMotion ? { y: -4 } : { y: isSeparating ? [0, -32, -16] : 0, opacity: [0.68, 0.94, 0.78] },
              transition: isSeparating ? { duration: 1.36, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: 0.08 } : transition
            }}
          />
          <MotionElement
            as="div"
            className="demo-chroma-band demo-chroma-band-green"
            enabled={motionEnabled}
            motionProps={{
              animate: reduceMotion ? { y: 18 } : { y: isSeparating ? [16, -2, 10] : 18, opacity: [0.72, 1, 0.86] },
              transition: isSeparating ? { duration: 1.24, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: 0.14 } : transition
            }}
          />
          <MotionElement
            as="div"
            className="demo-chroma-band demo-chroma-band-lime"
            enabled={motionEnabled}
            motionProps={{
              animate: reduceMotion ? { y: 42 } : { y: isSeparating ? [34, 18, 26] : 42, opacity: [0.64, 0.92, 0.76] },
              transition: isSeparating ? { duration: 1.18, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: 0.2 } : transition
            }}
          />
        </div>
      </div>
      <div className="demo-rf-grid">{RepeatedSpans({ count: 4 })}</div>
    </div>
  );
}

function InferenceScene({ state, motionEnabled, reduceMotion }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const isFocused = state.phaseKey === "observing" || state.phaseKey === "complete";

  return (
    <div className="demo-scene demo-scene-inference">
      <MotionElement
        as="div"
        className="demo-card-grid"
        enabled={motionEnabled}
        motionProps={{
          animate: reduceMotion
            ? { opacity: 1 }
            : isFocused
              ? { opacity: [0.8, 1, 0.9], scale: [0.98, 1.01, 1], y: [2, -2, 0] }
              : { opacity: 0.8, scale: 0.98, y: 2 },
          transition: isFocused
            ? {
                ...transition,
                duration: 1.18
              }
            : transition
        }}
      >
        {RepeatedSpans({ count: 4 })}
      </MotionElement>
      <MotionElement
        as="div"
        className="demo-link-lines"
        enabled={motionEnabled}
        motionProps={{
          animate: reduceMotion
            ? { opacity: 1 }
            : isFocused
              ? { opacity: [0.34, 0.76, 0.48], scale: [0.96, 1.03, 1], y: [4, -2, 0] }
              : { opacity: 0.22, scale: 0.94, y: 4 },
          transition: isFocused
            ? {
                ...transition,
                duration: 1.08
              }
            : transition
        }}
      >
        {RepeatedSpans({ count: 3 })}
      </MotionElement>
      <MotionElement
        as="div"
        className="demo-focus-ring"
        enabled={motionEnabled}
        motionProps={{
          animate: reduceMotion
            ? { opacity: 1 }
            : isFocused
              ? { opacity: [0.42, 0.88, 0.58], scale: [0.92, 1.06, 1], y: [4, -4, 0] }
              : { opacity: 0.24, scale: 0.88, y: 6 },
          transition: isFocused
            ? {
                duration: 1.24,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }
            : transition
        }}
      />
    </div>
  );
}

function RuleStatusOverlay({ state, motionEnabled, reduceMotion }) {
  const rule = state.rule;

  if (!rule) {
    return null;
  }

  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);

  return (
    <AnimatePresence initial={false} mode="wait">
      <MotionElement
        as="div"
        className={`experiment-rule-overlay rule-effect-${rule.resultEffect}`}
        enabled={motionEnabled}
        key={`${state.experiment.slug}-${state.phaseKey}-${rule.id}`}
        motionProps={{
          initial: reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 },
          transition
        }}
      >
        <span className="experiment-rule-kicker">规则引擎 · {state.phaseKey}</span>
        <strong>{rule.title}</strong>
        <p>{rule.observation}</p>
        <div className="experiment-rule-products" aria-label="反应产物">
          {rule.products.map((product) => (
            <span key={product}>{product}</span>
          ))}
        </div>
      </MotionElement>
    </AnimatePresence>
  );
}

function ReactionScene({ state }) {
  const ruleEffect = state?.resultEffect ?? "reaction";

  return (
    <div className={`demo-scene demo-scene-reaction demo-rule-effect-${ruleEffect}`}>
      <div className="demo-stage-orbit" />
      <Vessel side="left" leftLiquidClass="demo-liquid-left" rightLiquidClass="demo-liquid-right" showVapor={false}>
        <SurfaceWave className="demo-vessel-surface demo-vessel-surface-left" count={3} />
        <DiffusionField className="demo-vessel-current demo-vessel-current-left" count={4} />
      </Vessel>
      <StageBridge />
      <Vessel side="right" leftLiquidClass="demo-liquid-left" rightLiquidClass="demo-liquid-right">
        <SurfaceWave className="demo-vessel-surface demo-vessel-surface-right" count={3} />
        <DiffusionField className="demo-vessel-current demo-vessel-current-right" count={4} />
        <SedimentField className="demo-vessel-bed" count={4} />
      </Vessel>
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
  const activeRule = interaction?.rule ?? state.rule;
  const stageHint = interaction
    ? `${interaction.helper}；匹配规则：${activeRule?.resultLabel ?? "等待现象"}。`
    : isVerified
      ? "石灰水已经明显变浑浊，完成二氧化碳检验。"
      : isTransferring
        ? "观察导管中的气体持续进入石灰水。"
        : activeRule?.observation ?? "现在进入观察阶段，确认反应是否稳定进行。";

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
          <span className="lab-stage-hint-label">{interaction ? "拖拽交互 · 规则匹配" : "阶段提示 · 规则引擎"}</span>
          <strong>{interaction ? interaction.label : state.phaseKey === "verified" ? "完成检验" : "观察变化"}</strong>
          <p>{stageHint}</p>
          {activeRule ? (
            <div className="lab-rule-chip-row" aria-label="当前实验规则">
              <span className="lab-rule-chip">{activeRule.title}</span>
              <span className="lab-rule-chip lab-rule-chip-result">{activeRule.resultLabel}</span>
            </div>
          ) : null}
        </MotionElement>
      </AnimatePresence>

      <LabBeaker side="left" liquidClassName="lab-liquid-reactant">
        <div className={`lab-rocks ${isCharged ? "lab-rocks-loaded" : ""}`}>{RepeatedSpans({ count: 3 })}</div>
        <MotionElement
          as="div"
          className="lab-surface-wave lab-surface-wave-reactant"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isReacting
                ? { opacity: [0.42, 0.9, 0.62], y: [2, -3, 0], scaleX: [0.96, 1.04, 1] }
                : isTransferring
                  ? { opacity: 0.74, y: 0, scaleX: 1 }
                  : { opacity: 0.22, y: 4, scaleX: 0.94 },
            transition: isReacting
              ? {
                  ...transition,
                  duration: 1.05
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 4 })}
        </MotionElement>
        <MotionElement
          as="div"
          className="lab-diffusion-plume"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isReacting
                ? { opacity: [0.2, 0.64, 0.34], scale: [0.82, 1.08, 0.96], y: [12, -3, 2] }
                : isTransferring
                  ? { opacity: 0.28, scale: 1, y: 6 }
                  : { opacity: 0.1, scale: 0.76, y: 14 },
            transition: isReacting
              ? {
                  ...transition,
                  duration: 1.12
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 5 })}
        </MotionElement>
        <MotionElement
          as="div"
          className="lab-foam-band"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isReacting
                ? { opacity: [0.24, 0.66, 0.4], y: [2, -2, 0], scaleX: [0.94, 1.02, 0.98] }
                : isTransferring
                  ? { opacity: 0.46, y: 0, scaleX: 1 }
                  : { opacity: 0.08, y: 4, scaleX: 0.92 },
            transition: isReacting
              ? {
                  ...transition,
                  duration: 0.94
                }
              : transition
          }}
        />
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
          className="lab-surface-wave lab-surface-wave-lime"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isTransferring
                ? { opacity: [0.36, 0.82, 0.54], y: [2, -3, 0], scaleX: [0.95, 1.03, 0.99] }
                : { opacity: 0.12, y: 4, scaleX: 0.92 },
            transition: isTransferring
              ? {
                  duration: 1.02,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 4 })}
        </MotionElement>
        <MotionElement
          as="div"
          className="lab-cloud-mist"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isVerified
                ? { opacity: [0.28, 0.74, 0.48], scale: [0.88, 1.08, 0.98], y: [8, -4, 2] }
                : isTransferring
                  ? { opacity: 0.36, scale: 0.94, y: 10 }
                  : { opacity: 0.08, scale: 0.72, y: 18 },
            transition: isVerified
              ? {
                  ...transition,
                  duration: 1.16
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 5 })}
        </MotionElement>
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
        <MotionElement
          as="div"
          className="lab-precipitate-bed"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isVerified
                ? { opacity: 0.88, scaleY: 1, y: 0 }
                : isTransferring
                  ? { opacity: 0.32, scaleY: 0.78, y: 10 }
                  : { opacity: 0.06, scaleY: 0.62, y: 16 },
            transition
          }}
        >
          {RepeatedSpans({ count: 5 })}
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
      return <IndicatorScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    case "clock":
      return <ClockScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    case "mirror":
      return <MirrorScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    case "flame":
      return <FlameScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    case "crystal":
      return <CrystalScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    case "precipitate":
      return <PrecipitateScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    case "distillation":
      return <DistillationScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    case "electroplate":
      return <ElectroplateScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    case "electrolysis":
      return <ElectrolysisScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    case "chromatography":
      return <ChromatographyScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    case "rate":
      return <RateScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    case "inference":
      return <InferenceScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
    default:
      return <ReactionScene state={state} />;
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
        data-rule-effect={state.resultEffect}
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
        <RuleStatusOverlay motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />
      </MotionElement>
    );
  }

  return (
    <MotionElement
      as="div"
      className={`demo-stage demo-stage-${state.kind} demo-phase-${state.phaseKey}`}
      data-motion-preset={state.motionPreset}
      data-rule-effect={state.resultEffect}
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
      <RuleStatusOverlay motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />
    </MotionElement>
  );
}
