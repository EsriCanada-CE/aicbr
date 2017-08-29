require.config({
  waitSeconds: 200,
  paths: {
    // Components
    "d3": "../components/d3/d3",
    "esri-leaflet": "../components/esri-leaflet/dist/esri-leaflet",
    "esri-leaflet-clustered-feature-layer": "../components/esri-leaflet-clustered-feature-layer/dist/esri-leaflet-clustered-feature-layer",
    "esri-leaflet-geocoder": "../components/esri-leaflet-geocoder/dist/esri-leaflet-geocoder",
    "fastclick": "../components/fastclick/lib/fastclick",
    "jquery": "../components/jquery/dist/jquery",
    "leaflet": "../components/leaflet/dist/leaflet",
    "leaflet-default-extent": "../components/leaflet-default-extent/dist/leaflet.defaultextent",
    "leaflet-markers": "../components/Leaflet.extra-markers/dist/js/leaflet.extra-markers.min",
    "leaflet-locate": "../components/leaflet.locatecontrol/src/L.Control.Locate",
    "leaflet-marker-cluster": "../components/leaflet.markercluster/dist/leaflet.markercluster",
    "meld": "../components/meld/meld",
    "mmenu": "../components/jQuery.mmenu/dist/js/jquery.mmenu.all.min",
    "platform": "../components/platform/platform.js",
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
      deps: ["leaflet"]
    },
    "esri-leaflet": {
      deps: ["leaflet"]
    },
    "esri-leaflet-clustered-feature-layer": {
      deps: ["leaflet", "esri-leaflet", "leaflet-marker-cluster"]
    },
    "esri-leaflet-geocoder": {
      deps: ["leaflet", "esri-leaflet"]
    },
    "leaflet-markers": {
      deps: ["leaflet"]
    }
  }
});

require(
  [

    "jquery",
    "controllers/app-controller"

  ], function(

    $,
    appCtrl

  ) {

    appCtrl.init();

  }
);
