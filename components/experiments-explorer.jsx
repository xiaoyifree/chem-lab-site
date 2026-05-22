"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  createExperimentAnimationState,
  ExperimentConsoleMotionProvider,
  resolveMotionTransition
} from "@/components/experiment-animation-system";
import {
  ExperimentPlaybackDemo,
  getDemoStepsForExperiment
} from "@/components/experiment-playback-demo";

function getInitialSlug(experiments, defaultSlug) {
  if (typeof window === "undefined") {
    return defaultSlug;
  }

  const hashSlug = window.location.hash.replace(/^#/, "");
  return experiments.some((experiment) => experiment.slug === hashSlug) ? hashSlug : defaultSlug;
}

function getExperimentCode(experiment) {
  const slug = experiment.slug;

  if (slug.includes("carbon-dioxide")) return "FIZZ";
  if (slug.includes("indicator")) return "PH";
  if (slug.includes("iron") || slug.includes("copper")) return "RUST";
  if (slug.includes("magnesium")) return "FLAME";
  if (slug.includes("precipitation") || slug.includes("hydroxide") || slug.includes("silver")) return "CLOUD";
  if (slug.includes("crystallization") || slug.includes("heating")) return "CRYSTAL";
  if (slug.includes("distillation")) return "DISTILL";
  if (slug.includes("electroplating")) return "PLATE";
  if (slug.includes("rate-control")) return "RATE";
  if (slug.includes("inference")) return "INFER";

  return "LAB";
}

function getExperimentTone(experiment) {
  if (experiment.levelKey === "advanced") {
    return {
      accent: "#ffb703",
      soft: "rgba(255, 183, 3, 0.16)",
      strong: "rgba(255, 183, 3, 0.32)",
      card: "linear-gradient(135deg, rgba(255, 183, 3, 0.24), rgba(255, 122, 0, 0.16))"
    };
  }

  if (experiment.slug.includes("carbon-dioxide")) {
    return {
      accent: "#3ddc97",
      soft: "rgba(61, 220, 151, 0.16)",
      strong: "rgba(61, 220, 151, 0.34)",
      card: "linear-gradient(135deg, rgba(61, 220, 151, 0.26), rgba(54, 99, 255, 0.18))"
    };
  }

  if (
    experiment.slug.includes("precipitation") ||
    experiment.slug.includes("hydroxide") ||
    experiment.slug.includes("silver")
  ) {
    return {
      accent: "#5ea2ff",
      soft: "rgba(94, 162, 255, 0.16)",
      strong: "rgba(94, 162, 255, 0.34)",
      card: "linear-gradient(135deg, rgba(94, 162, 255, 0.24), rgba(174, 139, 255, 0.16))"
    };
  }

  if (experiment.slug.includes("magnesium") || experiment.slug.includes("burning")) {
    return {
      accent: "#ff8a4c",
      soft: "rgba(255, 138, 76, 0.16)",
      strong: "rgba(255, 138, 76, 0.34)",
      card: "linear-gradient(135deg, rgba(255, 138, 76, 0.26), rgba(255, 213, 79, 0.18))"
    };
  }

  return {
    accent: experiment.levelKey === "beginner" ? "#2dd4bf" : "#60a5fa",
    soft: experiment.levelKey === "beginner" ? "rgba(45, 212, 191, 0.16)" : "rgba(96, 165, 250, 0.16)",
    strong:
      experiment.levelKey === "beginner" ? "rgba(45, 212, 191, 0.34)" : "rgba(96, 165, 250, 0.34)",
    card:
      experiment.levelKey === "beginner"
        ? "linear-gradient(135deg, rgba(45, 212, 191, 0.22), rgba(54, 99, 255, 0.14))"
        : "linear-gradient(135deg, rgba(96, 165, 250, 0.22), rgba(99, 102, 241, 0.16))"
  };
}

function getKnowledgeItems(experiment) {
  return (
    experiment.knowledge ?? [
      `这个实验属于${experiment.level}内容，重点是把“现象”和“化学解释”对齐。`,
      `核心反应：${experiment.equation}`,
      "建议先做现象观察，再引导学生归纳条件、产物和安全要求。"
    ]
  );
}

export function ExperimentsExplorer({ experiments, defaultSlug }) {
  const [selectedSlug, setSelectedSlug] = useState(() => getInitialSlug(experiments, defaultSlug));
  const [activeTab, setActiveTab] = useState("steps");
  const [stepIndex, setStepIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onHashChange = () => {
      const hashSlug = window.location.hash.replace(/^#/, "");

      if (experiments.some((experiment) => experiment.slug === hashSlug)) {
        setSelectedSlug(hashSlug);
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [experiments]);

  const selectedExperiment = useMemo(() => {
    return experiments.find((experiment) => experiment.slug === selectedSlug) ?? experiments[0];
  }, [experiments, selectedSlug]);

  useEffect(() => {
    setStepIndex(0);
    setActiveTab("steps");
  }, [selectedExperiment.slug]);

  const tone = getExperimentTone(selectedExperiment);
  const experimentCode = getExperimentCode(selectedExperiment);
  const knowledgeItems = getKnowledgeItems(selectedExperiment);
  const teacherPrompts = selectedExperiment.teacherPrompt ?? selectedExperiment.practice;
  const demoSteps = getDemoStepsForExperiment(selectedExperiment);
  const currentStep = demoSteps[Math.min(stepIndex, demoSteps.length - 1)];
  const animationState = useMemo(
    () =>
      createExperimentAnimationState({
        experiment: selectedExperiment,
        stepIndex,
        totalSteps: demoSteps.length
      }),
    [demoSteps.length, selectedExperiment, stepIndex]
  );
  const panelTransition = useMemo(
    () => resolveMotionTransition(animationState.transitionPreset, prefersReducedMotion),
    [animationState.transitionPreset, prefersReducedMotion]
  );
  const stageIsEmphasized = animationState.phaseKey === animationState.emphasisPhase;

  const handleSelect = (slug) => {
    setSelectedSlug(slug);

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${slug}`);
    }
  };

  const handleAdvance = (nextStep) => {
    setStepIndex(nextStep);
  };

  const handleReset = () => {
    setStepIndex(0);
  };

  const handleStepChange = (nextStep) => {
    setStepIndex(nextStep);
  };

  return (
    <div className="explorer-shell explorer-shell-lab">
      <aside className="explorer-sidebar explorer-sidebar-lab">
        <div className="section-heading section-heading-lab">
          <p className="eyebrow">Experiment Switcher</p>
          <h2>选择实验</h2>
          <p className="lede">
            先把实验稳定放在同一页里切换，再把每个实验做成更完整的课堂演示控制台。
          </p>
        </div>

        <div className="explorer-list explorer-list-lab">
          {experiments.map((experiment) => {
            const isActive = experiment.slug === selectedExperiment.slug;

            return (
              <button
                className={`explorer-item explorer-item-lab ${isActive ? "explorer-item-lab-active" : ""}`}
                key={experiment.slug}
                onClick={() => handleSelect(experiment.slug)}
                style={
                  isActive
                    ? {
                        "--item-accent": tone.accent,
                        "--item-soft": tone.soft
                      }
                    : undefined
                }
                type="button"
              >
                <div className="explorer-item-topline">
                  <div className={`level-badge ${experiment.badgeClass}`}>{experiment.level}</div>
                  <span className="explorer-item-code">{getExperimentCode(experiment)}</span>
                </div>
                <h3>{experiment.title}</h3>
                <p>{experiment.summary}</p>
                <span className="explorer-cta">{isActive ? "当前实验" : "切换查看"}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="explorer-stage explorer-stage-lab">
        <ExperimentConsoleMotionProvider>
          <LayoutGroup id="experiments-console">
            <motion.article
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      y: 0,
                      boxShadow: stageIsEmphasized
                        ? `0 32px 92px rgba(4, 8, 17, 0.34), 0 0 0 1px rgba(255, 255, 255, 0.06), 0 0 44px ${tone.soft}`
                        : "0 30px 90px rgba(4, 8, 17, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.06)"
                    }
              }
              className="lab-console"
              layout={!prefersReducedMotion}
              style={{ "--console-accent": tone.accent, "--console-soft": tone.soft }}
              transition={panelTransition}
            >
              <header className="lab-console-head">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="lab-console-title"
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.985 }}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 22, scale: 0.985 }}
                    key={selectedExperiment.slug}
                    transition={panelTransition}
                  >
                    <div className="lab-console-labels">
                      <span className={`level-badge ${selectedExperiment.badgeClass}`}>{selectedExperiment.level}</span>
                      <span className="lab-console-code">{experimentCode}</span>
                    </div>
                    <h1>{selectedExperiment.title}</h1>
                    <p>{selectedExperiment.subtitle || selectedExperiment.summary}</p>
                  </motion.div>
                </AnimatePresence>
              </header>

              <AnimatePresence initial={false} mode="wait">
                <motion.section
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="lab-equation-bar"
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.99 }}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.99 }}
                  key={`${selectedExperiment.slug}-equation`}
                  style={{ "--equation-card": tone.card }}
                  transition={panelTransition}
                >
                  <span className="lab-equation-caption">化学方程式</span>
                  <strong>{selectedExperiment.equation}</strong>
                </motion.section>
              </AnimatePresence>

              <section className="lab-console-grid">
                <motion.div
                  className="lab-visual-card"
                  layout={!prefersReducedMotion}
                  transition={panelTransition}
                  whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                >
                  <ExperimentPlaybackDemo
                    experiment={selectedExperiment}
                    interactive={selectedExperiment.slug === "carbon-dioxide-preparation"}
                    onAdvance={handleAdvance}
                    onReset={handleReset}
                    showControls={false}
                    showCopy={false}
                    stepIndex={stepIndex}
                  />
                </motion.div>

                <div className="lab-side-stack">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.section
                      animate={{ opacity: 1, y: 0 }}
                      className="lab-side-card lab-side-summary"
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                      key={`${selectedExperiment.slug}-summary`}
                      transition={panelTransition}
                    >
                      <p>{selectedExperiment.objective}</p>
                    </motion.section>
                  </AnimatePresence>

                  <motion.section className="lab-side-card lab-progress-card" layout={!prefersReducedMotion} transition={panelTransition}>
                    <div className="lab-progress-head">
                      <span>步骤进度</span>
                      <strong>
                        {stepIndex + 1}/{demoSteps.length}
                      </strong>
                    </div>
                    <div
                      className="lab-progress-track"
                      style={{ gridTemplateColumns: `repeat(${demoSteps.length}, minmax(0, 1fr))` }}
                    >
                      {demoSteps.map((step, index) => {
                        const isActive = index === stepIndex;
                        const isUnlocked = index <= stepIndex;

                        return (
                          <motion.button
                            animate={
                              prefersReducedMotion
                                ? { opacity: 1 }
                                : {
                                    scaleY: isActive ? 1.16 : 1,
                                    opacity: isUnlocked ? 1 : 0.72,
                                    boxShadow: isActive ? `0 0 18px ${tone.soft}` : "0 0 0 rgba(0, 0, 0, 0)"
                                  }
                            }
                            aria-label={`跳到${step.title}`}
                            className={`lab-progress-dot ${isUnlocked ? "lab-progress-dot-active" : ""}`}
                            key={step.title}
                            layout={!prefersReducedMotion}
                            onClick={() => handleStepChange(index)}
                            transition={panelTransition}
                            type="button"
                          />
                        );
                      })}
                    </div>

                    <AnimatePresence initial={false} mode="wait">
                      <motion.div
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="lab-step-focus"
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.99 }}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
                        key={`${selectedExperiment.slug}-${stepIndex}`}
                        transition={panelTransition}
                      >
                        <h3>
                          步骤 {stepIndex + 1}：{currentStep.title}
                        </h3>
                        <p>{currentStep.note}</p>
                      </motion.div>
                    </AnimatePresence>

                    <div className="lab-step-actions">
                      <motion.button
                        className="lab-step-button lab-step-button-muted"
                        disabled={stepIndex === 0}
                        onClick={() => handleStepChange(Math.max(0, stepIndex - 1))}
                        transition={panelTransition}
                        type="button"
                        whileHover={prefersReducedMotion || stepIndex === 0 ? undefined : { y: -1 }}
                        whileTap={prefersReducedMotion || stepIndex === 0 ? undefined : { scale: 0.985 }}
                      >
                        ← 上一步
                      </motion.button>
                      <motion.button
                        animate={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : {
                                boxShadow:
                                  stepIndex < demoSteps.length - 1
                                    ? `0 0 22px ${tone.soft}`
                                    : "0 0 0 rgba(0, 0, 0, 0)",
                                scale: stepIndex < demoSteps.length - 1 ? 1 : 0.985
                              }
                        }
                        className="lab-step-button"
                        disabled={stepIndex === demoSteps.length - 1}
                        onClick={() => handleStepChange(Math.min(demoSteps.length - 1, stepIndex + 1))}
                        transition={panelTransition}
                        type="button"
                        whileHover={prefersReducedMotion || stepIndex === demoSteps.length - 1 ? undefined : { y: -2, scale: 1.01 }}
                        whileTap={prefersReducedMotion || stepIndex === demoSteps.length - 1 ? undefined : { scale: 0.99 }}
                      >
                        下一阶段 →
                      </motion.button>
                    </div>
                    <motion.button
                      className="lab-reset-button"
                      onClick={handleReset}
                      transition={panelTransition}
                      type="button"
                      whileHover={prefersReducedMotion ? undefined : { y: -1 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                    >
                      重新演示
                    </motion.button>
                  </motion.section>
                </div>
              </section>

              <div className="lab-tab-row">
                {[
                  { key: "steps", label: "📋 全部步骤" },
                  { key: "knowledge", label: "💡 知识点" },
                  { key: "safety", label: "⚠️ 安全" }
                ].map((tab) => (
                  <motion.button
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : {
                            y: activeTab === tab.key ? -2 : 0,
                            boxShadow:
                              activeTab === tab.key ? `0 0 18px ${tone.soft}` : "0 0 0 rgba(0, 0, 0, 0)"
                          }
                    }
                    className={`lab-tab ${activeTab === tab.key ? "lab-tab-active" : ""}`}
                    key={tab.key}
                    layout={!prefersReducedMotion}
                    onClick={() => setActiveTab(tab.key)}
                    transition={panelTransition}
                    type="button"
                    whileHover={prefersReducedMotion ? undefined : { y: -1 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence initial={false} mode="wait">
                {activeTab === "steps" ? (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="lab-step-grid"
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                    key="steps"
                    transition={panelTransition}
                  >
                    {demoSteps.map((step, index) => (
                      <motion.button
                        animate={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : {
                                y: index === stepIndex ? -4 : 0,
                                boxShadow:
                                  index === stepIndex ? `0 0 24px ${tone.soft}` : "0 0 0 rgba(0, 0, 0, 0)"
                              }
                        }
                        className={`lab-step-card ${index === stepIndex ? "lab-step-card-active" : ""}`}
                        key={step.title}
                        layout={!prefersReducedMotion}
                        onClick={() => handleStepChange(index)}
                        transition={panelTransition}
                        type="button"
                        whileHover={prefersReducedMotion ? undefined : { y: index === stepIndex ? -4 : -2 }}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.992 }}
                      >
                        <div className="lab-step-card-index">{index + 1}</div>
                        <div className="lab-step-card-copy">
                          <h3>{step.title}</h3>
                          <p>{step.note}</p>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                ) : null}

                {activeTab === "knowledge" ? (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="lab-info-grid"
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                    key="knowledge"
                    transition={panelTransition}
                  >
                    <motion.article className="lab-info-card" layout={!prefersReducedMotion} transition={panelTransition}>
                      <p className="lab-info-eyebrow">Knowledge</p>
                      <h3>知识拓展</h3>
                      <ul>
                        {knowledgeItems.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </motion.article>

                    <motion.article className="lab-info-card" layout={!prefersReducedMotion} transition={panelTransition}>
                      <p className="lab-info-eyebrow">Prompt</p>
                      <h3>课堂提问</h3>
                      <ul>
                        {teacherPrompts.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </motion.article>
                  </motion.div>
                ) : null}

                {activeTab === "safety" ? (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="lab-info-grid"
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                    key="safety"
                    transition={panelTransition}
                  >
                    <motion.article
                      className="lab-info-card lab-info-card-warning"
                      layout={!prefersReducedMotion}
                      transition={panelTransition}
                    >
                      <p className="lab-info-eyebrow">Safety</p>
                      <h3>安全提示</h3>
                      <ul>
                        {selectedExperiment.safetyNotes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </motion.article>

                    <motion.article className="lab-info-card" layout={!prefersReducedMotion} transition={panelTransition}>
                      <p className="lab-info-eyebrow">Materials</p>
                      <h3>器材与药品</h3>
                      <ul>
                        {selectedExperiment.materials.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </motion.article>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.article>
          </LayoutGroup>
        </ExperimentConsoleMotionProvider>
      </section>
    </div>
  );
}
