/* global define, mixpanel, navigator */

define(
  [

    "jquery",
    "controllers/map-controller",
    "services/map-services",
    "views/map-view",
    "views/menu-view",
    "modules/click",
    "modules/bootstrap-modal",
    "modules/d3-cluster-icon"

  ], function(

    $,
    mapCtrl,
    mapServices,
    mapView,
    menuView,
    click,
    modal,
    clusterIcon

  ) {

    /**
     * Private
     */

    var _checkIndexOf = function() {

      // Force Array objects to provide the indexOf function (e.g., for IE7):
      if (!Array.indexOf) {
        Array.prototype.indexOf = function(item) {
          for (var i = 0; i < this.length; i++) {
            if (this[i] === item) {
              return i;
            }
          }
          return -1;
        };
      }

    },

    _checkForEach = function() {

      // Force Array objects to provide the forEach function (e.g., for IE7):
      if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (callback, thisArg) {
          var T, k;
          if (this === null) {
            throw new TypeError(" this is null or not defined");
          }
          var O = Object(this);
          var len = O.length >>> 0;
          if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
          }
          if (arguments.length > 1) {
            T = thisArg;
          }
          k = 0;
          while (k < len) {
            var kValue;
            if (k in O) {
              kValue = O[k];
              callback.call(T, kValue, k, O);
            }
            k++;
          }
        };
      }

    },

    _stringCapitalize = function() {

      String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
      };

      String.prototype.toTitleCase = function() {
        var str = this.toLowerCase().split(' ');
        for (var i = 0; i < str.length; i++) {
            // You do not need to check if i is larger than str length, as your for does that for you
            // Assign it back to the array
            str[i] = str[i].charAt(0).toUpperCase() + str[i].substring(1);
        }
        return str.join(' ');
      };

    },

    _getConfig = function(path) {

      var d = new $.Deferred();

      $.getJSON(path, function(data) {
        var config = data;
        d.resolve(config);
      });

      return d.promise();

    },

    _getApple = function() {

      var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
      return iOS;

    },

    // Check if browser is IE
    _getIE = function() {

      var ua = window.navigator.userAgent;
      return ~ua.indexOf('MSIE ') || ~ua.indexOf('Trident/');

    },

    /**
     * Public
     */

    init = function() {

      _checkIndexOf();
      _checkForEach();
      _stringCapitalize();
      // Initialize fastclick if device is not iOS
      if (!_getApple()) {
        click.init();
      }

      var isIE = _getIE();

      modal.init().then(function() {

        var configPath = "assets/scripts/config.json";
        _getConfig(configPath).then(function(config) {

          // load Map Services
          var layers = mapServices.loadServices(config);
          // if (isIE) config.IE = true;
          config.map.settings.layers = layers;

          // Initialize views/controllers
          mapCtrl.init(config);
          menuView.init(config);
          mapView.init(config);

        });

      });

    };

    return {

      init: init

    };
  }
);
