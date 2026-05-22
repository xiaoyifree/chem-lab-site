import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperimentBySlug } from "@/data/experiments";
import { SoundToggle } from "@/components/sound-toggle";
import { ReactionScene } from "@/components/reaction-scene";

export function ExperimentDetailPage({ slug }) {
  const experiment = getExperimentBySlug(slug);

  if (!experiment) {
    notFound();
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
