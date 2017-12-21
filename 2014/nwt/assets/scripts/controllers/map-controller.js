/* global define */

define(
  [

    "jquery",
    "leaflet",
    //"meld",
    "esri-leaflet",
    "esri-leaflet-geocoder",
    "leaflet-markers",
    "leaflet-locate",
    "leaflet-default-extent"

  ], function(

    $,
    L,
    //meld,
    esri,
    Geocoding

  ) {

    /**
     * Private
     */
    var map, eventLayer, communityList = false;
    var _eventsToggled = [],
    _curFeature,

    _inIFrame = function() {

      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }

    },

    _setWhereFilter = function(where, zoom) {

      if (zoom) {
        var q = eventLayer.query().where(where);
        q.bounds(function(error, bounds) {
          if (bounds) map.fitBounds(bounds);
          eventLayer.setWhere(where);
          return;
        });
        if (communityList === false)
        {
          communityList = {};
          q.run(function(error, featureCollection){
            $.each(featureCollection.features, function(i, feature) {
              communityList[feature.properties.community] = true;
            });
            var comFilters = $('ul.com-filters');
            comFilters.append('<li><a class="label reset">Reset</a></li>');
            $.each(communityList, function(comm) {

              var tcCom = comm.replace(/-/g," ").toTitleCase().replace(
                /Behchokoe/g, "Behchokö").replace(/Lutselk\ E/g,"Lutselk'e");

              comFilters.append('<li><span class="label">' + tcCom + '</span>  <label class="switch">    <input type="checkbox" class="program-filter" value="' + comm + '">      <span class="slider round">    </span>  </label></li>');

            });
            comFilters.find('.loading-label').closest("li").remove();
          });
        }
      } else {
        eventLayer.setWhere(where);
      }

    },

    _setFilter = function(filter, field) {

      return (filter === 'all') ? "" : (field + " = '" + filter + "'");

    },

    _checkArray = function(array, type) {

      var i = array.indexOf(type);
      if (i !== -1) {
        array.splice(i, 1);
      } else {
        array.push(type);
      }

    },

    applyFilter = function(e) {

      e.preventDefault();

      var target = $(e.target);
      if (target.hasClass("reset"))
      {
        target.closest("ul").find('.program-filter').prop('checked',false);
      }
      else if (!target.hasClass("program-filter")) {
        return;
      }

      var selectedProgramTypes = [];
      var selectedTargetGroups = [];
      var selectedCommunities = [];

      var ptFilters = $('ul.pt-filters input');
      var ptSelected = ptFilters.filter(':checked');
      var tgFilters = $('ul.tg-filters input');
      var tgSelected = tgFilters.filter(':checked');
      var comFilters = $('ul.com-filters input');
      var comSelected = comFilters.filter(':checked');

      if (ptSelected.length > 0 && ptSelected.length < ptFilters.length)
      {
        $('ul.pt-filters .reset').addClass('enabled');
        ptSelected.each(function(){
          selectedProgramTypes.push($(this).val());
        });
      } else $('ul.pt-filters .reset').removeClass('enabled');

      if (tgSelected.length > 0 && tgSelected.length < tgFilters.length)
      {
        $('ul.tg-filters .reset').addClass('enabled');
        tgSelected.each(function(){
          var tg = $(this).val();
          selectedTargetGroups.push(tg);
          if (tg == "disabilities") {
            selectedTargetGroups.push("People living with disabilities");
          }
        });
      } else $('ul.tg-filters .reset').removeClass('enabled');

      if (comSelected.length > 0 && comSelected.length < comFilters.length)
      {
        $('ul.com-filters .reset').addClass('enabled');
        comSelected.each(function(){
          selectedCommunities.push($(this).val());
        });
      } else $('ul.com-filters .reset').removeClass('enabled');

      var conditions = [];
      if (selectedProgramTypes.length > 0)
      {
        conditions.push("type_ in ('" + selectedProgramTypes.join("','") + "')");
      }

      if (selectedTargetGroups.length > 0)
      {
        conditions.push("target_group in ('" + selectedTargetGroups.join("','") + "')");
      }

      if (selectedCommunities.length > 0)
      {
        conditions.push("community in ('" + selectedCommunities.join("','") + "')");
      }

      var where = "1=1";
      if (conditions.length > 0)
      {
        where = conditions.join(" and ");
      }

      _setWhereFilter(where, target.closest("ul").hasClass("com-filters"));

    },

    _initMap = function() {

      var map = L.map('map', this.config.map.settings)
        // .setView(this.config.map.view.center, this.config.map.view.zoom)
        .addControl(L.control.zoom(this.config.zoomControl))
        .addControl(L.control.defaultExtent());

      // Check if loaded in an iframe for scroll zoom
      //map.scrollWheelZoom = !_inIFrame();

      return map;

    },

    _initGeocoder = function() {

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

    },

    _initGeolocate = function() {

      var lc = new L.control.locate(this.config.locateControl).addTo(this.map);

      this.map.on('startfollowing', function() {
        this.map.on('dragstart', lc.stopFollowing);
      }.call(this));
      this.map.on('stopfollowing', function() {
        this.map.off('dragstart', lc.stopFollowing);
      }.call(this));

    },

    _constructModalPopup = function(props) {

      var body = [],
      title = props.name,
      categoryContainerClass = "modal-category-container",
      categoryTextClass = "modal-category-text",
      bodyClass = "popup-body modal-main",
      detailsClass = "modal-details",
      labelClass = "modal-label",
      descClass = "modal-description",
      // var detailsClass = "modal-details";
      iconClass = "modal-icon-text " + this.config.markers[props.type_].prefix + " " + this.config.markers[props.type_].prefix + "-" + this.config.markers[props.type_].icon + " fa-2x",
      iconDivClass = "modal-icon modal-icon-" + props.type_;

      $(".modal-title")[0].innerHTML = title;
      // body.push("<div>");
      body.push("<div class='" + categoryContainerClass + "'>");
      body.push("<div class='" + iconDivClass + "'>");
      body.push("<i class='" + iconClass + "'></i>");
      body.push("</div>");
      body.push("<span class='" + categoryTextClass + "'>" + props.type_.capitalize() + "</span>");
      body.push("</div>");
      if (props.img && props.img.length > 0) {
        var imgClass = "popup-img",
        img = "<img src='" + props.img + "' class='" + imgClass + "'></img>";
        body.push(img);
      }
      body.push("<div class='" + bodyClass + "'>");
      body.push("<div class='" + detailsClass + "'>");
      body.push("<i class='fa fa-calendar fa-fw'></i>" + date + "<br />");
      if (time !== "") {
        body.push("<i class='fa fa-clock-o fa-fw'></i>" + time + "<br />");
      }
      body.push("<i class='fa fa-map-marker fa-fw'></i>" + props.venue + "<br />");
      if (price > 0) {
        body.push("<i class='fa fa-money fa-fw'></i>$" + price.toFixed(2) + "<br />");
      } else if (price === 0) {
        body.push("<i class='fa fa-money fa-fw'></i>Free<br />");
      }
      body.push("<span class='" + labelClass + "'>" +  this.config.sourceTypes.field.capitalize() + ":&nbsp;&nbsp;<a href='"+ props.url_ + "' target='_blank'>" + props.source + "</a></span><br />");
      body.push("</div>");
      body.push("<div class='" + descClass + "'>" + props.desc_ + "</div>");
      body.push("</div>");
      // body.push("</div>");

      var html = body.join("");

      $("#feature-info")[0].innerHTML = html;

    },

    _centerPopup = function(e) {

      // Center map on popup and marker
      var px = this.map.project(e.popup._latlng); // find the pixel location on the this.map where the popup anchor is
      px.y -= e.popup._container.clientHeight / 2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
      this.map.panTo(this.map.unproject(px), {
        animate: true
      });

    },

    /**
     * Public
     */

    onToggleGeocoder = function() {

      $(".geocoder-control").click();
      $(".toolbar-header, .aicbr-logo").addClass("geocoder-toggled");

    },

    onOpenPopup = function(e) {

      // Set current feature
      _curFeature = e;
      // _curFeature = e.popup._source.feature;

      _centerPopup.call(this, e);

    },

    onExpandPopup = function() {

      $('.popup-info').addClass('no-display');
      $('.more-info').removeClass('no-display');
      _centerPopup.call(this, _curFeature);

    //   var props = _curFeature.properties;
    //   _constructModalPopup.call(this, props);
    //   this.map.closePopup();
    //   $('#feature-modal').modal('show');

    },

    onCloseModal = function() {

      $('#feature-modal').modal('hide');

    },

    init = function(config) {

      this.config = $.extend(this.config, config);
      // if (this.config.IE) esri.Support.cors = false;
      _eventsToggled = this.config.eventTypes.category;
      this.map = _initMap.call(this);
      _initGeocoder.call(this);
      _initGeolocate.call(this);
      this.eventLayer = this.config.map.settings.layers[0];

      map = this.map;
      eventLayer = this.eventLayer;

      map.attributionControl.setPrefix((map.attributionControl.options.prefix ? map.attributionControl.options.prefix + " | " : "") + 'Designed by <a href="//esri.ca/" target="_blank">Esri Canada</a>');

      _setWhereFilter("1=1", true);

      var searchControl = Geocoding.geosearch({
        expanded: true,
        collapseAfterResult: false,
        zoomToResult: false,
        useMapBounds: false,
        placeholder: "Search for places or addresses"
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

      // Search
      var input = $(".geocoder-control-input");

      input.focus(function(){
          $("#panelSearch .panel-body").css("height", "150px");
      });

      input.blur(function(){
           $("#panelSearch .panel-body").css("height", "auto");
      });

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

      // When the window is resized, check whether the search widget should
      // be visible in the calcite header, or accessed through the side menu.
      $(window).resize(function() {
          attachSearch();
      });

      attachSearch();

      $("#menu").removeClass("hidden");
      $('.about-details').html(this.config.about.desc);
      $("#menu .about-item").click(function(){
        map.closePopup();
        eventLayer.cluster.unspiderfy();
        $(".calcite-dropdown.open .dropdown-toggle").click();
        $('#about-modal').modal('show');
      });
      $(".modal-close").click(function(){
        $('#about-modal').modal('hide');
        $('#program-modal').modal('hide');
      });
    };

    return {

      config: {},
      map: null,
      eventLayer: null,
      init: init,
      onToggleGeocoder: onToggleGeocoder,
      onOpenPopup: onOpenPopup,
      onCloseModal: onCloseModal,
      onExpandPopup: onExpandPopup,
      applyFilter: applyFilter

    };

  }
);
