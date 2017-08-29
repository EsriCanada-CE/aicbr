/* global define, mixpanel, navigator */

define( [
    "config",
    "jquery",
    "leaflet",
    "esri-leaflet",
    "esri-leaflet-geocoder",
    "modules/d3-cluster-icon",
    "modules/programPopup",
    "modules/programFilters",
    "leaflet-marker-cluster",
    "leaflet-locate",
    "leaflet-default-extent",
    "leaflet-markers",
    "mmenu"
], function(
    config,
    $,
    L,
    esri,
    Geocoding,
    clusterIcon,
    programPopup,
    programFilters
) {

    var currentTerritory,
      map,
      dataLayer,
      dataLayerInfo,
      basemapLayer,
      basemapLayerLabels,
      worldTransportation,
      defaultExtent,
      icons = {},
      programMarkers = [],
      programsLayer = L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true,
        iconCreateFunction: clusterIcon.defineClusterIcon
      });

    $.each(config.program_types.display.types, function(programType, iconConfig){
      icons[programType] =  L.ExtraMarkers.icon(iconConfig);
    });

    function setBasemap(basemap) {
        if (basemapLayer) {
            map.removeLayer(basemapLayer);
        }
        if (basemap === 'OpenStreetMap') {
            basemapLayer = L.tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
        } else {
            basemapLayer = esri.basemapLayer(basemap);
        }
        map.addLayer(basemapLayer);
        if (basemapLayerLabels) {
            map.removeLayer(basemapLayerLabels);
        }

        if (['ShadedRelief','Oceans','Gray','DarkGray','Imagery','Terrain'].indexOf(basemap)!=-1) {
            basemapLayerLabels = esri.basemapLayer(basemap + 'Labels');
            map.addLayer(basemapLayerLabels);
        }

          // add world transportation service to Imagery basemap
        if (basemap === 'Imagery' && worldTransportation) {
            worldTransportation.addTo(map);
        } else if (map.hasLayer(worldTransportation)) {
            // remove world transportation if Imagery basemap is not selected
            map.removeLayer(worldTransportation);
        }
        $('ul.basemaps input:not([value="'+basemap+'"])').prop("checked",false);
        $('ul.basemaps input[value="'+basemap+'"]:not(:checked)').prop("checked",true);
    }

    // Attach search control for desktop or mobile
    function attachSearch() {
        var parentName = $(".geocoder-control").parent().attr("id"),
            geocoder = $(".geocoder-control"),
            width = $(window).width();
        if (width <= 767 && parentName !== "geocodeMobile") {
            geocoder.detach();
            $("#geocodeMobile").append(geocoder);
        } else if (width > 767 && parentName !== "geocode"){
            geocoder.detach();
            $("#geocode").append(geocoder);
        }
    }

    function loadData(terr)
    {
      currentTerritory = terr;

      document.location.hash = "#"+terr;
      $('ul.territories input:not([value="'+terr+'"])').prop("checked",false);
      $('ul.territories input[value="'+terr+'"]:not(:checked)').prop("checked",true);

      $('#location-title').html(config.territories[terr].label);
      dataLayer = esri.featureLayer({url: config.territories[terr].layer});
      programMarkers = [];
      programsLayer.clearLayers();
      dataLayer.metadata(function(error, metadata){
        dataLayerInfo = metadata;
        dataLayer.query().where("1=1").run(function(error, featureCollection){
          $.each(featureCollection.features, function(i, feature) {
            programMarkers.push(
              L.marker(
                [feature.geometry.coordinates[1],feature.geometry.coordinates[0]],
                {
                  icon: (icons[feature.properties.program_type] || icons["Other"]),
                  feature: feature
                }
              ).bindPopup(programPopup.bindPopup)
                .on('popupopen', programPopup.programPopupOpened)
                .on('popupclose', programPopup.programPopupClosed)
            );
          });
          programsLayer.addLayers(programMarkers);
          programFilters.loadFilters(dataLayerInfo, programMarkers, programsLayer, map);

          defaultExtent.setCenter(programsLayer.getBounds().getCenter());
          map.once('zoomend', function() { defaultExtent.setZoom(map.getZoom()); });
          map.fitBounds(programsLayer.getBounds());
        });
      });
    }

    function switchTerritory(terr) {
      if (!terr) return;
      terr = terr.toLowerCase();
      if (!config.territories[terr] || terr == currentTerritory) return;
      loadData(terr);
    }

    return function() {

      // Set text on all elements that match keys specified in config.text:
      $.each(config.text, function(selector, text){
        $(selector).html(text);
      });

      // Add basemaps in config to the basemaps menu...
      var bmMenu = $("ul.basemaps");
      bmMenu.find("li").remove();
      $.each(config.basemaps, function(code,opts){
        if (opts.enabled) bmMenu.append('<li><a href="#'+code+'" class="'+opts.code+'">'+opts.label+'</a> <input type="checkbox" class="Check" value="'+code+'" /></li>');
      });
      bmMenu.click(function(e){
        setBasemap($(e.target).closest("li").find("input").val());
      });

      // Setup the territory menu picker from config...
      var terrMenu = $("ul.territories");
      terrMenu.find("li").remove();
      $.each(config.territories, function(code,opts){
        terrMenu.append('<li><a href="#'+code+'">'+opts.label+'</a> <input type="checkbox" class="Check" value="'+code+'" /></li>');
      });
      terrMenu.click(function(e){
        var terr = $(e.target).closest("li").find("input").val();
        if (terr == currentTerritory) return;
        $('#menu').css("opacity",0.4).delay(300).fadeTo(300,1.0);
        switchTerritory(terr);
      });

      // Create the initial map...
      map = L.map('map', {
        zoomControl: false
      }).setView([64.5, -110], 4);

      // Create the world transport layer (used if a user chooses the imagery basemap).
      worldTransportation = esri.basemapLayer('ImageryTransportation');

      // Set the basemap to Topographic as the initial default...
      setBasemap("Topographic");

      // Add attribution for ourselves...
      map.attributionControl.setPrefix(map.attributionControl.options.prefix + config.labels.appattribution);

      map.addLayer(programsLayer);

      L.control.zoom({
        position: 'topright',
        zoomInTitle: config.labels.zoomInTitle,
        zoomOutTitle: config.labels.zoomOutTitle
      }).addTo(map);

      defaultExtent = L.control.defaultExtent({
        position: 'topright',
        title: config.labels.defaultexstent
      }).addTo(map);

      if (document.location.protocol == "https:")
      {
        L.control.locate({
          position: 'topright',
          strings: {
            title: config.labels.locatetitle,
            popup: config.labels.locatepopup
          }
        }).addTo(map);
      }

      var searchControl = Geocoding.geosearch({
        expanded: true,
        collapseAfterResult: false,
        zoomToResult: false,
        useMapBounds: false,
        placeholder: config.labels.searchplaceholder
      }).addTo(map);

      searchControl.on('results', function(data){
          if (data.results.length > 0) {
              var popup = L.popup()
                  .setLatLng(data.results[0].latlng)
                  .setContent(data.results[0].text)
                  .openOn(map);
              map.setView(data.results[0].latlng)
          }
      });

      // Basemap changed
      $("#selectStandardBasemap").on("change", function(e) {
          setBasemap($(this).val());
      });

      // Search
      var input = $(".geocoder-control-input");

      input.focus(function(){
          $("#panelSearch .panel-body").css("height", "150px");
      });

      input.blur(function(){
           $("#panelSearch .panel-body").css("height", "auto");
      });

      // When the window is resized, check whether the search widget should
      // be visible in the calcite header, or accessed through the side menu.
      $(window).resize(function() {
          attachSearch();
      });

      attachSearch();

      // Check the current location - if "nwt" is in the URL, then set NWT as
      // the current territory...otherwise, default to Yukon.
      loadData(document.location.href.toLowerCase().indexOf("nwt")>-1 ? "nwt" : "yt");

      $('#map').on('click', '.popup-info', {map: map}, programPopup.showMorePopupInfo);

      $(".modal-close").click(function(){
        $('#about-modal').modal('hide');
        $('#program-modal').modal('hide');
      })

      $.each(config.program_types.display.types, function(i,programType){
        $("."+programType.text.classname, "#about-modal")
          .css({color: programType.text.colour})
          .html(programType.text.colourname);
      });

      // Fix the calcite-maps touchmove callback...
      $('.calcite-map').off('touchmove').on('touchmove', function(e){
        var description = $(e.target).closest('.more-info .description');
        if (description.length && description.get(0).scrollHeight > description.get(0).clientHeight)
        {
          // Do not prevent scrolling when there is a scrollable description in the popup...
          return;
        }
        e.preventDefault();
      });

      $("#menu").mmenu({
          offCanvas: false,
          navbar: {
              title: ""
          },
          navbars: [{
              position: "bottom",
              content: [
                  '<a class="fa fa-lg fa-envelope" href="//www.aicbr.ca/contact-us/" target="_blank"></a>',
                  '<a class="fa fa-lg fa-twitter" href="https://twitter.com/AicbrYukon" target="_blank"></a>',
                  '<a class="fa fa-lg fa-facebook" href="https://www.facebook.com/Arctic-Institute-of-Community-Based-Research-947539015291917/?fref=ts" target="_blank"></a>',
                  '<a class="fa fa-lg fa-linkedin-square" href="https://www.linkedin.com/company/arctic-institute-of-community-based-research?trk=biz-companies-cym" target="_blank"></a>',
                  '<a class="fa fa-lg fa-youtube-play" href="https://www.youtube.com/channel/UC0vT-yLsTKZMlX2iBmibEgQ" target="_blank"></a>'
              ]
          }]
      });

      $("#menu .about-item").click(function(){
        map.closePopup();
        programsLayer.unspiderfy();
        $(".calcite-dropdown.open .dropdown-toggle").click();
        $('#about-modal').modal('show');
      });

      $(window).on('hashchange', function(){
        var hash = document.location.hash;
        if (!hash || hash == "#") return;
        switchTerritory(hash.substr(1));
      });
    };
});
