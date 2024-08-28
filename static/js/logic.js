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

// overlay
let overlays = {
    "Tectonic Plates": tectonicPlates
}

// Layer control
L.control
    .layers(basemaps, overlays)
    .addTo(myMap)
