import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "remix";
import tailwind from "./styles/tailwind.css";
import mapboxStyles from "mapbox-gl/dist/mapbox-gl.css";
import popup from "./styles/popup.css";
import Map from "./components/Map";
import ShopObject from "../db/models/shop";

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

export const loader = async () => {
  const shops = await ShopObject.find();
  return {
    ENV: {
      API_URL: process.env.API_URL,
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    },
    data: {
      type: "FeatureCollection",
      features: shops.map(({ _id, name, location }) => ({
        type: "Feature",
        id: _id,
        geometry: location,
        properties: {
          _id,
          title: name,
        },
      })),
    },
  };
};

export default function App() {
  const { ENV, data } = useLoaderData();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full relative flex">
        <Outlet />
        <Map data={data} />
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
