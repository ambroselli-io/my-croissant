import { useEffect, useRef } from "react";
import MapboxService from "../services/mapbox";
import Popup from "./Popup";

const Map = () => {
  const mapContainerRef = useRef(null);
  const map = useRef(null);
  const nav = useRef(null);

  useEffect(() => {
    const MyMap = new MapboxService(mapContainerRef, map, nav);
    MyMap.map.on(
      "load",
      MyMap.getData({ data: `${window.ENV.API_URL}/shop?geojson=true`, Component: Popup })
    );
  }, []);

  return (
    <>
      <div ref={mapContainerRef} id="maproot" className="h-full border-2 border-black" />
    </>
  );
};

export default Map;
