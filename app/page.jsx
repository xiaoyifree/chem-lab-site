import Link from "next/link";
import { experiments, levels, featuredSlug } from "@/data/experiments";
import { SoundToggle } from "@/components/sound-toggle";
import { ReactionScene } from "@/components/reaction-scene";

const featuredExperiment = experiments.find((experiment) => experiment.slug === featuredSlug);

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="hero-topbar">
            <span className="brand-mark">Chem Lab Studio</span>
            <SoundToggle />
          </div>
          <p className="eyebrow">中学生化学实验网站</p>
          <h1>把实验现象、方程式、互动动画和分层学习放进同一个课堂入口</h1>
          <p className="lede">
            首页按初阶、中阶、高阶组织实验内容，学生可以从现象观察走到反应分析；教师也可以按难度快速组织课堂、作业和探究活动。
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/experiments">
              进入实验目录
            </Link>
            <Link className="button button-secondary" href={`/experiments#${featuredExperiment.slug}`}>
              查看示范实验
            </Link>
          </div>
        </div>
        <ReactionScene variant="hero" />
      </section>

      <section className="info-grid">
        <article className="info-card">
          <h2>目录可点击</h2>
          <p>每个难度层和实验卡片都能直接跳转，避免只有展示没有入口的问题。</p>
        </article>
        <article className="info-card">
          <h2>动画更明显</h2>
          <p>加入气泡上升、试剂流动、火花脉冲和沉淀扩散等动画，首页就能看到化学反应的节奏感。</p>
        </article>
        <article className="info-card">
          <h2>音效可扩展</h2>
          <p>按钮和实验触发音效用浏览器实时合成，先不依赖外部音频文件，后面也能切换成真实素材。</p>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Layered Learning</p>
          <h2>分层实验路线</h2>
        </div>
        <div className="level-grid">
          {levels.map((level) => {
            const levelExperiments = experiments.filter((experiment) => experiment.levelKey === level.key);
            return (
              <article className="level-card" key={level.key}>
                <div className={`level-badge ${level.badgeClass}`}>{level.title}</div>
                <h3>{level.subtitle}</h3>
                <p>{level.description}</p>
                <div className="chip-row">
                  {level.focus.map((item) => (
                    <span className="chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
                <div className="card-links">
                  {levelExperiments.map((experiment) => (
                    <Link className="inline-link" href={`/experiments#${experiment.slug}`} key={experiment.slug}>
                      {experiment.title}
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Featured Lab</p>
          <h2>示范实验</h2>
        </div>
        <article className="featured-card">
          <div className="featured-copy">
            <div className="feature-label">{featuredExperiment.level}</div>
            <h3>{featuredExperiment.title}</h3>
            <p>{featuredExperiment.objective}</p>
            <ul className="meta-list">
              <li>动画演示</li>
              <li>按钮音效</li>
              <li>课堂提问</li>
              <li>安全提醒</li>
            </ul>
            <div className="detail-stack">
              <p>
                <strong>现象：</strong>
                {featuredExperiment.observation}
              </p>
              <p>
                <strong>方程式：</strong>
                {featuredExperiment.equation}
              </p>
              <p>
                <strong>安全：</strong>
                {featuredExperiment.safety}
              </p>
            </div>
            <Link className="button button-primary" href={`/experiments#${featuredExperiment.slug}`}>
              打开完整实验页
            </Link>
          </div>
          <ReactionScene variant="feature" />
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Catalog</p>
          <h2>实验目录</h2>
        </div>
        <div className="experiment-grid">
          {experiments.map((experiment) => (
            <Link className="experiment-card" href={`/experiments#${experiment.slug}`} key={experiment.slug}>
              <div className={`level-badge ${experiment.badgeClass}`}>{experiment.level}</div>
              <h3>{experiment.title}</h3>
              <p>{experiment.summary}</p>
              <div className="chip-row">
                {experiment.tags.map((tag) => (
                  <span className="chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <span className="card-cta">进入实验页</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
