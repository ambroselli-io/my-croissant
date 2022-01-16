import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "remix";
import MyMap from "../services/mapbox";

const damSquare = [4.891332614225945, 52.373091430357476];

const Map = ({ data }) => {
  const mapContainerRef = useRef(null);
  const map = useRef(null);
  const nav = useRef(null);
  let navigate = useNavigate();
  const params = useParams();

  const loadMapFeatures = async () => {
    const coordinates = params.shopId
      ? data.features.find((f) => f.id === params.shopId).geometry.coordinates
      : damSquare;
    MyMap.init(mapContainerRef, map, nav, coordinates, data).then(() =>
      MyMap.enableNavToShop(navigate)
    );
  };

  useEffect(() => {
    loadMapFeatures();
  }, []);

  return <div ref={mapContainerRef} id="maproot" className="h-full w-full flex-shrink flex-grow" />;
};

export default Map;
