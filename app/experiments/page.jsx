import { experiments, getExperimentBySlug } from "@/data/experiments";
import { ExperimentDetailPage } from "@/components/experiment-detail-page";

export function generateStaticParams() {
  return experiments.map((experiment) => ({
    slug: experiment.slug
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const experiment = getExperimentBySlug(slug);

  if (!experiment) {
    return {
      title: "实验未找到 | Chem Lab Studio"
    };
  }

  return {
    title: `${experiment.title} | Chem Lab Studio`,
    description: experiment.summary
  };
}

export default async function ExperimentDetailPage({ params }) {
  const { slug } = await params;
  return <ExperimentDetailPage slug={slug} />;
}
