import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "remix";

import tailwind from "./styles/tailwind.css";
import mapboxStyles from "mapbox-gl/dist/mapbox-gl.css";
import popup from "./styles/popup.css";

export function links() {
  return [
    { rel: "stylesheet", href: tailwind },
    { rel: "stylesheet", href: mapboxStyles },
    { rel: "stylesheet", href: popup },
  ];
}

export function meta() {
  return { title: "My Croissant" };
}

export const loader = () => {
  return {
    ENV: {
      API_URL: process.env.API_URL,
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    },
  };
};

export default function App() {
  const { ENV } = useLoaderData();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full relative">
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
