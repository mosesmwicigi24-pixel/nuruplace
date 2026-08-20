import { Button } from "@/components/ui";
import { getDictionary } from "@/i18n/dictionary";
import { defaultLocale, localePath } from "@/i18n/config";

export default function NotFound() {
  // Route params are unavailable here, so this renders in the default locale;
  // the proxy puts every real navigation on a locale path.
  const dict = getDictionary(defaultLocale);
  return (
    <div className="not-found">
      <p className="code">404</p>
      <h1 className="t-sub" style={{ marginTop: "var(--s-4)" }}>
        {dict.common.notFound}
      </h1>
      <p className="t-body" style={{ marginTop: "var(--s-4)" }}>
        {dict.common.notFoundBody}
      </p>
      <div style={{ marginTop: "var(--s-8)" }}>
        <Button href={localePath(defaultLocale, "/")}>{dict.common.backHome}</Button>
      </div>
    </div>
  );
}
