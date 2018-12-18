define([
  document.location.href.replace(/[^\/]*$/, '') + "config.js",
  "jquery",
  "leaflet"
], function (
  config,
  $,
  L
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
        targetEveryone = (
          config.target_groups.everyone_label &&
          targetEveryone &&
          arrayContainsLCString(["na","n/a","yes"], prop.toLowerCase())
        );
      }
      if (label && targetGroup.fieldname == config.target_groups.other_field && props[config.target_groups.explain_other_field])
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

  // Saves me having to repeat toLowerCase() and indexOf() methods all over the place...
  function arrayContainsLCString(array, string) {
    if (string) return array.indexOf(string.toString().toLowerCase())!=-1;
    return false;
  }

  function bindPopup(marker) {

    var naStrings = ["na","n/a"],
      body = [],
      moreInfo = [],
      props = marker.options.feature.properties;

    var ptLabels = getProgramTypesLabels(props),
      tgLabels = getTargetGroupsLabels(props);

    body.push('<h2 class="popup-title">' + props[config.popup.title_field] + '</h2>');
    body.push('<div class="popup-body">');

    $.each(config.popup.parts, function(i, part){
      var htmlPart = false;
      if (part.fieldname) // If it's just a fieldname, then construct the part
      {
        if (!part.depends_on_field || (
          // if the field depends on another field, then check that the other
          // field has a valid value:
          props[part.depends_on_field] &&
          !arrayContainsLCString(naStrings, props[part.depends_on_field])
        )) {
          var value = props[part.fieldname];
          if (value && !arrayContainsLCString(naStrings, value))
          {

            htmlPart = "<p" + (
              part.class_name ? ' class="'+part.class_name + '"' : ''
            ) + '>';

            if (part.icon) htmlPart += '<i class="' + part.icon + '"></i> ';

            if (part.label) htmlPart += '<b>' + part.label + ':</b> ';

            htmlPart += value;

            htmlPart += "</p>";

            if (part.add_separator) htmlPart += '<hr />';
          }
        }
      }

      // If the part is meant to display the list of program types (or equvialent):
      else if (part.program_types && ptLabels.length > 0) {
        // Append a UL elemment with an LI for each program type (an 'extra-hint'
        // LI that contains a link to the full modal popup, and 'extra-item' LI
        // elements that are hidden in the in-map popup are added if there are
        // over three items)
        if (ptLabels.length <= 3)
        {
          htmlPart = '<p><i class="fa fa-list fa-fw"></i> <b>' +
            (ptLabels.length > 1 ? config.labels.programtypes : config.labels.programtype) +
            ":</b></p><ul><li>" + ptLabels.join("</li><li>") +
            '</li></ul>';
        } else {
          htmlPart = '<p><i class="fa fa-list fa-fw"></i> <b>' +
            (ptLabels.length > 1 ? config.labels.programtypes : config.labels.programtype) +
            ":</b></p><ul><li>" + ptLabels.slice(0,2).join("</li><li>") +
            '</li><li class="extra-hint"><a class="popup-info"> ' +
            L.Util.template(config.labels.morelink,{n:(ptLabels.length-2)}) +
            '</a></li><li class="extra-item">'+
            ptLabels.slice(2).join('</li><li class="extra-item">') +
            '</li></ul>';
        }
      }

      // If the part is meant to display the target groups (or equivalent):
      else if (part.target_groups && tgLabels.length > 0)
      {
        // Append a UL elemment with an LI for each target group (an 'extra-hint'
        // LI that contains a link to the full modal popup, and 'extra-item' LI
        // elements that are hidden in the in-map popup are added if there are
        // over three items)
        if (tgLabels.length <= 3)
        {
          htmlPart = '<p><i class="fa fa-users fa-fw"></i> <b>' +
            (tgLabels.length > 1 ? config.labels.targetgroups : config.labels.targetgroups) +
            ":</b></p><ul><li>" + tgLabels.join("</li><li>") + '</li></ul>';
        } else {
          htmlPart = '<p><i class="fa fa-users fa-fw"></i> <b>' +
            (tgLabels.length > 1 ? config.labels.targetgroups : config.labels.targetgroups) +
            ":</b></p><ul><li>" + tgLabels.slice(0,2).join("</li><li>") +
            '</li><li class="extra-hint"><a class="popup-info"> ' +
            L.Util.template(config.labels.morelink,{n:(tgLabels.length-2)}) +
            '</a></li><li class="extra-item">' +
            tgLabels.slice(2).join('</li><li class="extra-item">') +
            '</li></ul>';
        }
      }

      // if the HTML part is not false/blank, push it into either the body, or
      // the more_info array, as indicated in the part config:
      if (htmlPart) {
        if (!part.more_info) body.push(htmlPart);
        else moreInfo.push(htmlPart);
      }
    });

    var contactInfo = [];

    var contact_name = props[config.popup.contact_info.contact_name_field];
    var contact_org = props[config.popup.contact_info.contact_org_field];
    var contact_tel = props[config.popup.contact_info.contact_tel_field];
    var contact_email = props[config.popup.contact_info.contact_email_field];
    var contact_website = props[config.popup.contact_info.contact_website_field];

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
      moreInfo = body.slice(2).concat(
        (
          moreInfo.length > (contactInfo.length+1) ?
          ['<h3 class="program-details">'+config.labels.additionaldetails+' </h3>'] :
          []
        ).concat(
          moreInfo
        ));
      body.push('<p class="popup-info"><a class="popup-info">'+config.labels.moreinfo+'</a></p>');
    }

    // Add the closing tag for the popup content:
    body.push("</div>");

    // Update the modal dialog - this is what is displayed if someone clicks
    // one of the links in the popup to show more detail:
    $("#program-modal .modal-title").html(props[config.popup.title_field]);
    $("#program-modal .modal-body").html("<div>"+moreInfo.join("")+"</div>");

    // Return the body HTML elements concatenated into a single string:
    return body.join("");
  }

  var currentPopupMarker = false;
  function popupOpened(marker)
  {
    currentPopupMarker = marker;
    centreOnPopup();
  }

  function popupClosed(marker)
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
    popupOpened: popupOpened,
    popupClosed: popupClosed,
    showMorePopupInfo: showMorePopupInfo
  }
});
