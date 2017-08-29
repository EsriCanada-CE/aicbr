/* global define */

define(
  [

    "jquery",
    "leaflet",
    "esri-leaflet",
    "esri-leaflet-clustered-feature-layer",
    "modules/d3-cluster-icon",
    "leaflet-markers"

  ], function(

    $,
    L,
    esri,
    cluster,
    clusterIcon

  ) {

    /**
     * Private
     */

    _createIcons = function() {

      var icons = {
        'healthy-eating': L.ExtraMarkers.icon(this.config.markers['healthy-eating']),
        'active-living': L.ExtraMarkers.icon(this.config.markers['active-living'])
      };

      return (icons);

    },

   _createPopup = function(feature) {

     var body = [],
     props = feature.properties,
     titleClass = "popup-title",
     bodyClass = "popup-body",
     linkClass = "popup-info",
     infoClass = "more-info",
     descClass = "modal-description";
     body.push("<h2 class=" + titleClass + ">" + props.program + "</h2>");
     body.push("<div class='" + bodyClass + "'>");
     if (props.host != "NA") body.push("<i class='fa fa-users fa-fw'></i>" + props.host + "<br />");
     if (props.community != "NA") body.push("<i class='fa fa-map-marker fa-fw'></i>" + props.community.replace("-", " ").toTitleCase() + "<br />");
     if (props.season != "NA") body.push("<i class='fa fa-calendar fa-fw'></i>" + props.season + "<br />");
     if (props.time_frame && props.time_frame.length > 1 && props.time_frame != "NA") {
       body.push("<i class='fa fa-clock-o fa-fw'></i>" + props.time_frame + "<br />");
     }
     if (
       // Check if any of these fields are populated
       (props.desc_ != "NA" && props.desc_.length > 2) ||
       (props.contact_address != "NA" && props.contact_address.length > 2) ||
       (props.contact_email != "NA" && props.contact_email.length > 2) ||
       (props.contact_name != "NA" && props.contact_name.length > 2) ||
       (props.contact_org != "NA" && props.contact_org.length > 2) ||
       (props.contact_phone != "NA" && props.contact_phone.length > 2)
     ) {
       body.push("<a href='#' class=" + linkClass + ">More Info</a>");
       body.push("<div class='" + infoClass + " no-display'>");
       // Description
       if (props.desc_ != "NA") body.push("<p class='description'>" + props.desc_ + "</p>");
       // Contact Details
       if (
         (props.contact_address != "NA" && props.contact_address.length > 2) ||
         (props.contact_email != "NA" && props.contact_email.length > 2) ||
         (props.contact_name != "NA" && props.contact_name.length > 2) ||
         (props.contact_org != "NA" && props.contact_org.length > 2) ||
         (props.contact_phone != "NA" && props.contact_phone.length > 2)
       ) body.push("<h3 class='contact-details'>Contact Details</h3>");
       if (props.contact_name != "NA") body.push("<b>" + props.contact_name + "</b><br />");
       if (props.contact_org != "NA") body.push("<i>" + props.contact_org + "</i><br />");
       if (props.contact_email != "NA") body.push("<i class='fa fa-envelope fa-fw'></i><a href='mailto:" + props.contact_email + "'>" + props.contact_email.split(";")[0] + "</a><br />");
       if (props.contact_address != "NA") body.push("<i class='fa fa-location-arrow fa-fw'></i>" + props.contact_address + "<br />");
       if (props.contact_phone != "NA") body.push("<i class='fa fa-phone fa-fw'></i>" + props.contact_phone + "<br />");
       body.push("</div>");
     }
     body.push("</div>");
     var template = body.join("");
     var popup = L.Util.template(template, props);

     return popup;

   },

    _bindPopup = function(layer) {

      layer.bindPopup(function(feature) {
        var popup = _createPopup(feature);
        return popup;
      });

    },

    _initBasemapLayer = function() {

      var basemapLayer = esri.basemapLayer(this.config.basemap.type, this.config.basemap.settings);

      return basemapLayer;

    },

    _initEventLayer = function() {

      var icons = _createIcons.call(this, this.config),
      eventLayer = cluster.clusteredFeatureLayer({
        url: this.config.eventLayerUrl,
        showCoverageOnHover: false,
        animate: true,
        maxClusterRadius: 2 * this.config.d3.rmax,
        iconCreateFunction: clusterIcon.defineClusterIcon,
        pointToLayer: function(geojson, latlng) {
          return L.marker(latlng, {
            icon: icons[geojson.properties.type_.toLowerCase()]
          });
        }
      });

      _bindPopup.call(this, eventLayer);

      // eventLayer.on("animationend", function(e) {
      //   console.log(e);
      // });

      return eventLayer;

    },

    /**
     * Public
     */

    loadServices = function(config) {

      var layers = [];

      this.config = $.extend(this.config, config);
      this.basemapLayer = _initBasemapLayer.call(this);
      this.eventLayer = _initEventLayer.call(this);

      layers.push(this.eventLayer);
      layers.push(this.basemapLayer);

      return layers;

    };

    return {

      config: {},
      eventLayer: null,
      basemapLayer: null,
      loadServices: loadServices

    };

  }
);
