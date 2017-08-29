/* esri-leaflet-cluster - v2.0.0 - Thu Aug 18 2016 17:13:26 GMT-0700 (PDT)
 * Copyright (c) 2016 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('leaflet'), require('esri-leaflet')) :
	typeof define === 'function' && define.amd ? define(['exports', 'leaflet', 'esri-leaflet'], factory) :
	(factory((global.L = global.L || {}, global.L.esri = global.L.esri || {}, global.L.esri.Cluster = global.L.esri.Cluster || {}),global.L,global.L.esri));
}(this, function (exports,L,esriLeaflet) { 'use strict';

	L = 'default' in L ? L['default'] : L;

	var version = "2.0.0";

	var FeatureLayer = esriLeaflet.FeatureManager.extend({

	  statics: {
	    EVENTS: 'click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose',
	    CLUSTEREVENTS: 'clusterclick clusterdblclick clustermouseover clustermouseout clustermousemove clustercontextmenu'
	  },

	  /**
	   * Constructor
	   */

	  initialize: function (options) {
	    esriLeaflet.FeatureManager.prototype.initialize.call(this, options);

	    options = L.setOptions(this, options);

	    this._layers = {};
	    this._leafletIds = {};

	    this.cluster = L.markerClusterGroup(options);
	    this._key = 'c' + (Math.random() * 1e9).toString(36).replace('.', '_');

	    this.cluster.addEventParent(this);
	  },

	  /**
	   * Layer Interface
	   */

	  onAdd: function (map) {
	    esriLeaflet.FeatureManager.prototype.onAdd.call(this, map);
	    this._map.addLayer(this.cluster);
	  },

	  onRemove: function (map) {
	    esriLeaflet.FeatureManager.prototype.onRemove.call(this, map);
	    this._map.removeLayer(this.cluster);
	  },

	  /**
	   * Feature Management Methods
	   */

	  createLayers: function (features) {
	    var markers = [];

	    for (var i = features.length - 1; i >= 0; i--) {
	      var geojson = features[i];
	      var layer = this._layers[geojson.id];

	      if (!layer) {
	        var newLayer = L.GeoJSON.geometryToLayer(geojson, this.options);
	        newLayer.feature = L.GeoJSON.asFeature(geojson);
	        newLayer.defaultOptions = newLayer.options;
	        newLayer._leaflet_id = this._key + '_' + geojson.id;

	        this.resetStyle(newLayer.feature.id);

	        // cache the layer
	        this._layers[newLayer.feature.id] = newLayer;

	        this._leafletIds[newLayer._leaflet_id] = geojson.id;

	        if (this.options.onEachFeature) {
	          this.options.onEachFeature(newLayer.feature, newLayer);
	        }

	        this.fire('createfeature', {
	          feature: newLayer.feature
	        });

	        // add the layer if it is within the time bounds or our layer is not time enabled
	        if (!this.options.timeField || (this.options.timeField && this._featureWithinTimeRange(geojson))) {
	          markers.push(newLayer);
	        }
	      }
	    }

	    if (markers.length) {
	      this.cluster.addLayers(markers);
	    }
	  },

	  addLayers: function (ids) {
	    var layersToAdd = [];
	    for (var i = ids.length - 1; i >= 0; i--) {
	      var layer = this._layers[ids[i]];
	      this.fire('addfeature', {
	        feature: layer.feature
	      });
	      layersToAdd.push(layer);
	    }
	    this.cluster.addLayers(layersToAdd);
	  },

	  removeLayers: function (ids, permanent) {
	    var layersToRemove = [];
	    for (var i = ids.length - 1; i >= 0; i--) {
	      var id = ids[i];
	      var layer = this._layers[id];
	      this.fire('removefeature', {
	        feature: layer.feature,
	        permanent: permanent
	      });
	      layersToRemove.push(layer);
	      if (this._layers[id] && permanent) {
	        delete this._layers[id];
	      }
	    }
	    this.cluster.removeLayers(layersToRemove);
	  },

	  /**
	   * Styling Methods
	   */

	  resetStyle: function (id) {
	    var layer = this._layers[id];

	    if (layer) {
	      layer.options = layer.defaultOptions;
	      this.setFeatureStyle(layer.feature.id, this.options.style);
	    }

	    return this;
	  },

	  setStyle: function (style) {
	    this.eachFeature(function (layer) {
	      this.setFeatureStyle(layer.feature.id, style);
	    }, this);
	    return this;
	  },

	  setFeatureStyle: function (id, style) {
	    var layer = this._layers[id];

	    if (typeof style === 'function') {
	      style = style(layer.feature);
	    }
	    if (layer.setStyle) {
	      layer.setStyle(style);
	    }
	  },

	  /**
	   * Utility Methods
	   */

	  eachFeature: function (fn, context) {
	    for (var i in this._layers) {
	      fn.call(context, this._layers[i]);
	    }
	    return this;
	  },

	  getFeature: function (id) {
	    return this._layers[id];
	  }
	});

	function featureLayer (options) {
	  return new FeatureLayer(options);
	}

	exports.FeatureLayer = FeatureLayer;
	exports.featureLayer = featureLayer;
	exports['default'] = featureLayer;
	exports.VERSION = version;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNyaS1sZWFmbGV0LWNsdXN0ZXItZGVidWcuanMiLCJzb3VyY2VzIjpbIi4uL3BhY2thZ2UuanNvbiIsIi4uL3NyYy9DbHVzdGVyZWRGZWF0dXJlTGF5ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsie1xuICBcIm5hbWVcIjogXCJlc3JpLWxlYWZsZXQtY2x1c3RlclwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiRXNyaSBMZWFmbGV0IHBsdWdpbiBmb3IgdmlzdWFsaXppbmcgRmVhdHVyZSBMYXllcnMgYXMgY2x1c3RlcnMgd2l0aCBMLm1hcmtlcmNsdXN0ZXIuXCIsXG4gIFwidmVyc2lvblwiOiBcIjIuMC4wXCIsXG4gIFwiYXV0aG9yXCI6IFwiUGF0cmljayBBcmx0IDxwYXJsdEBlc3JpLmNvbT4gKGh0dHA6Ly9wYXRyaWNrYXJsdC5jb20pXCIsXG4gIFwiY29udHJpYnV0b3JzXCI6IFtcbiAgICBcIlBhdHJpY2sgQXJsdCA8cGFybHRAZXNyaS5jb20+IChodHRwOi8vcGF0cmlja2FybHQuY29tKVwiLFxuICAgIFwiSm9obiBHcmF2b2lzIDxqZ3Jhdm9pc0Blc3JpLmNvbT4gKGh0dHA6Ly9qb2huZ3Jhdm9pcy5jb20pXCJcbiAgXSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiZXNyaS1sZWFmbGV0XCI6IFwiXjIuMC4wXCIsXG4gICAgXCJsZWFmbGV0XCI6IFwiXjEuMC4wLXJjLjNcIixcbiAgICBcImxlYWZsZXQubWFya2VyY2x1c3RlclwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vTGVhZmxldC9MZWFmbGV0Lm1hcmtlcmNsdXN0ZXIuZ2l0I3YxLjAuMC1yYy4xXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiY2hhaVwiOiBcIjIuMy4wXCIsXG4gICAgXCJnaC1yZWxlYXNlXCI6IFwiXjIuMC4wXCIsXG4gICAgXCJodHRwLXNlcnZlclwiOiBcIl4wLjguNVwiLFxuICAgIFwiaXNwYXJ0YVwiOiBcIl4zLjAuM1wiLFxuICAgIFwiaXN0YW5idWxcIjogXCJeMC40LjJcIixcbiAgICBcImthcm1hXCI6IFwiXjAuMTIuMjRcIixcbiAgICBcImthcm1hLWNoYWktc2lub25cIjogXCJeMC4xLjNcIixcbiAgICBcImthcm1hLWNvdmVyYWdlXCI6IFwiXjAuNS4zXCIsXG4gICAgXCJrYXJtYS1tb2NoYVwiOiBcIl4wLjEuMFwiLFxuICAgIFwia2FybWEtbW9jaGEtcmVwb3J0ZXJcIjogXCJeMC4yLjVcIixcbiAgICBcImthcm1hLXBoYW50b21qcy1sYXVuY2hlclwiOiBcIl4wLjEuNFwiLFxuICAgIFwia2FybWEtc291cmNlbWFwLWxvYWRlclwiOiBcIl4wLjMuNVwiLFxuICAgIFwibWtkaXJwXCI6IFwiXjAuNS4xXCIsXG4gICAgXCJub2RlLXNhc3NcIjogXCJeMy4yLjBcIixcbiAgICBcInBoYW50b21qc1wiOiBcIl4xLjkuMTdcIixcbiAgICBcInJvbGx1cFwiOiBcIl4wLjI1LjRcIixcbiAgICBcInJvbGx1cC1wbHVnaW4tanNvblwiOiBcIl4yLjAuMFwiLFxuICAgIFwicm9sbHVwLXBsdWdpbi1ub2RlLXJlc29sdmVcIjogXCJeMS40LjBcIixcbiAgICBcInJvbGx1cC1wbHVnaW4tdWdsaWZ5XCI6IFwiXjAuMy4xXCIsXG4gICAgXCJzZW1pc3RhbmRhcmRcIjogXCJeNy4wLjRcIixcbiAgICBcInNpbm9uXCI6IFwiXjEuMTEuMVwiLFxuICAgIFwic2lub24tY2hhaVwiOiBcIjIuNy4wXCIsXG4gICAgXCJzbmF6enlcIjogXCJeMi4wLjFcIixcbiAgICBcIndhdGNoXCI6IFwiXjAuMTcuMVwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vRXNyaS9lc3JpLWxlYWZsZXQtY2x1c3RlclwiLFxuICBcImpzbmV4dDptYWluXCI6IFwic3JjL0NsdXN0ZXJlZEZlYXR1cmVMYXllci5qc1wiLFxuICBcImpzcG1cIjoge1xuICAgIFwicmVnaXN0cnlcIjogXCJucG1cIixcbiAgICBcImZvcm1hdFwiOiBcImVzNlwiLFxuICAgIFwibWFpblwiOiBcInNyYy9DbHVzdGVyZWRGZWF0dXJlTGF5ZXIuanNcIlxuICB9LFxuICBcImtleXdvcmRzXCI6IFtcbiAgICBcImFyY2dpc1wiLFxuICAgIFwiZXNyaVwiLFxuICAgIFwiZXNyaSBsZWFmbGV0XCIsXG4gICAgXCJnaXNcIixcbiAgICBcImxlYWZsZXQgcGx1Z2luXCIsXG4gICAgXCJtYXBwaW5nXCJcbiAgXSxcbiAgXCJsaWNlbnNlXCI6IFwiQXBhY2hlLTIuMFwiLFxuICBcIm1haW5cIjogXCJkaXN0L2VzcmktbGVhZmxldC1jbHVzdGVyLWRlYnVnLmpzXCIsXG4gIFwicmVhZG1lRmlsZW5hbWVcIjogXCJSRUFETUUubWRcIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vRXNyaS9lc3JpLWxlYWZsZXQtY2x1c3Rlci5naXRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwicHJlYnVpbGRcIjogXCJta2RpcnAgZGlzdFwiLFxuICAgIFwiYnVpbGRcIjogXCJyb2xsdXAgLWMgcHJvZmlsZXMvZGVidWcuanMgJiByb2xsdXAgLWMgcHJvZmlsZXMvcHJvZHVjdGlvbi5qc1wiLFxuICAgIFwibGludFwiOiBcInNlbWlzdGFuZGFyZCBzcmMvKi5qcyB8IHNuYXp6eVwiLFxuICAgIFwicHJlcHVibGlzaFwiOiBcIm5wbSBydW4gYnVpbGRcIixcbiAgICBcInByZXRlc3RcIjogXCJucG0gcnVuIGJ1aWxkXCIsXG4gICAgXCJyZWxlYXNlXCI6IFwiLi9zY3JpcHRzL3JlbGVhc2Uuc2hcIixcbiAgICBcInN0YXJ0XCI6IFwid2F0Y2ggJ25wbSBydW4gYnVpbGQnIHNyYyAmIGh0dHAtc2VydmVyIC1wIDU2NzggLWMtMSAtb1wiLFxuICAgIFwidGVzdFwiOiBcIm5wbSBydW4gbGludCAmJiBrYXJtYSBzdGFydFwiXG4gIH1cbn0iLCJleHBvcnQge3ZlcnNpb24gYXMgVkVSU0lPTn0gZnJvbSAnLi4vcGFja2FnZS5qc29uJztcblxuaW1wb3J0IEwgZnJvbSAnbGVhZmxldCc7XG5pbXBvcnQgeyBGZWF0dXJlTWFuYWdlciB9IGZyb20gJ2VzcmktbGVhZmxldCc7XG5cbmV4cG9ydCB2YXIgRmVhdHVyZUxheWVyID0gRmVhdHVyZU1hbmFnZXIuZXh0ZW5kKHtcblxuICBzdGF0aWNzOiB7XG4gICAgRVZFTlRTOiAnY2xpY2sgZGJsY2xpY2sgbW91c2VvdmVyIG1vdXNlb3V0IG1vdXNlbW92ZSBjb250ZXh0bWVudSBwb3B1cG9wZW4gcG9wdXBjbG9zZScsXG4gICAgQ0xVU1RFUkVWRU5UUzogJ2NsdXN0ZXJjbGljayBjbHVzdGVyZGJsY2xpY2sgY2x1c3Rlcm1vdXNlb3ZlciBjbHVzdGVybW91c2VvdXQgY2x1c3Rlcm1vdXNlbW92ZSBjbHVzdGVyY29udGV4dG1lbnUnXG4gIH0sXG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqL1xuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgRmVhdHVyZU1hbmFnZXIucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzLCBvcHRpb25zKTtcblxuICAgIG9wdGlvbnMgPSBMLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9sYXllcnMgPSB7fTtcbiAgICB0aGlzLl9sZWFmbGV0SWRzID0ge307XG5cbiAgICB0aGlzLmNsdXN0ZXIgPSBMLm1hcmtlckNsdXN0ZXJHcm91cChvcHRpb25zKTtcbiAgICB0aGlzLl9rZXkgPSAnYycgKyAoTWF0aC5yYW5kb20oKSAqIDFlOSkudG9TdHJpbmcoMzYpLnJlcGxhY2UoJy4nLCAnXycpO1xuXG4gICAgdGhpcy5jbHVzdGVyLmFkZEV2ZW50UGFyZW50KHRoaXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMYXllciBJbnRlcmZhY2VcbiAgICovXG5cbiAgb25BZGQ6IGZ1bmN0aW9uIChtYXApIHtcbiAgICBGZWF0dXJlTWFuYWdlci5wcm90b3R5cGUub25BZGQuY2FsbCh0aGlzLCBtYXApO1xuICAgIHRoaXMuX21hcC5hZGRMYXllcih0aGlzLmNsdXN0ZXIpO1xuICB9LFxuXG4gIG9uUmVtb3ZlOiBmdW5jdGlvbiAobWFwKSB7XG4gICAgRmVhdHVyZU1hbmFnZXIucHJvdG90eXBlLm9uUmVtb3ZlLmNhbGwodGhpcywgbWFwKTtcbiAgICB0aGlzLl9tYXAucmVtb3ZlTGF5ZXIodGhpcy5jbHVzdGVyKTtcbiAgfSxcblxuICAvKipcbiAgICogRmVhdHVyZSBNYW5hZ2VtZW50IE1ldGhvZHNcbiAgICovXG5cbiAgY3JlYXRlTGF5ZXJzOiBmdW5jdGlvbiAoZmVhdHVyZXMpIHtcbiAgICB2YXIgbWFya2VycyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IGZlYXR1cmVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgZ2VvanNvbiA9IGZlYXR1cmVzW2ldO1xuICAgICAgdmFyIGxheWVyID0gdGhpcy5fbGF5ZXJzW2dlb2pzb24uaWRdO1xuXG4gICAgICBpZiAoIWxheWVyKSB7XG4gICAgICAgIHZhciBuZXdMYXllciA9IEwuR2VvSlNPTi5nZW9tZXRyeVRvTGF5ZXIoZ2VvanNvbiwgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgbmV3TGF5ZXIuZmVhdHVyZSA9IEwuR2VvSlNPTi5hc0ZlYXR1cmUoZ2VvanNvbik7XG4gICAgICAgIG5ld0xheWVyLmRlZmF1bHRPcHRpb25zID0gbmV3TGF5ZXIub3B0aW9ucztcbiAgICAgICAgbmV3TGF5ZXIuX2xlYWZsZXRfaWQgPSB0aGlzLl9rZXkgKyAnXycgKyBnZW9qc29uLmlkO1xuXG4gICAgICAgIHRoaXMucmVzZXRTdHlsZShuZXdMYXllci5mZWF0dXJlLmlkKTtcblxuICAgICAgICAvLyBjYWNoZSB0aGUgbGF5ZXJcbiAgICAgICAgdGhpcy5fbGF5ZXJzW25ld0xheWVyLmZlYXR1cmUuaWRdID0gbmV3TGF5ZXI7XG5cbiAgICAgICAgdGhpcy5fbGVhZmxldElkc1tuZXdMYXllci5fbGVhZmxldF9pZF0gPSBnZW9qc29uLmlkO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMub25FYWNoRmVhdHVyZSkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5vbkVhY2hGZWF0dXJlKG5ld0xheWVyLmZlYXR1cmUsIG5ld0xheWVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmlyZSgnY3JlYXRlZmVhdHVyZScsIHtcbiAgICAgICAgICBmZWF0dXJlOiBuZXdMYXllci5mZWF0dXJlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGFkZCB0aGUgbGF5ZXIgaWYgaXQgaXMgd2l0aGluIHRoZSB0aW1lIGJvdW5kcyBvciBvdXIgbGF5ZXIgaXMgbm90IHRpbWUgZW5hYmxlZFxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy50aW1lRmllbGQgfHwgKHRoaXMub3B0aW9ucy50aW1lRmllbGQgJiYgdGhpcy5fZmVhdHVyZVdpdGhpblRpbWVSYW5nZShnZW9qc29uKSkpIHtcbiAgICAgICAgICBtYXJrZXJzLnB1c2gobmV3TGF5ZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1hcmtlcnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmNsdXN0ZXIuYWRkTGF5ZXJzKG1hcmtlcnMpO1xuICAgIH1cbiAgfSxcblxuICBhZGRMYXllcnM6IGZ1bmN0aW9uIChpZHMpIHtcbiAgICB2YXIgbGF5ZXJzVG9BZGQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gaWRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgbGF5ZXIgPSB0aGlzLl9sYXllcnNbaWRzW2ldXTtcbiAgICAgIHRoaXMuZmlyZSgnYWRkZmVhdHVyZScsIHtcbiAgICAgICAgZmVhdHVyZTogbGF5ZXIuZmVhdHVyZVxuICAgICAgfSk7XG4gICAgICBsYXllcnNUb0FkZC5wdXNoKGxheWVyKTtcbiAgICB9XG4gICAgdGhpcy5jbHVzdGVyLmFkZExheWVycyhsYXllcnNUb0FkZCk7XG4gIH0sXG5cbiAgcmVtb3ZlTGF5ZXJzOiBmdW5jdGlvbiAoaWRzLCBwZXJtYW5lbnQpIHtcbiAgICB2YXIgbGF5ZXJzVG9SZW1vdmUgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gaWRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgaWQgPSBpZHNbaV07XG4gICAgICB2YXIgbGF5ZXIgPSB0aGlzLl9sYXllcnNbaWRdO1xuICAgICAgdGhpcy5maXJlKCdyZW1vdmVmZWF0dXJlJywge1xuICAgICAgICBmZWF0dXJlOiBsYXllci5mZWF0dXJlLFxuICAgICAgICBwZXJtYW5lbnQ6IHBlcm1hbmVudFxuICAgICAgfSk7XG4gICAgICBsYXllcnNUb1JlbW92ZS5wdXNoKGxheWVyKTtcbiAgICAgIGlmICh0aGlzLl9sYXllcnNbaWRdICYmIHBlcm1hbmVudCkge1xuICAgICAgICBkZWxldGUgdGhpcy5fbGF5ZXJzW2lkXTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jbHVzdGVyLnJlbW92ZUxheWVycyhsYXllcnNUb1JlbW92ZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0eWxpbmcgTWV0aG9kc1xuICAgKi9cblxuICByZXNldFN0eWxlOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgbGF5ZXIgPSB0aGlzLl9sYXllcnNbaWRdO1xuXG4gICAgaWYgKGxheWVyKSB7XG4gICAgICBsYXllci5vcHRpb25zID0gbGF5ZXIuZGVmYXVsdE9wdGlvbnM7XG4gICAgICB0aGlzLnNldEZlYXR1cmVTdHlsZShsYXllci5mZWF0dXJlLmlkLCB0aGlzLm9wdGlvbnMuc3R5bGUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHNldFN0eWxlOiBmdW5jdGlvbiAoc3R5bGUpIHtcbiAgICB0aGlzLmVhY2hGZWF0dXJlKGZ1bmN0aW9uIChsYXllcikge1xuICAgICAgdGhpcy5zZXRGZWF0dXJlU3R5bGUobGF5ZXIuZmVhdHVyZS5pZCwgc3R5bGUpO1xuICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHNldEZlYXR1cmVTdHlsZTogZnVuY3Rpb24gKGlkLCBzdHlsZSkge1xuICAgIHZhciBsYXllciA9IHRoaXMuX2xheWVyc1tpZF07XG5cbiAgICBpZiAodHlwZW9mIHN0eWxlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBzdHlsZSA9IHN0eWxlKGxheWVyLmZlYXR1cmUpO1xuICAgIH1cbiAgICBpZiAobGF5ZXIuc2V0U3R5bGUpIHtcbiAgICAgIGxheWVyLnNldFN0eWxlKHN0eWxlKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFV0aWxpdHkgTWV0aG9kc1xuICAgKi9cblxuICBlYWNoRmVhdHVyZTogZnVuY3Rpb24gKGZuLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSBpbiB0aGlzLl9sYXllcnMpIHtcbiAgICAgIGZuLmNhbGwoY29udGV4dCwgdGhpcy5fbGF5ZXJzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgZ2V0RmVhdHVyZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xheWVyc1tpZF07XG4gIH1cbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gZmVhdHVyZUxheWVyIChvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgRmVhdHVyZUxheWVyKG9wdGlvbnMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmZWF0dXJlTGF5ZXI7XG4iXSwibmFtZXMiOlsiRmVhdHVyZU1hbmFnZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Q0NLTyxJQUFJLFlBQVksR0FBR0EsMEJBQWMsQ0FBQyxNQUFNLENBQUM7O0FBRWhELENBQUEsRUFBRSxPQUFPLEVBQUU7QUFDWCxDQUFBLElBQUksTUFBTSxFQUFFLDhFQUE4RTtBQUMxRixDQUFBLElBQUksYUFBYSxFQUFFLG1HQUFtRztBQUN0SCxDQUFBLEdBQUc7O0FBRUgsQ0FBQTtBQUNBLENBQUE7QUFDQSxDQUFBOztBQUVBLENBQUEsRUFBRSxVQUFV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