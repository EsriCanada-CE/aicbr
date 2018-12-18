/* global define, mixpanel, navigator */
define( [
    document.location.href.replace(/[^\/]*$/, '') + "config.js",
    "jquery",
    "leaflet",
    "esri-leaflet",
    "esri-leaflet-geocoder",
    "modules/d3-cluster-icon",
    "modules/programPopup",
    "modules/programFilters",
    "modules/downloadCSV",
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
    programFilters,
    downloadCSV
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

      $("#spinner").removeClass("hidden");

      document.location.hash = "#"+terr;
      $('ul.territories input:not([value="'+terr+'"])').prop("checked",false);
      $('ul.territories input[value="'+terr+'"]:not(:checked)').prop("checked",true);

      $('#location-title').html(config.territories[terr].label);

      var layerUrl = config.territories[terr].layer,
        featureLimit = 1000,
        featureOffset = 0;

      dataLayer = esri.featureLayer({url: layerUrl});
      programMarkers = [];
      programsLayer.clearLayers();
      dataLayer.metadata(function(error, metadata){
        dataLayerInfo = metadata;
        (function runQuery() {
          esri.query({url: layerUrl}).limit(featureLimit).offset(featureOffset).run(function(error, featureCollection){
            featureOffset += featureLimit;
            $.each(featureCollection.features, function(i, feature) {
              programMarkers.push(
                L.marker(
                  [feature.geometry.coordinates[1],feature.geometry.coordinates[0]],
                  {
                    icon: (icons[feature.properties[config.program_types.display.field]] || icons["Other"]),
                    feature: feature
                  }
                ).bindPopup(programPopup.bindPopup)
                  .on('popupopen', programPopup.popupOpened)
                  .on('popupclose', programPopup.popupClosed)
              );
            });


            if (
              featureCollection.properties &&
              featureCollection.properties.exceededTransferLimit
            ) {
              // If the feature limit was exceeded, keep querying until we get
              // all records:
              runQuery();
            } else {
              // Once we have all the features, finish setting up the map display:
              programsLayer.addLayers(programMarkers);
              programFilters.loadFilters(dataLayerInfo, programMarkers, programsLayer, map, terr);
              defaultExtent.setCenter(programsLayer.getBounds().getCenter());
              map.once('zoomend', function() { defaultExtent.setZoom(map.getZoom()); });
              map.fitBounds(programsLayer.getBounds().pad(0.1));
              $("#spinner").addClass('hidden');
            }
          });
        })(); // This will execute the runQuery() function immediately after defining it.
      });
    }

    function switchTerritory(terr) {
      if (!terr) return;
      terr = terr.toLowerCase();
      if (!config.territories[terr] || terr == currentTerritory) return;
      $('.calcite-dropdown, .calcite-dropdown-toggle').removeClass('open');
      $("#menu").data("mmenu").closeAllPanels();
      $.each(config.filters, function(filter_id, filter){
        var filterItem = $('.filter-'+filter_id+'-label').closest('li.mm-listitem')
        if (!filter.territories || filter.territories.indexOf(terr)!=-1) filterItem.removeClass("hidden");
        else filterItem.addClass("hidden");
      });
      loadData(terr);
    }

    function initMenu() {
      var customFilters = $('li.custom-filters-placeholder');
      $.each(config.filters, function(filter_id, filter){
        var filterList = $('ul.filter-'+filter_id);
        if (filterList.length == 0) // If this hasn't been added to the menu yet, insert a new item before the custom filters placeholder item:
        {
          customFilters.before([
            '<li class="hidden">',
              '<span><i class="fa '+filter.icon+' fa-fw"></i>&nbsp; <l class="custom-filter-label filter-'+filter_id+'-label">'+filter.name+'</l></span>',
              '<ul class="filter-'+filter_id+' filter-menu custom-filter">',
                '<li><span class="loading-label">Loading...</span></li>',
              '</ul>',
            '</li>'
          ].join(''));
        }
      });

      $("#menu").mmenu({
        offCanvas: false,
        navbar: {
            title: ""
        },
        navbars: [{
            position: "bottom",
            content: config.menu_footer_items
        }]
      });

      if (config.territory_switch_disabled) {
        $('.chooseterritory-label').closest('.mm-listitem').addClass('hidden');
      }
    }

    return function() {

      // Set text on all elements that match keys specified in config.text:
      $.each(config.text, function(selector, text){
        $(selector).html(text);
      });

      $('.programtypes-label').siblings("i").attr('class', config.program_types.menu_icon);
      $(".targetgroups-label").siblings("i").attr('class', config.target_groups.menu_icon);

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
      var terrMenuItem = $('.chooseterritory-label').closest('li');
      if (Object.keys(config.territories).length > 1) terrMenuItem.removeClass('hidden');
      else terrMenuItem.addClass('hidden'); // Hide the territory picker if only one is available.

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
        title: config.labels.defaultextent
      }).addTo(map);

      if (document.location.protocol == "https:")
      {
        L.control.locate({
          position: 'topright',
          strings: {
            title: config.labels.locatetitle,
            popup: config.labels.locatepopup
          },
          icon: 'fa fa-map-marker-alt'
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

      initMenu();

      // Load the data for the selected territory, or default to the first
      // territory specified in the app config.
      switchTerritory(
        config.territories[document.location.hash.substr(1)] ?
        document.location.hash.substr(1) :
        Object.keys(config.territories)[0]
      );

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

      $("#menu .about-item").click(function(){
        map.closePopup();
        //programsLayer.unspiderfy();
        $(".calcite-dropdown.open, .calcite-dropdown-toggle.open").removeClass('open');
        $('#about-modal').modal('show');
      });

      $("#menu ul.download .complete").click(function(){
        downloadCSV.downloadMarkersAsCSV(
          programMarkers,
          config.territories[currentTerritory].label.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_') + ".csv",
          config.communities.name_field
        );
      });

      $("#menu ul.download .filtered").click(function(){
        downloadCSV.downloadMarkersAsCSV(
          programFilters.getFilteredMarkers(),
          config.territories[currentTerritory].label.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_') + "_filtered.csv",
          config.communities.name_field
        )
      });

      $(window).on('hashchange', function(){
        var hash = document.location.hash;
        if (!hash || !config.territories[hash.substr(1)]) return;
        switchTerritory(hash.substr(1));
      });
    };
});
