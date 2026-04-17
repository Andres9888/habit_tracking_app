import Link from "next/link";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Changelog", href: "/changelog" },
    { name: "Press Kit", href: "/press" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    // Terms still hosted externally until in-domain content lands; see
    // SR-2026-04-17-07 for the follow-up.
    { name: "Terms", href: "https://andres9888.github.io/chainday-landing/terms.html" },
  ],
  connect: [
    { name: "Twitter", href: "https://twitter.com/AndresGutworker" },
    { name: "Email", href: "mailto:support@chainday.app" },
  ],
};

// Any https URL is opened in a new tab with noopener/noreferrer so
// window.opener isn't leaked to third-party sites (SR-2026-04-17-13).
function isExternal(href: string): boolean {
  return href.startsWith("https://") || href.startsWith("http://");
}

export function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🔗</span>
              <span className="text-xl font-bold text-zinc-900 dark:text-white">
                Chain Day
              </span>
            </Link>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Build habits that stick with beautiful chain visualizations.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">
                Product
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerLinks.product.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      {...(isExternal(item.href)
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-sm leading-6 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">
                Legal
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerLinks.legal.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      {...(isExternal(item.href)
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-sm leading-6 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">
                Connect
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerLinks.connect.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      {...(isExternal(item.href)
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-sm leading-6 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-900/10 pt-8 dark:border-zinc-700">
          <p className="text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} Chain Day. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
