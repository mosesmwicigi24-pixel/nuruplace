import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getFooterLinks, site } from "@/content/site";
import { ministries } from "@/content/ministries";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { localePath, type Locale } from "@/i18n/config";

export function SiteFooter({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  const dict = getDictionary(locale);
  const links = getFooterLinks(locale);

  return (
    <footer className="site-footer">
      <div className="shell grid-footer section">
        <div>
          <div className="brandmark">
            <span className="brandmark-glyph" aria-hidden>
              ✝
            </span>
            <span className="strong on-dark">{site.name}</span>
          </div>
          <p className="t-small" style={{ marginTop: "var(--s-4)" }}>
            {locale === "sw"
              ? "Kanisa linalotuma wamisionari. Tunatamani kuonyesha upendo wa Kristo kwa watu wote kwa kushiriki Habari Njema ya Bwana wetu Yesu Kristo na kila mtu duniani kote."
              : "A missionary sending church. We desire to show the love of Christ to all people by sharing the Good News of our Lord Jesus Christ with every soul across the world."}
          </p>
          <div className="pill-row">
            {site.socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pill"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2>{dict.common.quickLinks}</h2>
          <ul className="footer-links">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-quiet">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>{dict.common.ourMinistries}</h2>
          <ul className="footer-links">
            {ministries.map((m) => (
              <li key={m.slug}>
                <Link
                  href={localePath(locale, `/ministries/${m.slug}`)}
                  className="link-quiet"
                >
                  {t(m.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>{dict.common.contactUs}</h2>
          <ul className="footer-meta">
            <li>
              <MapPin className="icon" aria-hidden />
              <span>
                {site.contact.address}
                <br />
                {site.contact.city}
              </span>
            </li>
            <li>
              <Phone className="icon" aria-hidden />
              <a href={site.contact.phoneHref} className="link-quiet">
                {site.contact.phone}
              </a>
            </li>
            <li>
              <Mail className="icon" aria-hidden />
              <a
                href={`mailto:${site.contact.email}`}
                className="link-quiet"
                style={{ overflowWrap: "anywhere" }}
              >
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-base">
        <div className="shell">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
