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


    _onToggleGeocoder = function() {

      mapCtrl.onToggleGeocoder();

    },

    applyFilter = function(e) {
      mapCtrl.applyFilter(e);
    }

    _registerEventListeners = function() {

      var API = $("#menu").data("mmenu");
      this.mmenu.on("closed.mm", function() {
        $("#menu .mm-panel").first().trigger("open.mm");
      });
      $(".menu-button").click(function() {
        API.open();
      });
      $(".menu-about").on("click", _onShowAbout);
      $('#menu').on("change", ".pt-filters .program-filter",applyFilter);
      $('#menu').on("change", ".com-filters .program-filter", applyFilter);
      $("#menu").on("change", ".tg-filters .program-filter", applyFilter);
      $('#menu').on("click", ".reset.enabled", applyFilter);
      $(".search-button").on("click", _onToggleGeocoder);

    },

    /**
     * Public
     */

    init = function(config) {

      this.config = $.extend(this.config, config);
      if (!this.mmenu) {
        this.mmenu = $("#menu").mmenu({
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
      }

      _registerEventListeners.call(this);

    };

    return {

      config: {},
      mmenu: null,
      init: init

    };
  }
);
