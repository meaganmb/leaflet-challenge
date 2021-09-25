// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function magnitudeColor(depth) {
        if (depth <=  10) return "#7FFFD4";
        else if (depth <= 30) return "#00FFFF";
        else if (depth <= 50 ) return "#FFFF00";
        else if (depth <= 70) return "#008B8B";
        else if (depth <= 90) return "#006400";
        else return "#FF0000";
      } function style(data){
        return {
            opacity: 0.5,
            fillOpacity: 0.5,
            weight: 1.5,
            fillColor: magnitudeColor(data.geometry.coordinates[2]),
            color: "white",
            radius: data.properties.mag*9,

        }
    }
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlong){
        return L.circleMarker(latlong)
    },
    onEachFeature: onEachFeature,
    style: style
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
        40.7128, -94.0059
    ],
    zoom: 3,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: "bottomright"});
  legend.onAdd = function (map) { 
    let div = L.DomUtil.create('div', 'info legend'),
    depth = [-10,10,30,50,70,90];
    colors = ["#00FF00","#DFFF00","#FFA07A","#F08080","#FA8072","#FF0000"];

    for (var i = 0; i < depth.length; i++) {
      div.innerHTML += "<i style= 'background: " + colors[i] + "'></i> " + depth[i] + (depth[i + 1] ? "&ndash;" + depth[ i + 1] + "<br>" : "+");
      }
      return div;
      };

  // Adding legend to the map
  legend.addTo(myMap)
}
