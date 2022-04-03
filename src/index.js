
  /* globals mapboxgl */
import { GEOJSON_FEATURE } from "./constants";
mapboxgl.accessToken =
  "pk.eyJ1IjoiaWJyYWhpbWFobWFkNzAwIiwiYSI6ImNsMHg1MHdpYTFnNmkzZGp3ZnNkNmthZHYifQ.H7w7hOSiXg32tF2uc6LdlA";
  
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-68.13734351262877, 45.137451890638886],
  zoom: 5
});

map.on("load", function() {
  // add layer to the map on load
  addMaineLayer();

  const layerList = document.getElementById("menu");
  const inputs = layerList.getElementsByTagName("input");

  function switchLayer(layer) {
    // addMaineLayer fn will be called once on layer switched
    map.once("styledata", addMaineLayer);
    const layerId = layer.target.id;
    map.setStyle("mapbox://styles/mapbox/" + layerId);
  }

  // set toggle base style events
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
  }
});

function addMaineLayer() {
  map.addSource("maine", {
    type: "geojson",
    data: GEOJSON_FEATURE
  });

  const addLayer = (layer, beforeId) => map.addLayer(layer, beforeId);
  addLayerBefore(
    addLayer,
    {
      id: "maine",
      type: "fill",
      source: "maine",
      layout: {},
      paint: {
        "fill-color": "#088",
        "fill-opacity": 0.8
      }
    },
    "waterway-label"
  );
}

function addLayerBefore(addLayerFn, layer, beforeId) {
  // check beforeId defined and exists on the map
  const beforeLayer = Boolean(beforeId) && map.getLayer(beforeId);
  if (beforeLayer && beforeId === beforeLayer.id) addLayerFn(layer, beforeId);
  else {
    console.warn(
      `Not found layer with id '${beforeId}'.\nLayer '${
        layer.id
      }' added without before.`
    );
    addLayerFn(layer);
  }
}

  