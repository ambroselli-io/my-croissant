import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "remix";

import tailwind from "./tailwind.css";
import mapboxStyles from 'mapbox-gl/dist/mapbox-gl.css';

export function links() {
  return [{ rel: "stylesheet", href: tailwind }, { rel: "stylesheet", href: mapboxStyles }];
}

export function meta() {
  return { title: "New Remix App" };
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
