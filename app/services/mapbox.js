import MapBoxGL from "mapbox-gl";
import ReactDOM from "react-dom";
import marker from "../assets/marker.svg";

const MapboxService = class {
  constructor(container, map, nav) {
    MapBoxGL.accessToken = window.ENV.MAPBOX_ACCESS_TOKEN;
    map.current = new MapBoxGL.Map({
      container: container.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [4.891332614225945, 52.373091430357476], // Dam square
      zoom: 15,
      // antialias: true,
      // cooperativeGestures: false,
      // doubleClickZoom: false,
    });
    nav.current = new MapBoxGL.NavigationControl({
      visualizePitch: true,
    });
    map.current.addControl(nav.current, "bottom-right");
    this.map = map.current;
    return this;
  }

  getData =
    ({ data, source = "shops", Component }) =>
    async () => {
      this.map.addSource(source, {
        type: "geojson",
        data,
      });
      this.map.addLayer({
        id: "shops",
        type: "symbol",
        source: "shops",
        layout: {
          "icon-image": "croissant",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-size": 0.3,
          "icon-offset": [0, -75],
        },
      });
      let img = new Image(150, 150);
      img.onload = () => this.map.addImage("croissant", img);
      img.src = marker;

      // Change the cursor to a pointer when the mouse is over the shops layer.
      this.map.on("mouseenter", "shops", () => {
        this.map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      this.map.on("mouseleave", "shops", () => {
        this.map.getCanvas().style.cursor = "";
      });

      this.showPopup(Component);
    };

  showPopup = (Component) => {
    // When a click event occurs on a feature in the shops layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    this.map.on("click", "shops", (e) => {
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      const markerHeight = 50;
      const markerRadius = 10;
      const linearOffset = 25;
      const popupOffsets = {
        top: [0, 0],
        "top-left": [0, 0],
        "top-right": [0, 0],
        bottom: [0, -markerHeight],
        "bottom-left": [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        "bottom-right": [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        left: [markerRadius, (markerHeight - markerRadius) * -1],
        right: [-markerRadius, (markerHeight - markerRadius) * -1],
      };

      // https://stackoverflow.com/a/50713162/5225096
      const placeholder = document.createElement("div");
      ReactDOM.render(<Component {...e.features[0].properties} />, placeholder);

      new MapBoxGL.Popup({ offset: popupOffsets })
        .setDOMContent(placeholder)
        .setLngLat(coordinates)
        .addTo(this.map);
    });
  };
};

export default MapboxService;
