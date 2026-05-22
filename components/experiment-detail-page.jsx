import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperimentBySlug } from "@/data/experiments";
import { CarbonDioxideLabDemo } from "@/components/carbon-dioxide-lab-demo";
import { SoundToggle } from "@/components/sound-toggle";
import { ReactionScene } from "@/components/reaction-scene";

export function ExperimentDetailPage({ slug }) {
  const experiment = getExperimentBySlug(slug);

  if (!experiment) {
    notFound();
  }

  if (slug === "carbon-dioxide-preparation") {
    return <CarbonDioxideExperimentPage experiment={experiment} />;
  }

  return (
    <main className="page-shell subpage-shell">
      <div className="detail-topbar">
        <Link className="inline-link" href="/experiments">
          返回实验目录
        </Link>
        <SoundToggle compact />
      </div>

      <section className="detail-hero">
        <div className="detail-copy">
          <div className={`level-badge ${experiment.badgeClass}`}>{experiment.level}</div>
          <h1>{experiment.title}</h1>
          <p className="lede">{experiment.summary}</p>
          <div className="chip-row">
            {experiment.tags.map((tag) => (
              <span className="chip" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <ReactionScene variant={experiment.sceneVariant} />
      </section>

      <section className="detail-grid">
        <article className="detail-card">
          <h2>实验目标</h2>
          <p>{experiment.objective}</p>
        </article>
        <article className="detail-card">
          <h2>器材与药品</h2>
          <ul className="detail-list">
            {experiment.materials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="detail-card">
          <h2>操作步骤</h2>
          <ol className="detail-list detail-list-numbered">
            {experiment.steps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
        <article className="detail-card">
          <h2>现象说明</h2>
          <p>{experiment.observation}</p>
          <p>
            <strong>反应方程式：</strong>
            {experiment.equation}
          </p>
        </article>
        <article className="detail-card">
          <h2>安全提示</h2>
          <ul className="detail-list">
            {experiment.safetyNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="detail-card">
          <h2>课后练习</h2>
          <ul className="detail-list">
            {experiment.practice.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

function CarbonDioxideExperimentPage({ experiment }) {
  return (
    <main className="page-shell subpage-shell">
      <div className="detail-topbar">
        <Link className="inline-link" href="/experiments">
          返回实验目录
        </Link>
        <SoundToggle compact />
      </div>

      <section className="immersive-hero">
        <div className="immersive-copy">
          <p className="eyebrow">Chemistry Lab Story</p>
          <div className={`level-badge ${experiment.badgeClass}`}>{experiment.level}</div>
          <h1>{experiment.title}</h1>
          <p className="lede">{experiment.subtitle || experiment.summary}</p>
          <div className="chip-row">
            {(experiment.highlights || experiment.tags).map((item) => (
              <span className="chip" key={item}>
                {item}
              </span>
            ))}
          </div>
          <div className="equation-panel">
            <span className="equation-label">核心方程式</span>
            <strong>{experiment.equation}</strong>
          </div>
        </div>
        <ReactionScene variant={experiment.sceneVariant} />
      </section>

      <section className="immersive-overview">
        <article className="story-card story-card-primary">
          <p className="eyebrow">Experiment Goal</p>
          <h2>这节实验课要解决什么问题？</h2>
          <p>{experiment.objective}</p>
        </article>
        <article className="story-card">
          <p className="eyebrow">Why It Matters</p>
          <h2>学生会看到什么关键现象？</h2>
          <p>{experiment.observation}</p>
        </article>
      </section>

      <CarbonDioxideLabDemo />

      <section className="immersive-grid">
        <article className="detail-card timeline-card">
          <p className="eyebrow">Procedure</p>
          <h2>实验流程</h2>
          <ol className="detail-list detail-list-numbered">
            {experiment.steps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>

        <article className="detail-card materials-card">
          <p className="eyebrow">Materials</p>
          <h2>器材与药品</h2>
          <ul className="detail-list">
            {experiment.materials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="detail-card safety-card">
          <p className="eyebrow">Safety</p>
          <h2>安全提示</h2>
          <ul className="detail-list">
            {experiment.safetyNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="detail-card knowledge-card">
          <p className="eyebrow">Knowledge</p>
          <h2>知识拓展</h2>
          <ul className="detail-list">
            {(experiment.knowledge || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="detail-card teacher-card">
          <p className="eyebrow">Teacher Prompt</p>
          <h2>引导提问</h2>
          <ul className="detail-list">
            {(experiment.teacherPrompt || experiment.practice).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="detail-card practice-card">
          <p className="eyebrow">After Class</p>
          <h2>课后练习</h2>
          <ul className="detail-list">
            {experiment.practice.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
