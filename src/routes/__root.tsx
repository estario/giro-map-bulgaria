import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { LanguageProvider } from "@/i18n/LanguageProvider";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Giro d'Italia 2026 — Grande Partenza България" },
      { name: "description", content: "Интерактивна карта на маршрута на Giro d'Italia 2026 в България: етапи Несебър–Бургас, Бургас–Велико Търново, Пловдив–София, часове и затворени улици." },
      { name: "author", content: "Giro d'Italia BG" },
      { property: "og:title", content: "Giro d'Italia 2026 — Grande Partenza България" },
      { property: "og:description", content: "Интерактивна карта на маршрута на Giro d'Italia 2026 в България: етапи Несебър–Бургас, Бургас–Велико Търново, Пловдив–София, часове и затворени улици." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Giro d'Italia 2026 — Grande Partenza България" },
      { name: "twitter:description", content: "Интерактивна карта на маршрута на Giro d'Italia 2026 в България: етапи Несебър–Бургас, Бургас–Велико Търново, Пловдив–София, часове и затворени улици." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d2b5ba16-71fe-481c-b1ab-c0ed1454a078/id-preview-b0e1fdb1--79963133-cd82-49b8-bf74-8fd8408039cd.lovable.app-1777706310267.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d2b5ba16-71fe-481c-b1ab-c0ed1454a078/id-preview-b0e1fdb1--79963133-cd82-49b8-bf74-8fd8408039cd.lovable.app-1777706310267.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <LanguageProvider>
      <Outlet />
    </LanguageProvider>
  );
}
