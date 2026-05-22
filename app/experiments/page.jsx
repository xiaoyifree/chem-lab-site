import Link from "next/link";
import { experiments } from "@/data/experiments";

export const metadata = {
  title: "实验目录 | Chem Lab Studio"
};

export default function ExperimentIndexPage() {
  return (
    <main className="page-shell subpage-shell">
      <div className="section-heading">
        <p className="eyebrow">Experiment Library</p>
        <h1>化学实验目录</h1>
        <p className="lede">
          这里汇总了当前的分层实验页面。每个页面都包含实验目标、步骤、现象、方程式、安全提示、互动演示和课后练习。
        </p>
      </div>
      <div className="experiment-grid">
        {experiments.map((experiment) => (
          <Link className="experiment-card" href={`/experiments/${experiment.slug}`} key={experiment.slug}>
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
            <span className="card-cta">查看详情</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
