"use client";

import { createContext, forwardRef, useContext, useEffect, useMemo, useRef, useState } from "react";
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
  displacement: {
    motionPreset: "metal-displace",
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
  "metal-displacement": {
    id: "metal-displacement",
    title: "金属置换反应",
    inputReagents: ["iron-nail", "copper-sulfate"],
    reactants: ["Fe", "CuSO4"],
    products: ["FeSO4", "Cu"],
    resultEffect: "coating",
    resultLabel: "红铜析出",
    observation: "打磨后的铁钉进入硫酸铜溶液，表面逐渐析出红色铜层，蓝色溶液变浅并偏绿。"
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
  displacement: "metal-displacement",
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
  if (kind === "fizz-transfer" && isEggshellVinegarExperiment(experiment)) {
    const copy = getCarbonateInteractionCopy(experiment);

    if (phaseKey === "idle") {
      return copy.solid.rule;
    }

    if (phaseKey === "loaded") {
      return copy.acid.rule;
    }

    return copy.gas.rule;
  }

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
      label: "放入大理石",
      actionLabel: "大理石落入瓶底",
      helper: "把大理石拖到左侧反应瓶底部",
      autoHint: "手动把碳酸钙固体加入反应瓶，为后续酸化反应提供稳定表面积。",
      autoPlay: false,
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
      label: "滴加稀盐酸",
      actionLabel: "稀盐酸正在倒入",
      helper: "把稀盐酸拖到左侧瓶口并松手倒液",
      autoHint: "手动把稀盐酸沿瓶口倒入，液体接触大理石后开始产生二氧化碳。",
      autoPlay: false,
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
      id: "co2-bubble-check",
      ruleId: "acid-carbonate-gas",
      icon: "🫧",
      label: "观察产气",
      actionLabel: "气泡正在增强",
      helper: "把观察点拖到左侧反应瓶上方，确认连续产气",
      autoHint: "先确认左侧反应瓶内连续产生气泡，再进入二氧化碳检验步骤。",
      autoPlay: false,
      toolTone: "lime",
      start: { x: 0.12, y: 0.2 },
      target: { x: 0.27, y: 0.48 },
      targetSide: "left",
      radius: 86,
      commitEffect: "spark-burst",
      commitDelayMs: 720,
      pourPose: {
        rotate: -8,
        scale: 1.04
      },
      nextStep: 3
    },
    transferring: {
      id: "limewater-check",
      ruleId: "limewater-clouding",
      icon: "🫙",
      label: "接入石灰水",
      actionLabel: "石灰水接入导管",
      helper: "把澄清石灰水拖到右侧导管末端",
      autoHint: "手动把澄清石灰水接到导管末端，二氧化碳进入后会逐渐变浑浊。",
      autoPlay: false,
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
      nextStep: 4
    }
  }
};

function isEggshellVinegarExperiment(experiment) {
  const source = `${experiment.slug ?? ""} ${experiment.title ?? ""} ${experiment.materials?.join(" ") ?? ""}`;
  return /eggshell|蛋壳|白醋|vinegar/i.test(source);
}

function getCarbonateInteractionCopy(experiment) {
  const isEggshell = isEggshellVinegarExperiment(experiment);

  if (isEggshell) {
    return {
      isEggshell: true,
      solid: {
        id: "eggshell-charge",
        icon: "🥚",
        label: "放入蛋壳",
        actionLabel: "蛋壳碎片落入杯底",
        helper: "把蛋壳碎片拖到左侧反应容器底部",
        autoHint: "手动把蛋壳碎片加入反应容器，为后续白醋反应提供接触面积。",
        target: { x: 0.5, y: 0.78 },
        targetSide: "center",
        rule: {
          ...experimentRuleCatalog["carbonate-charge"],
          title: "装入蛋壳碎片",
          inputReagents: ["eggshell"],
          products: ["待加白醋"],
          observation: "蛋壳碎片先进入反应容器，系统等待白醋触发产气。"
        }
      },
      acid: {
        id: "vinegar-pour",
        icon: "🧴",
        label: "滴加白醋",
        actionLabel: "白醋正在倒入",
        helper: "把白醋拖到左侧容器口并松手倒入",
        autoHint: "手动把白醋沿容器口倒入，酸液接触蛋壳后开始产生二氧化碳。",
        target: { x: 0.5, y: 0.34 },
        targetSide: "center",
        rule: {
          ...experimentRuleCatalog["acid-carbonate-gas"],
          title: "白醋 + 蛋壳",
          inputReagents: ["eggshell", "vinegar"],
          reactants: ["CaCO3", "CH3COOH"],
          products: ["CO2", "Ca(CH3COO)2", "H2O"],
          observation: "白醋接触蛋壳中的碳酸钙后产生 CO2，蛋壳表面出现连续细密气泡。"
        }
      },
      gas: {
        id: "eggshell-bubble-check",
        icon: "🫧",
        label: "观察气泡",
        actionLabel: "蛋壳表面正在冒泡",
        helper: "把观察点拖到反应容器上方，确认蛋壳表面连续冒泡",
        autoHint: "观察蛋壳表面细密气泡和固体逐渐变薄的过程。",
        target: { x: 0.5, y: 0.48 },
        targetSide: "center",
        rule: {
          ...experimentRuleCatalog["acid-carbonate-gas"],
          title: "观察蛋壳产气",
          inputReagents: ["eggshell", "vinegar"],
          reactants: ["CaCO3", "CH3COOH"],
          products: ["CO2", "Ca(CH3COO)2", "H2O"],
          observation: "蛋壳表面持续出现细密气泡，说明碳酸钙正在和白醋反应并释放 CO2。"
        }
      },
      receiver: null
    };
  }

  return {
    isEggshell: false,
    solid: {
      rule: experimentRuleCatalog["carbonate-charge"]
    },
    acid: {
      rule: experimentRuleCatalog["acid-carbonate-gas"]
    },
    gas: {
      rule: experimentRuleCatalog["acid-carbonate-gas"]
    },
    receiver: {
      rule: experimentRuleCatalog["limewater-clouding"]
    }
  };
}

function resolveFizzTransferInteractionProfile(profile, phaseKey, experiment) {
  const copy = getCarbonateInteractionCopy(experiment);

  if (phaseKey === "idle") {
    return {
      ...profile,
      ...copy.solid
    };
  }

  if (phaseKey === "loaded") {
    return {
      ...profile,
      ...copy.acid
    };
  }

  if (phaseKey === "reacting" && copy.gas.id) {
    return {
      ...profile,
      ...copy.gas,
      toolTone: "lime",
      start: { x: 0.12, y: 0.2 },
      target: copy.gas.target ?? { x: 0.27, y: 0.48 },
      targetSide: copy.gas.targetSide ?? "left",
      radius: 86,
      commitEffect: "spark-burst",
      commitDelayMs: 720,
      pourPose: {
        rotate: -8,
        scale: 1.04
      }
    };
  }

  if (phaseKey === "transferring" && copy.receiver) {
    return {
      ...profile,
      ...copy.receiver
    };
  }

  return {
    ...profile,
    rule: copy[phaseKey === "transferring" ? "receiver" : "gas"]?.rule ?? experimentRuleCatalog[profile.ruleId]
  };
}

const genericInteractionByKind = {
  indicator: {
    icon: "🌈",
    label: "拖入指示剂",
    actionLabel: "指示剂正在滴入",
    helper: "把指示剂拖到试管上方，松手观察颜色扩散",
    targetLabel: "显色位",
    toolTone: "indicator",
    commitEffect: "liquid-pour",
    target: { x: 0.5, y: 0.45 },
    pourPose: { rotate: -18, scale: 1.04 }
  },
  clock: {
    icon: "⏱️",
    label: "混合反应液",
    actionLabel: "反应液正在混合",
    helper: "把第二份反应液拖入主烧杯，松手开始计时",
    targetLabel: "混合位",
    toolTone: "indicator",
    commitEffect: "liquid-pour",
    target: { x: 0.5, y: 0.45 },
    pourPose: { rotate: -20, scale: 1.04 }
  },
  mirror: {
    icon: "🪞",
    label: "加入还原剂",
    actionLabel: "还原剂正在加入",
    helper: "把葡萄糖溶液拖入银氨试管，松手开始加热显影",
    targetLabel: "银镜位",
    toolTone: "lime",
    commitEffect: "liquid-pour",
    target: { x: 0.48, y: 0.45 },
    pourPose: { rotate: -18, scale: 1.04 }
  },
  flame: {
    icon: "🔥",
    label: "拖入引燃器",
    actionLabel: "正在点燃",
    helper: "把火源拖到金属条底部，松手观察燃烧反馈",
    targetLabel: "点火位",
    toolTone: "heat",
    commitEffect: "spark-burst",
    target: { x: 0.5, y: 0.58 },
    pourPose: { rotate: -8, scale: 1.05 }
  },
  crystal: {
    icon: "💎",
    label: "拖入晶种",
    actionLabel: "晶种正在析出",
    helper: "把晶种拖到蒸发皿中，松手观察晶体生长",
    targetLabel: "结晶位",
    toolTone: "lime",
    commitEffect: "charge-drop",
    target: { x: 0.5, y: 0.66 },
    pourPose: { rotate: -10, scale: 1.04 }
  },
  precipitate: {
    icon: "🧪",
    label: "滴加沉淀剂",
    actionLabel: "沉淀剂正在加入",
    helper: "把试剂拖到混合容器上方，松手观察浑浊扩散",
    targetLabel: "滴加位",
    toolTone: "acid",
    commitEffect: "liquid-pour",
    target: { x: 0.5, y: 0.42 },
    pourPose: { rotate: -18, scale: 1.04 }
  },
  distillation: {
    icon: "🌡️",
    label: "拖入热源",
    actionLabel: "正在加热",
    helper: "把热源拖到蒸馏瓶下方，松手让蒸汽进入冷凝管",
    targetLabel: "加热位",
    toolTone: "heat",
    commitEffect: "heat-pulse",
    target: { x: 0.31, y: 0.69 },
    pourPose: { rotate: -6, scale: 1.05 }
  },
  electroplate: {
    icon: "⚡",
    label: "接通电源",
    actionLabel: "电流正在通过",
    helper: "把电源夹拖到电极上，松手观察金属沉积",
    targetLabel: "电极位",
    toolTone: "power",
    commitEffect: "spark-burst",
    target: { x: 0.5, y: 0.45 },
    pourPose: { rotate: 0, scale: 1.05 }
  },
  electrolysis: {
    icon: "⚡",
    label: "接入电源",
    actionLabel: "电解开始",
    helper: "把电源拖到电极接线处，松手观察气泡产生",
    targetLabel: "接线位",
    toolTone: "power",
    commitEffect: "spark-burst",
    target: { x: 0.5, y: 0.38 },
    pourPose: { rotate: 0, scale: 1.05 }
  },
  displacement: {
    icon: "🔩",
    label: "拖入金属固体",
    actionLabel: "金属正在滑入溶液",
    helper: "把打磨好的金属拖到试管口，松手让它进入盐溶液",
    targetLabel: "试管口",
    toolTone: "metal",
    commitEffect: "metal-drop",
    start: { x: 0.16, y: 0.18 },
    target: { x: 0.5, y: 0.38 },
    radius: 92,
    commitDelayMs: 720,
    pourPose: { rotate: -12, scale: 1.05 }
  },
  chromatography: {
    icon: "🎨",
    label: "拖入样品点",
    actionLabel: "样品正在展开",
    helper: "把样品点拖到层析纸起始线，松手观察色带分离",
    targetLabel: "起始线",
    toolTone: "indicator",
    commitEffect: "liquid-pour",
    target: { x: 0.5, y: 0.72 },
    pourPose: { rotate: -10, scale: 1.04 }
  },
  rate: {
    icon: "⏳",
    label: "加入变量试剂",
    actionLabel: "变量条件已加入",
    helper: "把变量试剂拖到实验容器中，松手观察速率变化",
    targetLabel: "变量位",
    toolTone: "acid",
    commitEffect: "liquid-pour",
    target: { x: 0.5, y: 0.5 },
    pourPose: { rotate: -18, scale: 1.04 }
  },
  inference: {
    icon: "🧠",
    label: "拖入线索样品",
    actionLabel: "样品正在反应",
    helper: "把未知样品拖到检测区，松手观察推断线索",
    targetLabel: "检测位",
    toolTone: "indicator",
    commitEffect: "liquid-pour",
    target: { x: 0.5, y: 0.5 },
    pourPose: { rotate: -12, scale: 1.04 }
  },
  reaction: {
    icon: "🧪",
    label: "加入试剂",
    actionLabel: "试剂正在加入",
    helper: "把试剂瓶拖到反应容器上方，松手触发现象",
    targetLabel: "反应位",
    toolTone: "acid",
    commitEffect: "liquid-pour",
    target: { x: 0.5, y: 0.48 },
    pourPose: { rotate: -18, scale: 1.04 }
  }
};

function getPhaseInteractionCopy(phaseKey) {
  if (phaseKey === "setup" || phaseKey === "idle") {
    return "准备";
  }

  if (phaseKey === "observing" || phaseKey === "transferring") {
    return "观察";
  }

  return "加入";
}

function inferMaterialInteractionProfile({ experiment, kind, phaseKey, stepIndex }) {
  const demoSteps = getDemoStepsForExperiment(experiment);
  const stepCopy = `${demoSteps[stepIndex]?.title ?? ""} ${demoSteps[stepIndex]?.note ?? ""}`;
  const materialCopy = `${experiment.materials?.join(" ") ?? ""} ${experiment.title ?? ""} ${experiment.slug ?? ""}`;
  const source = `${stepCopy} ${materialCopy}`;
  const isSetupPhase = phaseKey === "setup" || phaseKey === "idle";

  if (/高锰酸钾|KMnO4|kmno|二氧化锰|MnO2|粉末|powder/i.test(source)) {
    return {
      icon: "KMnO4",
      label: /高锰酸钾|KMnO4|kmno/i.test(source) ? "拖入高锰酸钾粉末" : "拖入粉末样品",
      actionLabel: "粉末正在倒入试管",
      helper: "拖动药匙到试管口，松手把粉末加入试管底部",
      targetLabel: "试管口",
      toolTone: "powder",
      toolShape: "powder",
      commitEffect: "powder-drop",
      target: { x: 0.5, y: 0.38 },
      radius: 96,
      commitDelayMs: 720,
      pourPose: { rotate: -16, scale: 1.05 }
    };
  }

  if (/镁带|magnesium/i.test(source)) {
    return {
      icon: "Mg",
      label: "拖入镁带",
      actionLabel: "镁带正在就位",
      helper: "把镁带拖到火焰上方，松手后观察白光和火星",
      targetLabel: "火焰位",
      toolTone: "metal",
      toolShape: "magnesium",
      commitEffect: "spark-burst",
      target: { x: 0.5, y: 0.58 },
      radius: 96,
      commitDelayMs: 760,
      pourPose: { rotate: -18, scale: 1.08 }
    };
  }

  if (
    (isSetupPhase || kind === "displacement" || kind === "electroplate") &&
    /铁钉|铁片|铜片|锌片|铝片|金属片|待镀金属|steel|iron|copper|zinc|metal/i.test(source)
  ) {
    return {
      icon: "🔩",
      label: /铁钉|iron/i.test(source) ? "拖入打磨铁钉" : "拖入金属样品",
      actionLabel: "金属样品正在放入",
      helper: "把金属样品拖到试管或烧杯口，松手后观察表面和溶液变化",
      targetLabel: "容器口",
      toolTone: "metal",
      toolShape: /铁钉|iron/i.test(source) ? "nail" : "metal-strip",
      commitEffect: "metal-drop",
      start: { x: 0.16, y: 0.18 },
      target: { x: 0.5, y: 0.38 },
      radius: 92,
      commitDelayMs: 720,
      pourPose: { rotate: -12, scale: 1.05 }
    };
  }

  if (isSetupPhase && /大理石|蛋壳|碳酸钙|食盐|晶体|粉末|颗粒|固体|样品|marble|crystal|solid/i.test(source)) {
    return {
      icon: /晶体|crystal/i.test(source) ? "💎" : "🪨",
      label: /晶体|crystal/i.test(source) ? "拖入晶体样品" : "拖入固体样品",
      actionLabel: "固体正在加入",
      helper: "把固体样品拖到容器内部，松手后观察溶解、结晶或产气变化",
      targetLabel: "容器内",
      toolTone: "stone",
      commitEffect: "charge-drop",
      start: { x: 0.16, y: 0.18 },
      target: { x: 0.5, y: 0.64 },
      radius: 90,
      commitDelayMs: 620,
      pourPose: { rotate: -10, scale: 1.04 }
    };
  }

  if (/酒精灯|加热|热源|点燃|火源|燃烧|burn|heat|flame/i.test(source) && (kind === "flame" || kind === "distillation" || !isSetupPhase)) {
    return {
      icon: "🔥",
      label: "拖入热源",
      actionLabel: "正在加热",
      helper: "把热源拖到反应或加热位置，松手后观察温度导致的变化",
      targetLabel: "加热点",
      toolTone: "heat",
      commitEffect: kind === "flame" ? "spark-burst" : "heat-pulse",
      start: { x: 0.16, y: 0.72 },
      target: kind === "distillation" ? { x: 0.31, y: 0.69 } : { x: 0.5, y: 0.58 },
      radius: 90,
      commitDelayMs: 760,
      pourPose: { rotate: -6, scale: 1.05 }
    };
  }

  if (/电源|导线|电极|电流|电解|电镀|battery|power|electrode/i.test(source)) {
    return {
      icon: "⚡",
      label: "接入电源",
      actionLabel: "电流正在接通",
      helper: "把电源夹拖到电极接线处，松手后观察气泡、沉积或电流反馈",
      targetLabel: "接线位",
      toolTone: "power",
      commitEffect: "spark-burst",
      start: { x: 0.16, y: 0.22 },
      target: { x: 0.5, y: 0.38 },
      radius: 90,
      commitDelayMs: 760,
      pourPose: { rotate: 0, scale: 1.05 }
    };
  }

  if (/指示剂|紫甘蓝|石蕊|酚酞|碘液|淀粉|色素|indicator|starch|pigment/i.test(source)) {
    return {
      icon: "🌈",
      label: "拖入显色试剂",
      actionLabel: "显色试剂正在滴入",
      helper: "把显色试剂拖到液面上方，松手后观察颜色扩散",
      targetLabel: "显色位",
      toolTone: "indicator",
      commitEffect: "liquid-pour",
      target: { x: 0.5, y: 0.42 },
      pourPose: { rotate: -18, scale: 1.04 }
    };
  }

  if (/盐酸|硝酸|硫酸|氢氧化钠|硝酸银|硫酸铜|溶液|试剂|液体|滴管|acid|solution|reagent/i.test(source)) {
    return {
      icon: "🧪",
      label: "拖入反应试剂",
      actionLabel: "试剂正在加入",
      helper: "把试剂瓶拖到容器口，松手后观察液体混合和反应现象",
      targetLabel: "滴加位",
      toolTone: /石灰水|lime/i.test(source) ? "lime" : "acid",
      commitEffect: "liquid-pour",
      target: { x: 0.5, y: 0.42 },
      pourPose: { rotate: -18, scale: 1.04 }
    };
  }

  return null;
}

const ExperimentConsoleMotionContext = createContext(false);

export function ExperimentConsoleMotionProvider({ children, enabled = true }) {
  return <ExperimentConsoleMotionContext.Provider value={enabled}>{children}</ExperimentConsoleMotionContext.Provider>;
}

function useExperimentConsoleMotionEnabled() {
  return useContext(ExperimentConsoleMotionContext);
}

function resolveInteractionProfile(kind, phaseKey, rule, { experiment, stepIndex, totalSteps }) {
  if (stepIndex >= totalSteps - 1) {
    return null;
  }

  const profile = stageInteractionProfiles[kind]?.[phaseKey] ?? null;

  if (profile) {
    const resolvedProfile =
      kind === "fizz-transfer" ? resolveFizzTransferInteractionProfile(profile, phaseKey, experiment) : profile;

    return {
      ...resolvedProfile,
      autoPlay: false,
      nextStep: Math.min(totalSteps - 1, resolvedProfile.nextStep ?? stepIndex + 1),
      rule: resolvedProfile.rule ?? experimentRuleCatalog[resolvedProfile.ruleId] ?? rule
    };
  }

  const fallback = genericInteractionByKind[kind] ?? genericInteractionByKind.reaction;
  const materialProfile = inferMaterialInteractionProfile({ experiment, kind, phaseKey, stepIndex });
  const interactionCopy = materialProfile ? { ...fallback, ...materialProfile } : fallback;
  const phaseAction = getPhaseInteractionCopy(phaseKey);

  return {
    id: `${experiment.slug}-${kind}-${phaseKey}-${stepIndex}`,
    ruleId: rule.id,
    icon: interactionCopy.icon,
    label: phaseKey === "setup" ? interactionCopy.label : `${phaseAction}${interactionCopy.label.replace(/^(拖入|加入|接通|接入|混合|滴加)/, "")}`,
    actionLabel: interactionCopy.actionLabel,
    helper: interactionCopy.helper,
    autoHint: interactionCopy.helper,
    autoPlay: false,
    toolTone: interactionCopy.toolTone,
    start: interactionCopy.start ?? { x: 0.14, y: 0.2 },
    target: interactionCopy.target,
    targetSide: interactionCopy.targetSide ?? "center",
    targetLabel: interactionCopy.targetLabel,
    radius: interactionCopy.radius ?? 86,
    commitEffect: interactionCopy.commitEffect,
    commitDelayMs: interactionCopy.commitDelayMs ?? 760,
    pourPose: interactionCopy.pourPose,
    nextStep: Math.min(totalSteps - 1, stepIndex + 1),
    rule
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

const MotionElement = forwardRef(function MotionElement({ as = "div", enabled, motionProps, children, ...rest }, ref) {
  const Component = enabled ? motion[as] : as;

  if (!enabled) {
    return (
      <Component ref={ref} {...rest}>
        {children}
      </Component>
    );
  }

  return (
    <Component ref={ref} initial={false} {...motionProps} {...rest}>
      {children}
    </Component>
  );
});

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

  if (slug.includes("iron-copper") || slug.includes("displacement")) {
    return "displacement";
  }

  if (slug.includes("carbon-dioxide") || slug.includes("eggshell") || slug.includes("vinegar")) {
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
    interactionProfile: resolveInteractionProfile(kind, phaseKey, rule, {
      experiment,
      stepIndex,
      totalSteps
    }),
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

function hashString(value) {
  return String(value)
    .split("")
    .reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 2166136261);
}

function seededUnit(seed, index) {
  const raw = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

function resolvePhenomenonProfile(state) {
  const slug = state.experiment.slug ?? "";
  const effect = state.resultEffect;

  if (state.kind === "flame" || effect === "flame") {
    return { kind: "flame", centerX: 0.5, centerY: 0.58, palette: ["#fff7ad", "#fb923c", "#ef4444"] };
  }

  if (state.kind === "crystal" || effect === "crystal") {
    return { kind: "crystal", centerX: 0.5, centerY: 0.68, palette: ["#e0f2fe", "#93c5fd", "#67e8f9"] };
  }

  if (state.kind === "precipitate" || effect === "precipitate" || effect === "clouding") {
    return { kind: "precipitate", centerX: 0.5, centerY: 0.64, palette: ["#eff6ff", "#bfdbfe", "#93c5fd"] };
  }

  if (state.kind === "distillation" || effect === "flow") {
    return { kind: "distillation", centerX: 0.5, centerY: 0.45, palette: ["#e0f2fe", "#7dd3fc", "#38bdf8"] };
  }

  if (state.kind === "electroplate" || state.kind === "displacement" || effect === "coating") {
    return { kind: "metal", centerX: 0.5, centerY: 0.58, palette: ["#f97316", "#fb923c", "#fed7aa"] };
  }

  if (state.kind === "electrolysis") {
    return { kind: "electrolysis", centerX: 0.5, centerY: 0.58, palette: ["#7dd3fc", "#60a5fa", "#fbbf24"] };
  }

  if (state.kind === "indicator" || state.kind === "clock" || effect === "color") {
    return { kind: "color", centerX: 0.5, centerY: 0.62, palette: ["#f472b6", "#60a5fa", "#34d399"] };
  }

  if (state.kind === "fizz-transfer" || effect === "gas" || /oxygen|peroxide|acid|soda|eggshell|vinegar/i.test(slug)) {
    return {
      kind: "gas",
      centerX: state.kind === "fizz-transfer" && !isEggshellVinegarExperiment(state.experiment) ? 0.28 : 0.5,
      centerY: 0.7,
      palette: ["#ccfbf1", "#67e8f9", "#fef3c7"]
    };
  }

  return { kind: "liquid", centerX: 0.5, centerY: 0.62, palette: ["#67e8f9", "#60a5fa", "#34d399"] };
}

function getCanvasIntensity(state) {
  if (state.phaseKey === "idle" || state.phaseKey === "setup") {
    return 0.14;
  }

  if (state.phaseKey === "loaded") {
    return 0.28;
  }

  if (state.phaseKey === "reacting" || state.phaseKey === state.emphasisPhase) {
    return 1;
  }

  if (state.flags.finished || state.phaseKey === "complete" || state.phaseKey === "verified") {
    return 0.82;
  }

  return 0.62;
}

function drawCanvasBubbleField(ctx, width, height, time, intensity, seed, profile) {
  const baseX = width * profile.centerX;
  const baseY = height * profile.centerY;
  const count = Math.floor(18 + intensity * 34);

  for (let index = 0; index < count; index += 1) {
    const lane = seededUnit(seed, index) - 0.5;
    const drift = Math.sin(time * 0.9 + index * 1.7) * 8;
    const rise = ((time * (0.16 + seededUnit(seed, index + 20) * 0.28) + seededUnit(seed, index + 40)) % 1) * height * 0.42;
    const radius = 2 + seededUnit(seed, index + 60) * 8 * intensity;
    const x = baseX + lane * width * 0.24 + drift;
    const y = baseY - rise;
    const alpha = Math.max(0, (1 - rise / (height * 0.42)) * intensity);

    ctx.beginPath();
    ctx.strokeStyle = `rgba(204, 251, 241, ${0.14 + alpha * 0.56})`;
    ctx.lineWidth = 1.2;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    if (index % 5 === 0) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${0.12 + alpha * 0.32})`;
      ctx.arc(x - radius * 0.25, y - radius * 0.2, Math.max(1, radius * 0.22), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const plume = ctx.createRadialGradient(baseX, baseY - height * 0.08, 10, baseX, baseY - height * 0.08, width * 0.24);
  plume.addColorStop(0, `rgba(103, 232, 249, ${0.18 * intensity})`);
  plume.addColorStop(0.55, `rgba(45, 212, 191, ${0.08 * intensity})`);
  plume.addColorStop(1, "rgba(45, 212, 191, 0)");
  ctx.fillStyle = plume;
  ctx.fillRect(0, 0, width, height);
}

function drawCanvasPrecipitate(ctx, width, height, time, intensity, seed, profile) {
  const baseX = width * profile.centerX;
  const baseY = height * profile.centerY;
  const count = Math.floor(14 + intensity * 26);

  for (let index = 0; index < count; index += 1) {
    const orbit = seededUnit(seed, index) * Math.PI * 2;
    const radius = (0.08 + seededUnit(seed, index + 18) * 0.22) * width * intensity;
    const pulse = 0.82 + Math.sin(time * 1.4 + index) * 0.16;
    const x = baseX + Math.cos(orbit) * radius * pulse;
    const y = baseY + Math.sin(orbit) * radius * 0.55 * pulse;
    const cloudRadius = 18 + seededUnit(seed, index + 38) * 32;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, cloudRadius);

    gradient.addColorStop(0, `rgba(239, 246, 255, ${0.18 * intensity})`);
    gradient.addColorStop(0.62, `rgba(147, 197, 253, ${0.07 * intensity})`);
    gradient.addColorStop(1, "rgba(147, 197, 253, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, cloudRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = `rgba(226, 232, 240, ${0.12 + intensity * 0.22})`;
  for (let index = 0; index < 18; index += 1) {
    const x = baseX - width * 0.2 + seededUnit(seed, index + 80) * width * 0.4;
    const y = height * 0.77 + seededUnit(seed, index + 100) * height * 0.08;
    ctx.beginPath();
    ctx.ellipse(x, y, 5 + seededUnit(seed, index + 120) * 14, 2 + seededUnit(seed, index + 140) * 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCanvasFlame(ctx, width, height, time, intensity, seed, profile) {
  const baseX = width * profile.centerX;
  const baseY = height * 0.72;
  const flameHeight = height * (0.2 + intensity * 0.2);
  const layers = [
    ["rgba(239, 68, 68, 0.42)", 1.08, 0],
    ["rgba(251, 146, 60, 0.58)", 0.78, 0.7],
    ["rgba(254, 247, 173, 0.84)", 0.42, 1.4]
  ];

  layers.forEach(([color, scale, phase]) => {
    const sway = Math.sin(time * 5.2 + phase) * 12 * intensity;
    const topY = baseY - flameHeight * scale;
    const widthScale = width * 0.08 * scale;

    ctx.beginPath();
    ctx.moveTo(baseX - widthScale, baseY);
    ctx.bezierCurveTo(baseX - widthScale * 1.1, baseY - flameHeight * 0.4, baseX + sway - widthScale * 0.55, topY + 28, baseX + sway, topY);
    ctx.bezierCurveTo(baseX + sway + widthScale * 0.55, topY + 28, baseX + widthScale * 1.1, baseY - flameHeight * 0.4, baseX + widthScale, baseY);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 28 * intensity;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  for (let index = 0; index < Math.floor(20 * intensity); index += 1) {
    const phase = (time * (0.35 + seededUnit(seed, index) * 0.35) + seededUnit(seed, index + 20)) % 1;
    const x = baseX + (seededUnit(seed, index + 40) - 0.5) * width * 0.28;
    const y = baseY - phase * height * 0.5;
    ctx.fillStyle = `rgba(254, 240, 138, ${(1 - phase) * 0.7})`;
    ctx.beginPath();
    ctx.arc(x, y, 1.5 + seededUnit(seed, index + 60) * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCanvasCrystals(ctx, width, height, time, intensity, seed, profile) {
  const baseX = width * profile.centerX;
  const baseY = height * profile.centerY;
  const count = Math.floor(8 + intensity * 28);

  ctx.strokeStyle = `rgba(186, 230, 253, ${0.26 + intensity * 0.48})`;
  ctx.fillStyle = `rgba(224, 242, 254, ${0.12 + intensity * 0.28})`;
  ctx.lineWidth = 1.3;

  for (let index = 0; index < count; index += 1) {
    const angle = seededUnit(seed, index) * Math.PI * 2;
    const spread = seededUnit(seed, index + 20) * width * 0.25 * intensity;
    const x = baseX + Math.cos(angle) * spread;
    const y = baseY + Math.sin(angle) * spread * 0.48 + Math.sin(time + index) * 2;
    const size = 5 + seededUnit(seed, index + 40) * 16 * intensity;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + time * 0.08);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.58, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.58, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawCanvasFlow(ctx, width, height, time, intensity, seed) {
  ctx.strokeStyle = `rgba(125, 211, 252, ${0.2 + intensity * 0.48})`;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";

  for (let index = 0; index < 5; index += 1) {
    const phase = (time * 0.28 + index * 0.18) % 1;
    const startX = width * (0.22 + phase * 0.46);
    const startY = height * (0.3 + Math.sin(phase * Math.PI * 2) * 0.06);

    ctx.beginPath();
    ctx.moveTo(startX - 32, startY - 18);
    ctx.bezierCurveTo(startX, startY - 52, startX + 44, startY + 12, startX + 84, startY - 10);
    ctx.stroke();

    ctx.fillStyle = `rgba(224, 242, 254, ${(1 - phase) * intensity * 0.62})`;
    ctx.beginPath();
    ctx.arc(startX + 84, startY - 10, 3 + seededUnit(seed, index) * 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCanvasMetal(ctx, width, height, time, intensity, seed, profile) {
  const centerX = width * profile.centerX;
  const centerY = height * profile.centerY;
  const gradient = ctx.createLinearGradient(centerX - width * 0.18, centerY, centerX + width * 0.18, centerY);

  gradient.addColorStop(0, `rgba(249, 115, 22, ${0.02 + intensity * 0.06})`);
  gradient.addColorStop(0.5, `rgba(251, 146, 60, ${0.16 + intensity * 0.32})`);
  gradient.addColorStop(1, `rgba(254, 215, 170, ${0.02 + intensity * 0.08})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(centerX - width * 0.18, centerY - height * 0.22, width * 0.36, height * 0.44);

  for (let index = 0; index < Math.floor(18 * intensity); index += 1) {
    const x = centerX + (seededUnit(seed, index) - 0.5) * width * 0.38;
    const y = centerY + (seededUnit(seed, index + 30) - 0.5) * height * 0.36;
    ctx.fillStyle = `rgba(251, 146, 60, ${0.24 + seededUnit(seed, index + 60) * 0.42})`;
    ctx.beginPath();
    ctx.arc(x, y, 2 + seededUnit(seed, index + 90) * 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCanvasColorShift(ctx, width, height, time, intensity, seed, profile) {
  const centerX = width * profile.centerX;
  const centerY = height * profile.centerY;
  const colors = [
    `rgba(244, 114, 182, ${0.12 * intensity})`,
    `rgba(96, 165, 250, ${0.12 * intensity})`,
    `rgba(52, 211, 153, ${0.12 * intensity})`
  ];

  colors.forEach((color, index) => {
    const radius = width * (0.14 + index * 0.08 + Math.sin(time * 0.6 + index) * 0.02) * (0.4 + intensity);
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  });
}

function drawCanvasElectrolysis(ctx, width, height, time, intensity, seed) {
  const leftX = width * 0.38;
  const rightX = width * 0.62;
  const baseY = height * 0.74;

  [leftX, rightX].forEach((x, sideIndex) => {
    const count = Math.floor((sideIndex === 0 ? 18 : 11) * intensity);

    for (let index = 0; index < count; index += 1) {
      const phase = (time * (0.22 + sideIndex * 0.04) + seededUnit(seed, index + sideIndex * 40)) % 1;
      const y = baseY - phase * height * 0.48;
      const dx = (seededUnit(seed, index + 80) - 0.5) * 36;
      ctx.strokeStyle = sideIndex === 0 ? `rgba(125, 211, 252, ${(1 - phase) * 0.62})` : `rgba(253, 224, 71, ${(1 - phase) * 0.55})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(x + dx, y, 2 + seededUnit(seed, index + 100) * 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

function drawCanvasPhenomenon(ctx, width, height, time, state) {
  const profile = resolvePhenomenonProfile(state);
  const intensity = getCanvasIntensity(state);
  const seed = hashString(`${state.experiment.slug}-${profile.kind}`);

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  if (profile.kind === "gas") {
    drawCanvasBubbleField(ctx, width, height, time, intensity, seed, profile);
    if (state.phaseKey === "transferring" || state.phaseKey === "verified") {
      drawCanvasFlow(ctx, width, height, time, intensity, seed);
      drawCanvasPrecipitate(ctx, width, height, time, state.phaseKey === "verified" ? intensity : intensity * 0.55, seed + 3, {
        ...profile,
        centerX: 0.72,
        centerY: 0.62
      });
    }
  } else if (profile.kind === "precipitate") {
    drawCanvasPrecipitate(ctx, width, height, time, intensity, seed, profile);
  } else if (profile.kind === "flame") {
    drawCanvasFlame(ctx, width, height, time, intensity, seed, profile);
  } else if (profile.kind === "crystal") {
    drawCanvasCrystals(ctx, width, height, time, intensity, seed, profile);
  } else if (profile.kind === "distillation") {
    drawCanvasFlow(ctx, width, height, time, intensity, seed);
  } else if (profile.kind === "metal") {
    drawCanvasMetal(ctx, width, height, time, intensity, seed, profile);
  } else if (profile.kind === "electrolysis") {
    drawCanvasElectrolysis(ctx, width, height, time, intensity, seed);
  } else if (profile.kind === "color") {
    drawCanvasColorShift(ctx, width, height, time, intensity, seed, profile);
  } else {
    drawCanvasColorShift(ctx, width, height, time, intensity * 0.58, seed, profile);
    drawCanvasBubbleField(ctx, width, height, time, intensity * 0.42, seed, profile);
  }

  ctx.restore();
}

function CanvasPhenomenonLayer({ state, reduceMotion }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return undefined;
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observer?.observe(canvas);

    let startTime = performance.now();
    const tick = (now) => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width && height) {
        drawCanvasPhenomenon(context, width, height, (now - startTime) / 1000, stateRef.current);
      }

      if (!reduceMotion) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      observer?.disconnect();
    };
  }, [reduceMotion]);

  return <canvas aria-hidden="true" className="lab-phenomenon-canvas" ref={canvasRef} />;
}

function classifyStageMaterialVisual(copy, experiment, kind) {
  const text = `${copy ?? ""} ${experiment.title ?? ""} ${experiment.slug ?? ""}`;

  if (/高锰酸钾|KMnO4|kmno/i.test(text)) {
    return { key: "kmno4", label: "KMnO4 粉末", type: "powder", tone: "purple", target: "tube" };
  }

  if (/二氧化锰|MnO2/i.test(text)) {
    return { key: "mno2", label: "MnO2 催化剂", type: "powder", tone: "black", target: "flask" };
  }

  if (/镁带|magnesium/i.test(text)) {
    return { key: "magnesium", label: "镁带", type: "magnesium", tone: "silver", target: "flame" };
  }

  if (/铁钉|铁丝|iron nail|iron/i.test(text)) {
    return { key: "iron-nail", label: "打磨铁钉", type: "nail", tone: "steel", target: "tube" };
  }

  if (/铁片|铜片|锌片|铝片|铜板|锌板|金属片|待镀金属/i.test(text)) {
    return { key: "metal-strip", label: "金属片", type: "metal-strip", tone: "metal", target: "beaker" };
  }

  if (/蛋壳/i.test(text)) {
    return { key: "eggshell", label: "碎蛋壳", type: "solid", tone: "eggshell", target: "beaker" };
  }

  if (/大理石|碳酸钙|CaCO3|CaCO₃/i.test(text)) {
    return { key: "marble", label: "碳酸盐固体", type: "solid", tone: "marble", target: "beaker" };
  }

  if (/食盐|NaCl|晶体|结晶|crystal/i.test(text)) {
    return { key: "crystal", label: "晶体/食盐", type: "crystal", tone: "crystal", target: "dish" };
  }

  if (/酒精灯|加热|点燃|火源|燃烧|heat|flame/i.test(text)) {
    return { key: "heat", label: "酒精灯", type: "heat", tone: "heat", target: kind === "distillation" ? "flask" : "center" };
  }

  if (/电源|通电|电流|电极|电解|电镀|power|electrode/i.test(text)) {
    return { key: "power", label: "电源/电极", type: "power", tone: "power", target: "electrode" };
  }

  if (/指示剂|紫甘蓝|石蕊|酚酞|碘液|淀粉|色素|indicator|starch/i.test(text)) {
    return { key: "indicator", label: "显色试剂", type: "liquid", tone: "indicator", target: "liquid" };
  }

  if (/石灰水|lime/i.test(text)) {
    return { key: "limewater", label: "石灰水", type: "liquid", tone: "lime", target: "tube" };
  }

  if (/盐酸|白醋|醋酸|硝酸|硫酸|氢氧化钠|NaOH|硫酸铜|CuSO4|CuSO₄|溶液|试剂|液体|滴管/i.test(text)) {
    return { key: "solution", label: "反应溶液", type: "liquid", tone: "solution", target: "liquid" };
  }

  return null;
}

function getStageMaterialVisuals(state) {
  const steps = getDemoStepsForExperiment(state.experiment);
  const visuals = [];
  const seen = new Set();
  const currentVisual = state.interactionProfile
    ? classifyStageMaterialVisual(
        `${state.interactionProfile.label} ${state.interactionProfile.helper}`,
        state.experiment,
        state.kind
      )
    : null;

  // Only show materials from completed steps. The current step's reagent should
  // appear as the draggable tool, not as a second non-interactive prop.
  steps.slice(0, Math.max(0, state.stepIndex)).forEach((step) => {
    const visual = classifyStageMaterialVisual(`${step.title} ${step.note}`, state.experiment, state.kind);

    if (visual?.key && currentVisual?.key === visual.key) {
      return;
    }

    if (visual && !seen.has(visual.key)) {
      seen.add(visual.key);
      visuals.push(visual);
    }
  });

  return visuals.slice(-3);
}

function MaterialVisualIcon({ visual }) {
  if (visual.type === "nail") {
    return (
      <span className="lab-real-prop-icon lab-real-prop-icon-nail">
        <span className="lab-real-nail-head" />
        <span className="lab-real-nail-body" />
        <span className="lab-real-nail-tip" />
      </span>
    );
  }

  if (visual.type === "magnesium") {
    return (
      <span className="lab-real-prop-icon lab-real-prop-icon-magnesium">
        <span className="lab-real-magnesium-strip" />
      </span>
    );
  }

  if (visual.type === "metal-strip") {
    return (
      <span className="lab-real-prop-icon lab-real-prop-icon-metal-strip">
        <span className="lab-real-metal-strip" />
      </span>
    );
  }

  if (visual.type === "powder") {
    return (
      <span className={`lab-real-prop-icon lab-real-prop-icon-powder lab-real-prop-tone-${visual.tone}`}>
        {RepeatedSpans({ count: 12 })}
      </span>
    );
  }

  if (visual.type === "solid") {
    return (
      <span className={`lab-real-prop-icon lab-real-prop-icon-solid lab-real-prop-tone-${visual.tone}`}>
        {RepeatedSpans({ count: 5 })}
      </span>
    );
  }

  if (visual.type === "crystal") {
    return (
      <span className="lab-real-prop-icon lab-real-prop-icon-crystal">
        {RepeatedSpans({ count: 7 })}
      </span>
    );
  }

  if (visual.type === "heat") {
    return (
      <span className="lab-real-prop-icon lab-real-prop-icon-heat">
        <span className="lab-real-burner-base" />
        <span className="lab-real-burner-flame" />
      </span>
    );
  }

  if (visual.type === "power") {
    return (
      <span className="lab-real-prop-icon lab-real-prop-icon-power">
        <span className="lab-real-power-wire" />
        <span className="lab-real-power-spark" />
      </span>
    );
  }

  return (
    <span className={`lab-real-prop-icon lab-real-prop-icon-liquid lab-real-prop-tone-${visual.tone}`}>
      <span />
    </span>
  );
}

function StageMaterialMemoryLayer({ state }) {
  const visuals = getStageMaterialVisuals(state);

  if (!visuals.length) {
    return null;
  }

  return (
    <div aria-hidden="true" className={`lab-material-memory lab-material-memory-${state.kind}`}>
      {visuals.map((visual) => (
        <div className={`lab-real-prop lab-real-prop-${visual.type} lab-real-prop-target-${visual.target}`} key={visual.key}>
          <MaterialVisualIcon visual={visual} />
          <span>{visual.label}</span>
        </div>
      ))}
    </div>
  );
}

function Tube({ tone, active, children }) {
  return (
    <div className={`demo-tube demo-tube-${tone} ${active ? "demo-tube-active" : ""}`}>
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

function LabBeaker({ side, liquidClassName, label, children }) {
  return (
    <div className={`lab-beaker lab-beaker-${side}`}>
      <span className="lab-beaker-rim" />
      <span className="lab-glass-highlight" />
      <span className="lab-measure-lines" />
      <div className={`lab-liquid ${liquidClassName}`}>
        <span className="lab-liquid-meniscus" />
      </div>
      <span className="lab-beaker-label">{label ?? (side === "left" ? "反应瓶" : "检验瓶")}</span>
      {children}
    </div>
  );
}

const stageToolSize = {
  width: 178,
  height: 104
};

function StageToolIcon({ interaction }) {
  if (interaction.toolShape === "magnesium") {
    return (
      <span className="lab-stage-tool-icon lab-stage-tool-icon-magnesium" aria-hidden="true">
        <span className="lab-drag-magnesium-ribbon" />
        <span className="lab-drag-magnesium-spark" />
      </span>
    );
  }

  if (interaction.toolShape === "powder") {
    return (
      <span className="lab-stage-tool-icon lab-stage-tool-icon-powder" aria-hidden="true">
        <span className="lab-drag-powder-spoon" />
        <span className="lab-drag-powder-grains">{RepeatedSpans({ count: 8 })}</span>
      </span>
    );
  }

  if (interaction.toolTone === "metal") {
    return (
      <span className="lab-stage-tool-icon lab-stage-tool-icon-metal" aria-hidden="true">
        <span className="lab-drag-nail">
          <span className="lab-drag-nail-head" />
          <span className="lab-drag-nail-body" />
          <span className="lab-drag-nail-tip" />
        </span>
      </span>
    );
  }

  if (interaction.toolTone === "heat") {
    return (
      <span className="lab-stage-tool-icon lab-stage-tool-icon-heat" aria-hidden="true">
        <span className="lab-drag-burner-flame" />
        <span className="lab-reagent-bottle-label">{interaction.icon}</span>
      </span>
    );
  }

  if (interaction.toolTone === "power") {
    return (
      <span className="lab-stage-tool-icon lab-stage-tool-icon-power" aria-hidden="true">
        <span className="lab-drag-power-wire" />
        <span className="lab-reagent-bottle-label">{interaction.icon}</span>
      </span>
    );
  }

  return (
    <span className="lab-stage-tool-icon" aria-hidden="true">
      <span className="lab-reagent-bottle-liquid" />
      <span className="lab-reagent-bottle-label">{interaction.icon}</span>
    </span>
  );
}

function StageDragTool({ containerRef, interaction, onCommit, reduceMotion }) {
  const bounds = useStageBounds(containerRef);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStatus, setDragStatus] = useState("ready");
  const [isDragging, setIsDragging] = useState(false);
  const [targetFeedback, setTargetFeedback] = useState("idle");
  const [manualInteracted, setManualInteracted] = useState(false);
  const commitTimerRef = useRef(null);
  const autoTimerRef = useRef(null);

  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
    setDragStatus("ready");
    setIsDragging(false);
    setTargetFeedback("idle");
    setManualInteracted(false);
  }, [interaction?.id, interaction?.nextStep]);

  useEffect(() => {
    if (dragStatus !== "pouring") {
      return undefined;
    }

    const delay = reduceMotion ? 180 : interaction?.commitDelayMs ?? 760;
    setTargetFeedback("pouring");
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

  useEffect(() => {
    if (targetFeedback !== "rejected") {
      return undefined;
    }

    const feedbackTimer = window.setTimeout(() => {
      setTargetFeedback("idle");
    }, reduceMotion ? 240 : 620);

    return () => window.clearTimeout(feedbackTimer);
  }, [reduceMotion, targetFeedback]);

  useEffect(() => {
    if (!bounds || !interaction || interaction.autoPlay !== true || manualInteracted || dragStatus !== "ready" || isDragging) {
      return undefined;
    }

    const delay = reduceMotion ? 260 : interaction.autoStartDelayMs ?? 920;
    autoTimerRef.current = window.setTimeout(() => {
      const startCenter = resolveStagePoint(bounds, interaction.start);
      const targetCenter = resolveStagePoint(bounds, interaction.target);

      setTargetFeedback("accepted");
      setDragOffset({
        x: targetCenter.x - startCenter.x,
        y: targetCenter.y - startCenter.y
      });
      setDragStatus("snapping");
    }, delay);

    return () => {
      if (autoTimerRef.current) {
        window.clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [bounds, dragStatus, interaction, isDragging, manualInteracted, reduceMotion]);

  if (!interaction || !bounds) {
    return null;
  }

  const startCenter = resolveStagePoint(bounds, interaction.start);
  const dockCenter = {
    x: Math.max(stageToolSize.width / 2 + 18, Math.min(bounds.width - stageToolSize.width / 2 - 18, bounds.width * 0.24)),
    y: Math.max(stageToolSize.height / 2 + 18, Math.min(bounds.height - stageToolSize.height / 2 - 18, bounds.height * 0.78))
  };
  const visualStartCenter = interaction.docked === false ? startCenter : dockCenter;
  const targetCenter = resolveStagePoint(bounds, interaction.target);
  const snapOffset = {
    x: targetCenter.x - visualStartCenter.x,
    y: targetCenter.y - visualStartCenter.y
  };
  const isSnapping = dragStatus === "snapping";
  const isPouring = dragStatus === "pouring";
  const isNearTarget = targetFeedback === "near" || targetFeedback === "accepted" || isSnapping || isPouring;
  const activeOffset = isSnapping || isPouring ? snapOffset : dragOffset;
  const pourPose = interaction.pourPose ?? { rotate: 0, scale: 1.02 };
  const feedbackMessage =
    targetFeedback === "rejected"
      ? "没有对准目标，试剂已回弹"
      : isPouring
        ? interaction.rule?.resultLabel ?? "正在加入试剂"
        : isSnapping || targetFeedback === "accepted"
          ? "已吸附，准备加入"
          : targetFeedback === "near"
            ? "目标已锁定，松手加入"
            : isDragging
              ? "拖向发光目标区"
              : "拖动试剂到目标区";
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
        } ${isNearTarget ? "lab-drop-zone-near" : ""} lab-drop-zone-feedback-${targetFeedback}`}
        style={{
          left: targetCenter.x,
          top: targetCenter.y
        }}
      >
        <span>{interaction.targetLabel ?? (interaction.targetSide === "left" ? "反应位" : "检验位")}</span>
      </div>

      <AnimatePresence initial={false}>
        {targetFeedback !== "idle" || isDragging || isPouring ? (
          <motion.div
            aria-live="polite"
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            className={`lab-feedback-toast lab-feedback-toast-${targetFeedback}`}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
            key={feedbackMessage}
            transition={resolveMotionTransition("reactive", reduceMotion)}
          >
            {feedbackMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>

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
            ) : interaction.commitEffect === "spark-burst" ? (
              <div className="lab-stage-spark-field">{RepeatedSpans({ count: 8 })}</div>
            ) : interaction.commitEffect === "heat-pulse" ? (
              <div className="lab-stage-heat-field">{RepeatedSpans({ count: 5 })}</div>
            ) : interaction.commitEffect === "metal-drop" ? (
              <div className="lab-stage-metal-drop">
                <span className="lab-stage-metal-nail" />
                <span className="lab-stage-metal-splash" />
              </div>
            ) : interaction.commitEffect === "powder-drop" ? (
              <div className="lab-stage-powder-drop">
                <span className="lab-stage-powder-spoon" />
                <div className="lab-stage-powder-grains">{RepeatedSpans({ count: 10 })}</div>
              </div>
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
        } ${isPouring ? "lab-stage-tool-pouring" : ""} ${
          interaction.autoPlay === true && dragStatus === "ready" ? "lab-stage-tool-autoplay" : ""
        } ${targetFeedback === "near" ? "lab-stage-tool-near" : ""} ${
          targetFeedback === "rejected" ? "lab-stage-tool-rejected" : ""
        }`}
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
        onDrag={(_, info) => {
          const currentCenter = {
            x: visualStartCenter.x + info.offset.x,
            y: visualStartCenter.y + info.offset.y
          };

          setTargetFeedback(getPointDistance(currentCenter, targetCenter) <= interaction.radius ? "near" : "dragging");
        }}
        onDragEnd={(_, info) => {
          setIsDragging(false);

          const releaseCenter = {
            x: visualStartCenter.x + info.offset.x,
            y: visualStartCenter.y + info.offset.y
          };

          if (getPointDistance(releaseCenter, targetCenter) <= interaction.radius) {
            setTargetFeedback("accepted");
            setDragStatus("snapping");
            setDragOffset(snapOffset);
            return;
          }

          setTargetFeedback("rejected");
          setDragStatus("ready");
          setDragOffset({ x: 0, y: 0 });
        }}
        onDragStart={() => {
          setIsDragging(true);
          setManualInteracted(true);
          setTargetFeedback("dragging");
        }}
        style={{
          left: visualStartCenter.x - stageToolSize.width / 2,
          top: visualStartCenter.y - stageToolSize.height / 2,
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
        <StageToolIcon interaction={interaction} />
        <span className="lab-stage-tool-copy">
          <strong>{isPouring ? interaction.actionLabel ?? "正在加入..." : interaction.label}</strong>
          <small>
            {isPouring
              ? interaction.rule?.resultLabel ?? "已经吸附到目标位，正在完成加入动作"
              : interaction.autoPlay === false
                ? interaction.helper
                : `${interaction.helper}，也可直接拖动`}
          </small>
        </span>
      </motion.button>
    </>
  );
}

function IndicatorScene({ state, motionEnabled, reduceMotion }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const isActive = state.flags.reactionStarted || state.phaseKey === "observing" || state.phaseKey === "complete";
  const isSettled = state.phaseKey === "observing" || state.phaseKey === "complete";

  return (
    <div className="demo-scene demo-scene-indicator">
      {["pink", "violet", "amber"].map((tone, index) => (
        <Tube active={isActive} key={tone} tone={tone}>
          <MotionElement
            as="span"
            className="demo-indicator-droplet"
            enabled={motionEnabled}
            motionProps={{
              animate: reduceMotion
                ? { opacity: 1 }
                : isActive
                  ? {
                      opacity: [0, 1, 0.28],
                      y: [-18, 52, 68],
                      scale: [0.72, 1, 0.78]
                    }
                  : { opacity: 0, y: -20, scale: 0.72 },
              transition: isActive
                ? {
                    duration: 1.05,
                    ease: "easeInOut",
                    repeat: isSettled ? 0 : Infinity,
                    delay: index * 0.16
                  }
                : transition
            }}
          />
          <MotionElement
            as="div"
            className="demo-tube-color-front"
            enabled={motionEnabled}
            motionProps={{
              animate: reduceMotion
                ? { opacity: 1 }
                : isActive
                  ? {
                      opacity: isSettled ? 0.86 : [0.18, 0.76, 0.48],
                      scaleY: isSettled ? 1 : [0.2, 1.08, 0.86],
                      y: isSettled ? 0 : [18, -4, 2]
                    }
                  : { opacity: 0.04, scaleY: 0.08, y: 20 },
              transition: isActive
                ? {
                    ...transition,
                    duration: 1.18,
                    delay: index * 0.12
                  }
                : transition
            }}
          >
            {RepeatedSpans({ count: 4 })}
          </MotionElement>
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
        className={`demo-magnesium-ribbon ${isActive ? "demo-magnesium-ribbon-burning" : ""}`}
        enabled={motionEnabled}
        motionProps={{
          animate: reduceMotion
            ? { opacity: 1 }
            : isActive
              ? {
                  opacity: [0.86, 1, 0.92],
                  y: [0, -4, 0],
                  filter: [
                    "brightness(1.2)",
                    "brightness(1.8)",
                    "brightness(1.35)"
                  ]
                }
              : { opacity: 0.92, y: 0, filter: "brightness(1)" },
          transition: isActive
            ? {
                duration: 0.8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }
            : transition
        }}
      >
        <span />
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
  const growthProgress =
    state.phaseKey === "complete" ? 1 : state.phaseKey === "observing" ? 0.78 : state.phaseKey === "reacting" ? 0.45 : 0.12;

  return (
    <div className="demo-scene demo-scene-crystal" style={{ "--crystal-progress": growthProgress }}>
      <div className="demo-dish">
        <MotionElement
          as="div"
          className="demo-dish-liquid"
          enabled={motionEnabled}
          motionProps={{
            style: { transformOrigin: "center bottom" },
            animate: reduceMotion
              ? { opacity: 1 }
              : {
                  opacity: 0.92 - growthProgress * 0.22,
                  scaleY: 1 - growthProgress * 0.36,
                  filter: isGrowing ? "saturate(1.18) brightness(1.06)" : "saturate(1) brightness(1)"
                },
            transition
          }}
        />
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
        <MotionElement
          as="div"
          className="demo-crystal-seed-cloud"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : isGrowing
                ? { opacity: [0.18, 0.62, 0.36], scale: [0.84, 1.08, 0.96], y: [10, -3, 2] }
                : { opacity: 0.06, scale: 0.72, y: 14 },
            transition: isGrowing
              ? {
                  duration: 1.16,
                  ease: "easeInOut",
                  repeat: state.phaseKey === "complete" ? 0 : Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 8 })}
        </MotionElement>
        <div className="demo-dish-crystals">{RepeatedSpans({ count: 10 })}</div>
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

function DisplacementScene({ state, motionEnabled, reduceMotion }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const nailLoaded = state.stepIndex >= 1 || state.phaseKey === "reacting" || state.phaseKey === "observing" || state.phaseKey === "complete";
  const reactionVisible = state.stepIndex >= 2 || state.phaseKey === "observing" || state.phaseKey === "complete";
  const settled = state.phaseKey === "observing" || state.phaseKey === "complete";

  return (
    <div className="demo-scene demo-scene-displacement">
      <div className="real-lab-bench" />
      <div className="real-test-tube-rack">
        <span />
        <span />
        <span />
      </div>
      <div className="real-test-tube real-test-tube-main">
        <span className="real-test-tube-glass" />
        <span className="real-test-tube-rim" />
        <span className="real-test-tube-highlight" />
        <span className="real-test-tube-graduations" />
        <MotionElement
          as="span"
          className={`real-test-tube-liquid ${reactionVisible ? "real-test-tube-liquid-reacted" : ""}`}
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  backgroundPosition: reactionVisible ? ["0% 0%", "100% 45%", "0% 0%"] : "0% 0%"
                },
            transition: reactionVisible
              ? {
                  duration: 2.8,
                  ease: "easeInOut",
                  repeat: Infinity
                }
              : transition
          }}
        >
          <span className="real-liquid-meniscus" />
        </MotionElement>

        <MotionElement
          as="div"
          className={`real-iron-nail real-iron-nail-in-tube ${reactionVisible ? "real-iron-nail-reacted" : ""}`}
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: nailLoaded ? 1 : 0 }
              : nailLoaded
                ? {
                    opacity: 1,
                    y: 0,
                    rotate: reactionVisible ? [-9, -8, -10, -9] : -9,
                    scale: 1
                  }
                : { opacity: 0, y: -72, rotate: -18, scale: 0.96 },
            transition: reactionVisible
              ? {
                  duration: 1.7,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        >
          <span className="real-iron-nail-head" />
          <span className="real-iron-nail-body" />
          <span className="real-iron-nail-tip" />
          <MotionElement
            as="span"
            className="real-copper-coating"
            enabled={motionEnabled}
            motionProps={{
              animate: reduceMotion
                ? { opacity: reactionVisible ? 1 : 0 }
                : reactionVisible
                  ? { opacity: [0.28, 0.9, 0.72], scaleY: settled ? 1 : [0.2, 1.05, 0.86] }
                  : { opacity: 0, scaleY: 0.12 },
              transition: reactionVisible
                ? {
                    duration: 1.4,
                    ease: "easeInOut"
                  }
                : transition
            }}
          />
        </MotionElement>

        <MotionElement
          as="div"
          className="real-copper-particles"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: reactionVisible ? 1 : 0 }
              : reactionVisible
                ? { opacity: [0.24, 0.82, 0.5], scale: [0.86, 1.08, 0.96] }
                : { opacity: 0, scale: 0.72 },
            transition: reactionVisible
              ? {
                  duration: 1.25,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              : transition
          }}
        >
          {RepeatedSpans({ count: 12 })}
        </MotionElement>

        <MotionElement
          as="div"
          className="real-solution-wake"
          enabled={motionEnabled}
          motionProps={{
            animate: reduceMotion
              ? { opacity: reactionVisible ? 1 : 0 }
              : reactionVisible
                ? { opacity: [0.18, 0.58, 0.26], scale: [0.86, 1.08, 0.96], y: [12, -4, 2] }
                : nailLoaded
                  ? { opacity: 0.18, scale: 0.8, y: 12 }
                  : { opacity: 0, scale: 0.72, y: 16 },
            transition: reactionVisible
              ? {
                  duration: 1.36,
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
      <div className="real-stage-label">
        <span>CuSO4 溶液</span>
        <strong>{reactionVisible ? "铁钉表面析出红铜，溶液逐渐偏绿" : "请把打磨铁钉拖入试管"}</strong>
      </div>
    </div>
  );
}

function FizzTransferScene({ state, motionEnabled, reduceMotion, interactive, onInteractiveStepChange }) {
  const transition = resolveMotionTransition(state.transitionPreset, reduceMotion);
  const sceneRef = useRef(null);
  const carbonateCopy = getCarbonateInteractionCopy(state.experiment);
  const isEggshellDemo = carbonateCopy.isEggshell;
  const isCharged = state.flags.chargeLoaded;
  const isReacting = state.flags.reactionStarted;
  const isTransferring = !isEggshellDemo && (state.phaseKey === "transferring" || state.phaseKey === "verified");
  const isVerified = !isEggshellDemo && state.phaseKey === "verified";
  const interaction = interactive ? state.interactionProfile : null;
  const activeRule = interaction?.rule ?? state.rule;
  const stageHint = interaction
    ? interaction.autoHint ?? `${interaction.helper}。`
    : isVerified
      ? "石灰水已经明显变浑浊，完成二氧化碳检验。"
      : state.flags.finished && isEggshellDemo
        ? "蛋壳表面持续冒泡并逐渐变薄，完成蛋壳与白醋的观察。"
      : isTransferring
        ? "观察导管中的气体持续进入石灰水。"
        : activeRule?.observation ?? "现在进入观察阶段，确认反应是否稳定进行。";

  return (
    <div
      className={`lab-stage-shell ${interactive ? "lab-stage-shell-interactive" : ""} ${
        isEggshellDemo ? "lab-stage-shell-single-vessel" : ""
      }`}
      ref={sceneRef}
    >
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
          <span className="lab-stage-hint-label">{interaction ? "实验动作" : "阶段提示"}</span>
          <strong>{interaction ? interaction.label : state.flags.finished ? (isEggshellDemo ? "完成观察" : "完成检验") : "观察变化"}</strong>
          <p>{stageHint}</p>
        </MotionElement>
      </AnimatePresence>

      <LabBeaker label={isEggshellDemo ? "反应杯" : "反应瓶"} side="left" liquidClassName="lab-liquid-reactant">
        <div
          className={`lab-rocks lab-carbonate-solids ${
            isEggshellDemo ? "lab-carbonate-solids-eggshell" : "lab-carbonate-solids-marble"
          } ${isCharged ? "lab-rocks-loaded" : ""}`}
        >
          {RepeatedSpans({ count: isEggshellDemo ? 5 : 3 })}
        </div>
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

      {!isEggshellDemo ? (
        <>
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
            label="检验瓶"
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
        </>
      ) : null}

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
    case "displacement":
      return <DisplacementScene motionEnabled={motionEnabled} reduceMotion={reduceMotion} state={state} />;
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
  const genericStageRef = useRef(null);
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
      <CanvasPhenomenonLayer reduceMotion={reduceMotion} state={state} />
      <StageMaterialMemoryLayer state={state} />
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
      </MotionElement>
    );
  }

  return (
    <MotionElement
      as="div"
      className={`demo-stage demo-stage-${state.kind} demo-phase-${state.phaseKey}`}
      data-motion-preset={state.motionPreset}
      data-rule-effect={state.resultEffect}
      ref={genericStageRef}
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
      {interactive && state.interactionProfile ? (
        <StageDragTool
          containerRef={genericStageRef}
          interaction={state.interactionProfile}
          onCommit={onInteractiveStepChange}
          reduceMotion={reduceMotion}
        />
      ) : null}
    </MotionElement>
  );
}
