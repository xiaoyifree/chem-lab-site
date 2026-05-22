import { experiments, featuredSlug } from "@/data/experiments";
import { ExperimentsExplorer } from "@/components/experiments-explorer";

export const metadata = {
  title: "实验目录 | Chem Lab Studio"
};

export default function ExperimentIndexPage() {
  return (
    <main className="page-shell subpage-shell">
      <ExperimentsExplorer defaultSlug={featuredSlug} experiments={experiments} />
    </main>
  );
}
