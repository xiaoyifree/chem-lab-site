"use client";

import { useEffect, useMemo, useState } from "react";
import { CarbonDioxideLabDemo } from "@/components/carbon-dioxide-lab-demo";
import { ReactionScene } from "@/components/reaction-scene";

function getInitialSlug(experiments, defaultSlug) {
  if (typeof window === "undefined") {
    return defaultSlug;
  }

  const hashSlug = window.location.hash.replace(/^#/, "");
  return experiments.some((experiment) => experiment.slug === hashSlug) ? hashSlug : defaultSlug;
}

export function ExperimentsExplorer({ experiments, defaultSlug }) {
  const [selectedSlug, setSelectedSlug] = useState(() => getInitialSlug(experiments, defaultSlug));

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

  const handleSelect = (slug) => {
    setSelectedSlug(slug);

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${slug}`);
    }
  };

  const knowledgeItems = selectedExperiment.knowledge ?? [
    `这个实验属于${selectedExperiment.level}内容，重点是理解“现象”和“化学解释”的对应关系。`,
    `方程式：${selectedExperiment.equation}`,
    "建议先做现象观察，再引导学生归纳反应条件、产物特征和安全要求。"
  ];

  const teacherPrompts = selectedExperiment.teacherPrompt ?? selectedExperiment.practice;

  return (
    <div className="explorer-shell">
      <aside className="explorer-sidebar">
        <div className="section-heading">
          <p className="eyebrow">Experiment Switcher</p>
          <h2>选择实验</h2>
          <p className="lede">
            前期先把实验内容稳定放进同一个页面里，避免 GitHub Pages 上的多路由问题，同时保留强视觉和课堂演示感。
          </p>
        </div>

        <div className="explorer-list">
          {experiments.map((experiment) => {
            const isActive = experiment.slug === selectedExperiment.slug;

            return (
              <button
                className={`explorer-item ${isActive ? "explorer-item-active" : ""}`}
                key={experiment.slug}
                onClick={() => handleSelect(experiment.slug)}
                type="button"
              >
                <div className={`level-badge ${experiment.badgeClass}`}>{experiment.level}</div>
                <h3>{experiment.title}</h3>
                <p>{experiment.summary}</p>
                <span className="explorer-cta">{isActive ? "当前实验" : "切换查看"}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="explorer-stage">
        <div className="immersive-hero explorer-hero">
          <div className="immersive-copy">
            <p className="eyebrow">Lab Showcase</p>
            <div className={`level-badge ${selectedExperiment.badgeClass}`}>{selectedExperiment.level}</div>
            <h1>{selectedExperiment.title}</h1>
            <p className="lede">{selectedExperiment.subtitle || selectedExperiment.summary}</p>
            <div className="chip-row">
              {(selectedExperiment.highlights || selectedExperiment.tags).map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
            <div className="equation-panel">
              <span className="equation-label">核心方程式</span>
              <strong>{selectedExperiment.equation}</strong>
            </div>
          </div>

          {selectedExperiment.slug === "carbon-dioxide-preparation" ? (
            <CarbonDioxideLabDemo />
          ) : (
            <ReactionScene variant={selectedExperiment.sceneVariant} />
          )}
        </div>

        <div className="explorer-detail-grid">
          <article className="detail-card timeline-card">
            <p className="eyebrow">Procedure</p>
            <h2>操作步骤</h2>
            <ol className="detail-list detail-list-numbered">
              {selectedExperiment.steps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>

          <article className="detail-card materials-card">
            <p className="eyebrow">Materials</p>
            <h2>器材与药品</h2>
            <ul className="detail-list">
              {selectedExperiment.materials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="detail-card">
            <p className="eyebrow">Observation</p>
            <h2>现象说明</h2>
            <p>{selectedExperiment.observation}</p>
            <p>
              <strong>实验目标：</strong>
              {selectedExperiment.objective}
            </p>
          </article>

          <article className="detail-card safety-card">
            <p className="eyebrow">Safety</p>
            <h2>安全提示</h2>
            <ul className="detail-list">
              {selectedExperiment.safetyNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="detail-card knowledge-card">
            <p className="eyebrow">Knowledge</p>
            <h2>知识拓展</h2>
            <ul className="detail-list">
              {knowledgeItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="detail-card teacher-card">
            <p className="eyebrow">Prompt</p>
            <h2>课堂提问</h2>
            <ul className="detail-list">
              {teacherPrompts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}
