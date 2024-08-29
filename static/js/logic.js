// Initial Map Config

// tile layers for the background of the map
var defualtMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
// grayscale layer
var grayscale = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
});
// Satellite
var satellite = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'jpg'

});
// Terrain
var terrain = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
});
// basemap
let basemaps = {
    Terrain: terrain,
    GrayScale: grayscale,
    Satellite: satellite,
    Defualt: defualtMap
}
// make a map object
var myMap = L.map("map", {
    center: [35.7596, -79.0193],
    zoom: 7,
    layers: [terrain, grayscale,satellite, defualtMap]
});

// add the default map to the map
defualtMap.addTo(myMap);

// Earthquake data
// Variable to hold earthquake layer
let earthquakes = new L.layerGroup();

// grabbing data for earthquakes, plotting, and styling on map using USGS GeoJSON
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson")
    .then(function(earthquakeData) {
        // test with console
        // console.log(earthquakeData);
        // plot circles with radius =~ magnitude and color =~ depth
        function dataColor(depth) {
            if (depth > 90)
                return "#fd5e63";
            else if (depth > 70)
                return "#f9a15d";
            else if (depth > 50)
                return "#fab52f";
            else if (depth > 30)
                return "#f4d821";
            else if (depth > 10)
                return "#d8f11d";
            else if (depth > -10)
                return "#a0f31d"; // ✨ C O L O R S ✨
        }

        // making a rough determination of radius by using magnitude to determine the radius of data points (What I just wrote makes 100% perfect sense)
        function radiusSize(mag){
            if (mag == 0) // this makes points still appear even if they are a zero, because zero times anything is zero
                return .5;
            else
                return mag * 5;
        }

        // style for each data point
        function dataStyle(feature)
        {
            return {
                opacity: .8,
                fillOpacity: 0.8,
                fillColor: dataColor(feature.geometry.coordinates[2]),
                color: "#000000",
                radius: radiusSize(feature.properties.mag),
                weight: 0.3,

            }
        }

        // point locations (GeoJson)
        L.geoJson(earthquakeData, {
            // turn each feature to point on map
            pointToLayer: function(feature, latLng) {
                return L.circleMarker(latLng);
            },
            // style for points
            style: dataStyle,

        }).addTo(earthquakes)
    },


)
// Time to see if this works
earthquakes.addTo(myMap);



// Lines for tectonic plates
// var for holding earthquake data
let tectonicPlates = new L.layerGroup();
// tectonic plate data grab
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
    .then(function(platedata){
        // console log
        // console.log(platedata);

        // load using geoJson, adding to tectonic plates layer group
        L.geoJson(platedata,{
            // ✨ S T Y L I N G ✨
            color: "blue",
            weight: 2

        }).addTo(tectonicPlates);
    });
// adding techtonic data to the map
tectonicPlates.addTo(myMap)
// legend

// overlay
let overlays = {
    "Tectonic Plates": tectonicPlates,
    "Earthquakes Past 30 Days": earthquakes,
}

// Layer control
L.control
    .layers(basemaps, overlays)
    .addTo(myMap)
