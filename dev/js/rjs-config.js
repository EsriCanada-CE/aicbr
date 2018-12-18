require.config({
    waitSeconds: 200,
    paths: {
        // App components
        "d3": "../vendor/d3/d3",
        "esri-leaflet": "../vendor/esri-leaflet/dist/esri-leaflet",
        "esri-leaflet-geocoder": "../vendor/esri-leaflet-geocoder/dist/esri-leaflet-geocoder",
        "jquery": "../vendor/jquery/dist/jquery",
        "leaflet": "../vendor/leaflet/dist/leaflet",
        "leaflet-default-extent": "../vendor/leaflet-default-extent/dist/leaflet.defaultextent",
        "leaflet-markers": "../vendor/Leaflet.extra-markers/dist/js/leaflet.extra-markers.min",
        "leaflet-locate": "../vendor/leaflet.locatecontrol/src/L.Control.Locate",
        "leaflet-marker-cluster": "../vendor/leaflet.markercluster/dist/leaflet.markercluster",
        //"leaflet-zoomhome": "../vendor/leaflet.zoomhome/dist/leaflet.zoomhome.min",
        //"meld": "../components/meld/meld",
        "mmenu": "../vendor/jQuery.mmenu/dist/jquery.mmenu.all",
        "bootstrap": "../vendor/bootstrap/dist/js/bootstrap.min",
        "calcite": "../vendor/calcite-maps/dist/js/jquery/calcitemaps-v0.9",
        //"platform": "../components/platform/platform",

        // App modules
        "controllers": "controllers",
        "modules": "modules",
        "services": "services",
        "views": "views"
    },
    shim: {
        "jquery": {
          exports: "$"
        },
        "mmenu": {
            deps: ["jquery"]
        },
        "leaflet": {
          exports: "L"
        },
        "leaflet-default-extent": {
            deps: ["leaflet"]
        },
        "leaflet-locate": {
            deps: ["leaflet"]
        },
        "leaflet-marker-cluster": {
            deps: ["leaflet"],
        },
        "esri-leaflet": {
            deps: ["leaflet"]
        },
        "esri-leaflet-geocoder": {
            deps: ["leaflet", "esri-leaflet"]
        },
        "leaflet-markers": {
            deps: ["leaflet"]
        },
        "bootstrap": {
            deps: ["jquery"]
        },
        "calcite": {
            deps: ["bootstrap", "esri-leaflet", "esri-leaflet-geocoder"]
        }
    }
});

// Require jQuery, so we can use $(document).ready()
// Require the main AICBR app controller so that we can initialize italics
// Require Calcite (so that the Calcite Maps UI is loaded - we don't need to do anything else with it)
require(["controllers/app", "calcite"], function(app) {
    app();
});
