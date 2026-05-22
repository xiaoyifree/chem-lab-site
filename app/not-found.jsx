import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell subpage-shell">
      <section className="empty-state">
        <p className="eyebrow">404</p>
        <h1>这个实验页面还没有准备好</h1>
        <p className="lede">你可以先返回实验目录，继续查看已经完成的实验内容。</p>
        <Link className="button button-primary" href="/experiments">
          返回实验目录
        </Link>
      </section>
    </main>
  );
}
