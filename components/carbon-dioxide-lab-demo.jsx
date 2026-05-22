"use client";

import {
  ExperimentAnimationStage,
  themeByLevel,
  useExperimentPlaybackController
} from "@/components/experiment-animation-system";

const carbonDioxideExperimentFallback = {
  slug: "carbon-dioxide-preparation",
  levelKey: "intermediate",
  materials: ["大理石", "稀盐酸", "锥形瓶", "导管", "澄清石灰水"],
  steps: ["加入大理石", "滴加稀盐酸", "观察产气", "通入石灰水", "完成检验"],
  demoSteps: [
    {
      title: "加入大理石",
      note: "锥形瓶中先放入块状碳酸钙，为反应提供稳定表面积。"
    },
    {
      title: "滴加稀盐酸",
      note: "酸液接触碳酸钙后开始放出二氧化碳，锥形瓶内出现持续气泡。"
    },
    {
      title: "观察产气",
      note: "先确认锥形瓶内连续产气，再把检验用石灰水拖到右侧观察位。"
    },
    {
      title: "通入石灰水",
      note: "气体通过导管进入澄清石灰水，右侧液体开始出现浑浊云团。"
    },
    {
      title: "完成检验",
      note: "石灰水明显浑浊，说明我们得到并确认了二氧化碳。"
    }
  ]
};

export const carbonDioxideDemoSteps = carbonDioxideExperimentFallback.demoSteps;

export function CarbonDioxideLabDemo({
  experiment = carbonDioxideExperimentFallback,
  stepIndex: controlledStepIndex,
  onAdvance,
  onReset,
  interactive = false,
  showControls = true,
  showCopy = true
}) {
  const mergedExperiment = {
    ...carbonDioxideExperimentFallback,
    ...experiment,
    demoSteps: experiment.demoSteps?.length ? experiment.demoSteps : carbonDioxideExperimentFallback.demoSteps
  };

  const theme = themeByLevel[mergedExperiment.levelKey] ?? themeByLevel.intermediate;
  const { stepIndex, handleAdvance, handleReset, handleStepChange } = useExperimentPlaybackController({
    steps: mergedExperiment.demoSteps,
    controlledStepIndex,
    onAdvance,
    onReset,
    toneOnAdvance: "fizz"
  });

  const stage = (
    <ExperimentAnimationStage
      experiment={mergedExperiment}
      interactive={interactive}
      kindOverride="fizz-transfer"
      onInteractiveStepChange={handleStepChange}
      stepIndex={stepIndex}
      totalSteps={mergedExperiment.demoSteps.length}
    />
  );

  if (!showCopy) {
    return <div className="experiment-visual-shell">{stage}</div>;
  }

  return (
    <section className="lab-demo-panel">
      {stage}

      <div className="lab-demo-copy">
        <p className="eyebrow">Live Demo</p>
        <h3>{mergedExperiment.demoSteps[stepIndex].title}</h3>
        <p>{mergedExperiment.demoSteps[stepIndex].note}</p>
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
