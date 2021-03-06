define([
  document.location.href.replace(/[^\/]*$/, '') + "config.js",
  "jquery",
  "leaflet"
], function (
  config,
  $,
  L
) {
  var filterTemplate =
'<li><span class="label"></span>\
  <label class="switch">\
    <input type="checkbox" class="program-filter">\
      <span class="slider round">\
    </span>\
  </label>\
</li>';

  var _programMarkers, _programsLayer, _programsMap;

  function orderSort(array)
  {
    array.sort(function(a, b){
      return a.order - b.order;
    });
  }

  function loadFilters(dataLayerInfo, programMarkers, programsLayer, map, terr)
  {
    _programMarkers = programMarkers;
    _programsLayer = programsLayer;
    _programsMap = map;

    programTypeFilters = [];
    programTypes = [];
    targetGroupFilters = [];
    targetGroups = [];
    communityFilters = [];
    communities = [];
    configuredFilters = {};
    _lowercaseCommunities = [];

    // Get the program types from the config - this will be a series of yes/no fields:
    $.each(dataLayerInfo.fields, function(i,field){
      if (!!config.program_types.yes_no_fields[field.name])
      {
        programTypes.push($.extend({fieldname: field.name}, config.program_types.yes_no_fields[field.name]));
      }

      if (!!config.target_groups.yes_no_na_fields[field.name])
      {
        targetGroups.push($.extend({fieldname: field.name}, config.target_groups.yes_no_na_fields[field.name]));
      }
    });

    // Load properties for any additional configured filters...
    $.each(config.filters, function(id, opts){
      var filter = configuredFilters[id] = opts;
      filter.values = [];
      filter.loaded_values = {};
    });

    $.each(programMarkers, function(i, marker){
      // For each of the configured filters, check for new values that should be added:
      $.each(configuredFilters, function(filter_id, filter){
        var value = marker.options.feature.properties[filter.field];

        if (!value || value.toString().trim()==="") return;  // Ignore undefined/empty strings.

        var lc_value = value.toString().toLowerCase();

        if (filter.loaded_values[lc_value]) return;  // Ignore values that have already been added.

        filter.values.push(value.toString());
        filter.loaded_values[lc_value] = true;
      });

      var community = marker.options.feature.properties[config.communities.name_field];
      if (!community || community.toLowerCase() == "na") return;
      if (_lowercaseCommunities.indexOf(community.toLowerCase()) != -1) return;
      _lowercaseCommunities.push(community.toLowerCase());
      communities.push(community);
    });

    orderSort(programTypes);
    orderSort(targetGroups);
    communities.sort();

    var ptFilters = $('ul.pt-filters');
    $('li', ptFilters).remove();
    ptFilters.append('<li><a class="label reset">Reset</a></li>');
    $.each(programTypes, function(i,programType) {
      var li = $(filterTemplate);
      $('input', li).data('programType',programType);
      $('.slider', li).css({'background-color': programType.colour || "inherit"});
      $('.label', li).html(programType.label);
      ptFilters.append(li);
    });

    var tgFilters = $('ul.tg-filters');
    $('li', tgFilters).remove();
    tgFilters.append('<li><a class="label reset">Reset</a></li>');
    $.each(targetGroups, function(i,targetGroup) {
      var li = $(filterTemplate);
      $('input', li).data('targetGroup',targetGroup);
      $('.label', li).html(targetGroup.label);
      tgFilters.append(li);
    });

    var comFilters = $('ul.com-filters');
    $('li', comFilters).remove();
    comFilters.append('<li><a class="label reset">Reset</a></li>');
    $.each(communities, function(i,community) {
      var li = $(filterTemplate);
      $('input', li).data('community', community);
      $('.label', li).html(community);
      comFilters.append(li);
    });

    // Acquire values for any additional configured filters
    $.each(configuredFilters, function(filter_id, filter){
      var filterList = $('ul.filter-'+filter_id);
      var customFilter = $('ul.filter-'+filter_id);
      $('li', customFilter).remove();
      customFilter.append('<li><a class="label reset">Reset</a></li>');

      $.each(filter.values, function(i,value) {
        var li = $(filterTemplate);
        $('input', li).data('filter_'+filter_id, value);
        $('.label', li).html(value);
        customFilter.append(li);
      });

    });
  }

  function filterMarkers(e)
  {
    if (e && !$(e.target).hasClass("program-filter")) return;

    var selectedProgramTypes = {};
    var selectedTargetGroups = {};
    var selectedCommunities = {};

    var ptFilters = $('ul.pt-filters input');
    var ptSelected = ptFilters.filter(':checked');
    var tgFilters = $('ul.tg-filters input');
    var tgSelected = tgFilters.filter(':checked');
    var comFilters = $('ul.com-filters input');
    var comSelected = comFilters.filter(':checked');

    var filteredMarkers = _programMarkers;

    // If none/all types are selected do nothing, otherwise filter to only
    // markers for features that match the selected program types...
    if (ptSelected.length > 0 && ptSelected.length < ptFilters.length)
    {
      ptSelected.each(function(){
        selectedProgramTypes[$(this).data().programType.fieldname] = true;
      });
      filteredMarkers = $.grep(filteredMarkers, function(marker){
        for (programTypeField in selectedProgramTypes) {
          var prop = marker.options.feature.properties[programTypeField];
          if (prop && prop.toLowerCase()=="yes") return true;
        }
      });
    }

    if (ptSelected.length > 0) $('ul.pt-filters .reset').addClass('enabled');
    else $('ul.pt-filters .reset').removeClass('enabled');

    // If none/all groups are selected do nothing, otherwise filter to only
    // markers for features that match the selected target groups...
    if (tgSelected.length > 0 && tgSelected.length < tgFilters.length)
    {
      tgSelected.each(function(){
        selectedTargetGroups[$(this).data().targetGroup.fieldname] = true;
      });
      filteredMarkers = $.grep(filteredMarkers, function(marker){
        for (targetGroupField in selectedTargetGroups) {
          var prop = marker.options.feature.properties[targetGroupField];
          if (prop && prop.toLowerCase()=="yes") return true;
        }
      });
    }

    if (tgSelected.length > 0) $('ul.tg-filters .reset').addClass('enabled');
    else $('ul.tg-filters .reset').removeClass('enabled');

    // If none/all communities are selected do nothing, otherwise filter to only
    // markers for features that match the selected community names...
    if (comSelected.length > 0 && comSelected.length < comFilters.length)
    {
      comSelected.each(function(){
        selectedCommunities[$(this).data().community.toLowerCase()] = true;
      });
      filteredMarkers = $.grep(filteredMarkers, function(marker){
        var prop = marker.options.feature.properties[config.communities.name_field];
        if (prop && selectedCommunities[prop.toLowerCase()]) return true;
      });
    }

    if (comSelected.length > 0) $('ul.com-filters .reset').addClass('enabled');
    else $('ul.com-filters .reset').removeClass('enabled');

    $.each(configuredFilters, function(filter_id, filter){
      var filterItems = $('ul.filter-'+filter_id+' input');
      var itemsSelected = filterItems.filter(':checked');
      var valuesSelected = {};

      if (itemsSelected.length > 0 && itemsSelected.length < filterItems.length)
      {
        itemsSelected.each(function(){
          valuesSelected[$(this).data()['filter_'+filter_id].toLowerCase()] = true;
        });
        filteredMarkers = $.grep(filteredMarkers, function(marker){
          var prop = marker.options.feature.properties[filter.field];
          if (prop && valuesSelected[prop.toString().toLowerCase()]) return true;
        });
      }

      if (itemsSelected.length > 0) $('ul.filter-'+filter_id+' .reset').addClass('enabled');
      else $('ul.filter-'+filter_id+' .reset').removeClass('enabled');
    });

    _programsLayer.clearLayers();
    _programsLayer.addLayers(filteredMarkers);
    if (e && $(e.target).closest('ul').hasClass('com-filters'))
    {
      _programsMap.fitBounds(_programsLayer.getBounds(), {maxZoom: 14});
    }

    $('#menu').css("opacity",0.4).delay(300).fadeTo(300,1.0);
  }

  $('#menu').on('change', '.program-filter', filterMarkers);
  $('#menu').on('click', '.filter-menu .reset.enabled', function(e){
    $(e.target).closest('.filter-menu').find('.program-filter').prop('checked',false);
    filterMarkers();
  });

  return {loadFilters: loadFilters, getFilteredMarkers: function(){
    return _programsLayer.getLayers();
  }};
});
