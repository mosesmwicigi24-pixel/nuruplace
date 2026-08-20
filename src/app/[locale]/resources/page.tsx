import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download, FileText, FileCheck2, BookOpen, Headphones } from "lucide-react";
import { PageHero } from "@/components/ui";
import { resources, type Resource, type ResourceKind } from "@/content/resources";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.resources };
}

const icons: Record<ResourceKind, typeof FileText> = {
  study: BookOpen,
  form: FileCheck2,
  document: FileText,
  audio: Headphones,
};

export default async function ResourcesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        title={dict.nav.resources}
        subtitle={
          locale === "sw"
            ? "Vifaa vya kufundishia, miongozo ya masomo na vipakuliwa vya kukusaidia kukua katika neno."
            : "Teaching materials, study guides and downloads to help you grow in the word."
        }
      />

      <div className="shell section">
        <ul className="resource-list">
          {resources.map((r) => (
            <ResourceRow key={r.slug} resource={r} locale={locale} dict={dict} />
          ))}
        </ul>
      </div>
    </>
  );
}

function ResourceRow({
  resource,
  locale,
  dict,
}: {
  resource: Resource;
  locale: "en" | "sw";
  dict: ReturnType<typeof getDictionary>;
}) {
  const Icon = icons[resource.kind];

  return (
    <li className="resource-item">
      <Icon className="icon-lg" aria-hidden />
      <div className="resource-body">
        <h2 className="t-card">{t(resource.title, locale)}</h2>
        <p className="t-body">{t(resource.description, locale)}</p>
      </div>

      {/* A file that does not exist gets an honest label, not a dead link —
          a 404 on a church website costs more trust than an admitted gap. */}
      {resource.file ? (
        <a href={resource.file} download className="btn btn-primary resource-action">
          <Download className="icon" aria-hidden />
          <span>
            {dict.common.download}
            {resource.size && ` (${resource.size})`}
          </span>
        </a>
      ) : (
        <span className="resource-pending">{dict.common.notReadyYet}</span>
      )}
    </li>
  );
}
