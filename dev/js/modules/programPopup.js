define([
  "config", "jquery", "leaflet"
], function (
  config, $, L
) {

  // Sorts an array of objects with an 'order' property.
  function orderSort(array)
  {
    array.sort(function(a, b){
      return a.order - b.order;
    });
  }

  // Return a list of strings indicating the type(s) assigned to a program...
  function getProgramTypesLabels(props)
  {
    var labels = [], programTypes = [];
    $.each(config.program_types.yes_no_fields, function(fieldname, programType){
      programTypes.push($.extend({fieldname:fieldname}, programType));
    });
    orderSort(programTypes);

    $.each(programTypes, function(i, programType) {
      var prop = props[programType.fieldname];
      if (prop && prop.toLowerCase()=="yes") {
        labels.push(programType.label);
      }
    });

    return labels;
  }

  // Return a list of strings representing target groups for a given program...
  function getTargetGroupsLabels(props)
  {
    var labels = [], targetEveryone = true, targetGroups = [];
    $.each(config.target_groups.yes_no_na_fields, function(fieldname, targetGroup){
      targetGroups.push($.extend({fieldname:fieldname}, targetGroup));
    });
    orderSort(targetGroups);

    $.each(targetGroups, function(i, targetGroup) {
      var prop = props[targetGroup.fieldname], label = false;
      if (prop) {
        if (prop.toLowerCase()=="yes") {
          label = targetGroup.label;
        }
        targetEveryone = targetEveryone && arrayContainsLCString(["na","n/a","yes"], prop.toLowerCase());
      }
      if (label && targetGroup.fieldname == "tg_other" && props[config.target_groups.explain_other_field])
      {
        label = label + " <em>(" + props[config.target_groups.explain_other_field] + ")</em>";
      }
      if (label)
      {
        labels.push(label);
      }
    });

    // If all target groups in the properties that match config have a value of
    // Yes or NA, then the target group is defaulted to 'Everyone'...
    if (targetEveryone) return [config.target_groups.everyone_label];
    return labels;
  }

  // Returns a label with Yes, or No/Unkown + any value for 'why_not' in
  // italicized brackets...
  function getContinuingLabel(props)
  {
    var continuing = props.continuing;
    if (continuing && arrayContainsLCString(["no","unknown"], continuing) && props.why_not)
    {
      continuing = continuing + " <em>(" + props.why_not + ")</em>";
    }
    return continuing;
  }

  // Saves me having to repeat toLowerCase() and indexOf() methods all over the place...
  function arrayContainsLCString(array, string) {
    if (string) return array.indexOf(string.toLowerCase())!=-1;
    return false;
  }

  function bindPopup(marker) {

    var naStrings = ["na","n/a"],
      body = [],
      moreInfo = [],
      props = marker.options.feature.properties;

    var ptLabels = getProgramTypesLabels(props),
      tgLabels = getTargetGroupsLabels(props),
      continuingLabel = getContinuingLabel(props),
      community = props.community,
      contact_name = props.contact_name,
      contact_email = props.contact_email,
      contact_tel = props.contact_tel,
      contact_website = props.contact_website,
      contact_org = props.contact_org,
      program = props.program,
      host = props.host,
      location = props.location,
      description = props.description,
      time_frame = props.time_frame,
      season = props.season,
      cost = props.cost,
      volunteer_run = props.volunteer_run,
      duration = props.duration,
      funding = props.funding,
      partners = props.partners,
      success_factors = props.success_factors;


    body.push('<h2 class="popup-title">' + program + '</h2>');
    body.push('<div class="popup-body">');

    if (host && !arrayContainsLCString(naStrings, host))
      body.push('<p><i class="fa fa-user fa-fw"></i>' + host + '</p>');

    if (community && !arrayContainsLCString(naStrings, community))
      body.push("<p><i class='fa fa-home fa-fw'></i>" + community + '</p>');

    if (ptLabels.length > 0)
    {
      // Append a UL elemment with an LI for each program type (an 'extra-hint'
      // LI that contains a link to the full modal popup, and 'extra-item' LI
      // elements that are hidden in the in-map popup are added if there are
      // over three items)
      if (ptLabels.length <= 3)
      {
        body.push('<p><i class="fa fa-list fa-fw"></i><b>' + (ptLabels.length > 1 ? config.labels.programtypes : config.labels.programtype) + ":</b></p><ul><li>" + ptLabels.join("</li><li>") + '</li></ul>');
      } else {
        body.push('<p><i class="fa fa-list fa-fw"></i><b>' + (ptLabels.length > 1 ? config.labels.programtypes : config.labels.programtype) + ":</b></p><ul><li>" + ptLabels.slice(0,2).join("</li><li>") + '</li><li class="extra-hint"><a class="popup-info"> '+L.Util.template(config.labels.morelink,{n:(ptLabels.length-2)})+'</a></li><li class="extra-item">'+ ptLabels.slice(2).join('</li><li class="extra-item">')+'</li></ul>');
      }
    }

    if (tgLabels.length > 0)
    {
      // Append a UL elemment with an LI for each target group (an 'extra-hint'
      // LI that contains a link to the full modal popup, and 'extra-item' LI
      // elements that are hidden in the in-map popup are added if there are
      // over three items)
      if (tgLabels.length <= 3)
      {
        body.push('<p><i class="fa fa-users fa-fw"></i><b>' + (tgLabels.length > 1 ? config.labels.targetgroups : config.labels.targetgroups) + ":</b></p><ul><li>" + tgLabels.join("</li><li>") + '</li></ul>');
      } else {
        body.push('<p><i class="fa fa-users fa-fw"></i><b>' + (tgLabels.length > 1 ? config.labels.targetgroups : config.labels.targetgroups) + ":</b></p><ul><li>" + tgLabels.slice(0,2).join("</li><li>") + '</li><li class="extra-hint"><a class="popup-info"> '+L.Util.template(config.labels.morelink,{n:(tgLabels.length-2)})+'</a></li><li class="extra-item">'+ tgLabels.slice(2).join('</li><li class="extra-item">')+'</li></ul>');
      }
    }

    if (season && !arrayContainsLCString(naStrings, season))
      body.push('<p><i class="fa fa-calendar fa-fw"></i>' + season + '</p>');

    if (time_frame && !arrayContainsLCString(naStrings, time_frame))
      body.push('<p><i class="fa fa-clock-o fa-fw"></i>' + time_frame + '</p>');

    // Add the description to the
    if (description && !arrayContainsLCString(naStrings, description))
      body.push('<p class="description">' + description + '</p>');

    // Setup 'more info'...
    if (continuingLabel && !arrayContainsLCString(naStrings, continuingLabel))
      moreInfo.push("<p><b>" + config.display_fields.continuing + ":</b> " + continuingLabel + "</p>");

    if (duration && !arrayContainsLCString(naStrings, duration))
      moreInfo.push("<p><b>" + config.display_fields.duration + ":</b> " + duration + "</p>");

    if (funding && !arrayContainsLCString(naStrings, funding))
      moreInfo.push("<p><b>" + config.display_fields.funding + ":</b> " + funding + "</p>");

    if (partners && !arrayContainsLCString(naStrings, partners))
      moreInfo.push("<p><b>" + config.display_fields.partners + ":</b> " + partners + "</p>");

    if (success_factors && !arrayContainsLCString(naStrings, success_factors))
      moreInfo.push("<p><b>" + config.display_fields.success_factors + ":</b> " + success_factors + "</p>");

    var contactInfo = [];

    if (contact_name && !arrayContainsLCString(naStrings, contact_name))
    {
      contactInfo.push("<p><b>" + contact_name + "</b>");

      if (contact_org && !arrayContainsLCString(naStrings, contact_org))
        contactInfo.push(", <em>" + contact_org + "</em></p>");
    }
    else {
      if (contact_org && !arrayContainsLCString(naStrings, contact_org))
        contactInfo.push("<p><em>" + contact_org + "</em></p>");
    }

    if (location && !arrayContainsLCString(naStrings, location))
      contactInfo.push('<p><i class="fa fa-location-arrow fa-fw"></i>' + location + "</p>");

    if (contact_tel && !arrayContainsLCString(naStrings, contact_tel))
      contactInfo.push('<p><i class="fa fa-phone fa-fw"></i>' + contact_tel + "</p>");

    if (contact_email && !arrayContainsLCString(naStrings, contact_email))
      contactInfo.push('<p><i class="fa fa-envelope fa-fw"></i><a href="mailto:' + contact_email + '">' + contact_email.split(";")[0] + "</a></p>");

    if (contact_website && !arrayContainsLCString(naStrings, contact_website))
      contactInfo.push('<p><i class="fa fa-globe fa-fw"></i><a target="_blank" href="' + contact_website + '">' + contact_website + "</a></p>");

    if (contactInfo.length > 0)
      moreInfo.push('<h3 class="contact-details">'+config.labels.contactdetails+'</h3>');
      moreInfo = moreInfo.concat(contactInfo);

    if (moreInfo.length > 0)
    {
      // Merge all details into the moreInfo array, and add an
      // 'additional details' header if there is more than the just
      // contact info included...
      moreInfo = body.slice(2).concat((moreInfo.length > (contactInfo.length+1) ? ['<h3 class="program-details">'+config.labels.additionaldetails+' </h3>'] : []).concat(moreInfo));
      body.push('<p class="popup-info"><a class="popup-info">'+config.labels.moreinfo+'</a></p>');
    }

    body.push("</div>");

    $("#program-modal .modal-title").html(program);
    $("#program-modal .modal-body").html("<div>"+moreInfo.join("")+"</div>");

    return body.join("");
  }

  var currentPopupMarker = false;
  function programPopupOpened(marker)
  {
    currentPopupMarker = marker;
    centreOnPopup();
  }

  function programPopupClosed(marker)
  {
    currentPopupMarker = false;
  }

  function centreOnPopup(map)
  {
    if (!currentPopupMarker) return;

    map = map || currentPopupMarker.popup._map;

    if (!map) return;

    var px = map.project(currentPopupMarker.popup._latlng); // Find the pixel location on the this.map where the popup anchor is
    px.y -= currentPopupMarker.popup.getElement().clientHeight / 2; // Find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    map.panTo(map.unproject(px), {
      animate: true
    });
  }

  function showMorePopupInfo(e)
  {
    //$(e.target).addClass('no-display')
    //  .parent().find('.more-info').removeClass('no-display');
    //centreOnPopup(e.data ? e.data.map : false);
    $('#program-modal').modal('show');
  }

  return {
    bindPopup: bindPopup,
    programPopupOpened: programPopupOpened,
    programPopupClosed: programPopupClosed,
    showMorePopupInfo: showMorePopupInfo
  }
});
