import { Button } from "@/components/ui";
import { getDictionary } from "@/i18n/dictionary";
import { defaultLocale, localePath } from "@/i18n/config";

export default function NotFound() {
  // Route params are unavailable in not-found, so this renders in the default
  // locale; middleware puts every real navigation on a locale path.
  const dict = getDictionary(defaultLocale);
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="font-display text-5xl text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-900">
        {dict.common.notFound}
      </h1>
      <p className="mt-4 leading-relaxed text-ink-700">{dict.common.notFoundBody}</p>
      <div className="mt-8">
        <Button href={localePath(defaultLocale, "/")}>{dict.common.backHome}</Button>
      </div>
    </div>
  );
}
