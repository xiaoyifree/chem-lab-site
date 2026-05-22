import { experiments, getExperimentBySlug } from "@/data/experiments";
import { ExperimentDetailPage as ExperimentDetailView } from "@/components/experiment-detail-page";

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

export default async function ExperimentSlugPage({ params }) {
  const { slug } = await params;
  return <ExperimentDetailView slug={slug} />;
}
