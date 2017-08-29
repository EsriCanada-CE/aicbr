/* global define */

define(
  [

    "jquery",
    "leaflet",
    "meld",
    "esri-leaflet",
    "esri-leaflet-geocoder",
    "leaflet-markers",
    "leaflet-locate",
    "leaflet-default-extent"

  ], function(

    $,
    L,
    meld,
    esri,
    geocoder

  ) {

    /**
     * Private
     */

    var _eventsToggled = [],
    _communityFilter = "",
    _targetGroupFilter = "",
    _allCommunities = false,
    _typeFilter,
    _allFilters = [],
    _curFeature,

    _inIFrame = function() {

      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }

    },

    _constructFinalArray = function() {

      var array = [];

      if (_communityFilter !== "") array.push(_communityFilter);
      if (_targetGroupFilter !== "") array.push(_targetGroupFilter);
      if (_typeFilter !== "") array.push(_typeFilter);

      return array;

    },

    _constructQuery = function(array, delimiter, field) {

      // If field is provided, changes query to type query
      return (array.length === 0) ?
        "1 = 0" :
        field ?
          (field + " IN ('" + array.join(delimiter) + "')") :
          ("(" + array.join(delimiter) + ")");

    },

    _setWhereFilter = function(zoom) {

      // Might need to rethink this logic...
      var where = _constructQuery(_allFilters, ") AND (");
      if (zoom || _allCommunities || _communityFilter.length > 0) {
        this.eventLayer.query().where(where).bounds(function(error, bounds) {
          _allCommunities = false;
          this.map.fitBounds(bounds);
          this.eventLayer.setWhere(where);
          // this.eventLayer._update();
          return;
        }.bind(this));
      } else {
        this.eventLayer.setWhere(where);
        // this.eventLayer._update();
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

    _changeFilter = function(e, field) {

      e.preventDefault();
      var classString = e.target.className.toString();
      var searchClass = "." + classString.replace(" core-selected", "").replace(/ /g, ".");

      if ($(searchClass)[0].checked) {
        var filter = searchClass.split("_").pop();

        switch(field) {

          case this.config.communityTypes.field:
            if (filter == 'all') _allCommunities = true;
            _communityFilter = _setFilter(filter, field);
            break;

          case this.config.targetGroupTypes.field:
            _targetGroupFilter = _setFilter(filter, field);
            break;

        }

        _allFilters = _constructFinalArray.call(this);
        _setWhereFilter.call(this);
      }

    },

    _initMap = function() {

      var map = L.map('map', this.config.map.settings)
        // .setView(this.config.map.view.center, this.config.map.view.zoom)
        .addControl(L.control.zoom(this.config.zoomControl))
        .addControl(L.control.defaultExtent());

      // Check if loaded in an iframe for scroll zoom
      map.scrollWheelZoom = !_inIFrame();

      return map;

    },

    _initGeocoder = function() {

      // Specify provider
      var arcgisOnline = geocoder.arcgisOnlineProvider(),
      // Create the geocoding control and add it to the map
      searchControl = geocoder.geosearch({
        providers: [arcgisOnline]
      });
      // Add geocoderControl to navbar instead of map
      searchControl._map = this.map;

      var geocoderDiv = searchControl.onAdd(this.map);
      $(".geocoder")[0].appendChild(geocoderDiv);

      meld.after(searchControl, "clear", function() {
        $(".toolbar-header, .aicbr-logo").removeClass("geocoder-toggled");
      });

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

    _setAboutModal = function() {

      var imgClass = "about-img",
      imgContainerClass = "about-img-container",
      detailsClass = "about-details",
      img = "<div class='" + imgContainerClass + "'><img src='" + this.config.about.img + "' class ='" + imgClass + "'></img></div>",
      body = [];
      $(".modal-title")[0].innerHTML = img;
      body.push("<div class = '" + detailsClass + "'>");
      body.push(this.config.about.desc);
      body.push("</div>");

      var html = body.join("");

      $("#feature-info")[0].innerHTML = html;

    },

    /**
     * Public
     */

    onToggleType = function(e) {

      var classString = e.target.className.toString().replace(" core-selected", "");
      var type = classString.split("_").pop();
      _checkArray(_eventsToggled, type);
      _typeFilter = _constructQuery(_eventsToggled, "', '", this.config.eventTypes.field);
      _allFilters = _constructFinalArray.call(this);
      _setWhereFilter.call(this);

    },

    onChangeCommunity = function(e) {

      _changeFilter.call(this, e, this.config.communityTypes.field);

    },

    onChangeTargetGroup = function(e) {

      _changeFilter.call(this, e, this.config.targetGroupTypes.field);

    },

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

    onShowAbout = function() {

      this.map.closePopup();
      _setAboutModal.call(this);
      $('#feature-modal').modal('show');

    },

    init = function(config) {

      this.config = $.extend(this.config, config);
      // if (this.config.IE) esri.Support.cors = false;
      _eventsToggled = this.config.eventTypes.category;
      this.map = _initMap.call(this);
      _initGeocoder.call(this);
      _initGeolocate.call(this);
      this.eventLayer = this.config.map.settings.layers[0];
      _typeFilter = _constructQuery(_eventsToggled, "', '", this.config.eventTypes.field);
      _allFilters = _constructFinalArray.call(this);
      _setWhereFilter.call(this, true);

    };

    return {

      config: {},
      map: null,
      eventLayer: null,
      init: init,
      onToggleType: onToggleType,
      onChangeCommunity: onChangeCommunity,
      onChangeTargetGroup: onChangeTargetGroup,
      onToggleGeocoder: onToggleGeocoder,
      onOpenPopup: onOpenPopup,
      onCloseModal: onCloseModal,
      onExpandPopup: onExpandPopup,
      onShowAbout: onShowAbout

    };

  }
);
