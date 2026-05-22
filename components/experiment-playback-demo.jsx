"use client";

import {
  ExperimentAnimationStage,
  getDemoStepsForExperiment,
  themeByLevel,
  useExperimentPlaybackController
} from "@/components/experiment-animation-system";

export { getDemoStepsForExperiment } from "@/components/experiment-animation-system";

export function ExperimentPlaybackDemo({
  experiment,
  stepIndex: controlledStepIndex,
  onAdvance,
  onReset,
  showControls = true,
  showCopy = true
}) {
  const demoSteps = getDemoStepsForExperiment(experiment);
  const theme = themeByLevel[experiment.levelKey] ?? themeByLevel.intermediate;
  const { stepIndex, handleAdvance, handleReset } = useExperimentPlaybackController({
    steps: demoSteps,
    controlledStepIndex,
    onAdvance,
    onReset,
    toneOnAdvance: experiment.slug.includes("carbon-dioxide") ? "fizz" : "react"
  });

  const stage = (
    <ExperimentAnimationStage experiment={experiment} stepIndex={stepIndex} totalSteps={demoSteps.length} />
  );

  if (!showCopy) {
    return <div className="experiment-visual-shell">{stage}</div>;
  }

  return (
    <section className="lab-demo-panel generic-demo-panel">
      {stage}

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
        {showControls ? (
          <div className="lab-demo-actions">
            <button
              className="button button-primary"
              onClick={handleAdvance}
              style={{
                background: `linear-gradient(135deg, ${theme.left}, ${theme.right})`
              }}
              type="button"
            >
              下一阶段
            </button>
            <button className="button button-secondary" onClick={handleReset} type="button">
              重新演示
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
