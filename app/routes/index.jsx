import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl'
import { useLoaderData } from "remix";

export function loader() {
  return {
    ENV: {
      MAPBOX_ACCES_TOKEN: process.env.MAPBOX_ACCES_TOKEN,
    }
  };
}

export default function Index() {
  const mapRef = useRef(null)
  const map = useRef(null)
  const nav = useRef(null)

  const {ENV} = useLoaderData()

  useEffect(() => {

    mapboxgl.accessToken = ENV.MAPBOX_ACCES_TOKEN

    map.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [4.891332614225945, 52.373091430357476], // Dam square
      zoom: 15,
      // antialias: true,
      // cooperativeGestures: false,
      // doubleClickZoom: false,
    });
    nav.current = new mapboxgl.NavigationControl({
      visualizePitch: true,
    });
    map.current.addControl(nav, "bottom-right");

  }, [])

  return (
    <div ref={mapRef} id="maproot" className="h-full border-2 border-black" />
  );
}
