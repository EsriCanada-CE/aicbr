/* global define */

define(
  [

    "jquery",
    "controllers/map-controller",
    "mmenu"

  ], function(

    $,
    mapCtrl

  ) {

    /**
     * Private
     */

    var _onShowAbout = function() {

      mapCtrl.onShowAbout();

    },


    _onToggleType = function(e) {

      mapCtrl.onToggleType(e);

    },

    _onChangeCommunity = function(e) {

      mapCtrl.onChangeCommunity(e);

    },

    _onChangeTargetGroup = function(e) {

      mapCtrl.onChangeTargetGroup(e);

    },

    _onToggleGeocoder = function() {

      mapCtrl.onToggleGeocoder();

    },

    _registerEventListeners = function() {

      var API = $("#menu").data("mmenu");
      this.mmenu.on("closed.mm", function() {
        $("#menu .mm-panel").first().trigger("open.mm");
      });
      $(".menu-button").click(function() {
        API.open();
      });
      $(".menu-about").on("click", _onShowAbout);
      $(".menu-toggle").on("change", _onToggleType);
      $(".menu-radio-community").on("change", _onChangeCommunity);
      $(".menu-radio-target-group").on("change", _onChangeTargetGroup);
      $(".search-button").on("click", _onToggleGeocoder);

    },

    /**
     * Public
     */

    init = function(config) {

      this.config = $.extend(this.config, config);
      if (!this.mmenu) {
        this.mmenu = $("#menu").mmenu(this.config.mmenu.options, this.config.mmenu.config);
      }
      this.mmenu.removeClass("no-display");

      _registerEventListeners.call(this);

    };

    return {

      config: {},
      mmenu: null,
      init: init

    };
  }
);
