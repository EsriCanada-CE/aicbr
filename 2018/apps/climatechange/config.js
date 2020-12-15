define({
  "territories": {
    "yt": {
      "layer":  "https://services7.arcgis.com/t4Xe6vv54aJMJbpj/arcgis/rest/services/yt_cilimatechange_inventory_2018_public/FeatureServer/0",
      "label": "Yukon Climate Change Inventory",
      "name": "Yukon"
    }
  },
  "communities": {
    "name_field": "community"
  },
  "program_types": {
    "menu_icon": "fas fa-list",
    "yes_no_fields": {
      "type_mitigation": {"label": "Mitigation", "colour": "#d5341c", "order": 4},
      "type_monitoring": {"label": "Monitoring", "colour": "#008d3c", "order": 5},
      "type_adaptation": {"label": "Adaptation", "colour": "#106ab6", "order": 6}
    },
    "display": {
      "field": "type_initiative",
      "default_type": "Other",
      "types": {
        "Mitigation": {
          "markerColor": "orange-dark", /* "#d5341c", closer to red than orange (the ExtraMarkers default red is too dark) */
          "text": {"classname": "mitigation-text", "colour": "#d5341c", "colourname": "red"},
          "pie": { "filling": "#d5341c", "crust": "#a52816" },
          "iconColor": "white",
          "icon": "fa-shield-alt",
          "shape": "circle",
          "prefix": "fa"
        },
        "Monitoring": {
          "markerColor": "green", /* "#008d3c" */
          "text": {"classname": "monitoring-text", "colour": "#008d3c", "colourname": "green"},
          "pie": { "filling": "#008d3c", "crust": "#00632a" },
          "iconColor": "white",
          "icon": "fa-chart-bar",
          "shape": "circle",
          "prefix": "fa"
        },
        "Adaptation": {
          "markerColor": "blue", /* "#106ab6" */
          "text": {"classname": "adaptation-text", "colour": "#106ab6", "colourname": "blue"},
          "pie": { "filling": "#106ab6", "crust": "#0c4e86" },
          "iconColor": "white",
          "icon": "fa-puzzle-piece",
          "shape": "circle",
          "prefix": "fa"
        },
        "Other": {
          "markerColor": "white",
          "text": {"classname": "other-text", "colour": "#aeaeae", "colourname": "grey"},
          "pie": { "filling": "#aeaeae", "crust": "#9e9e9e" },
          "iconColor": "#aeaeae",
          "icon": "fa-circle",
          "shape": "circle",
          "prefix": "fa"
        }
      }
    }
  },
  "target_groups": {
    "menu_icon": "fas fa-sitemap",
    "yes_no_na_fields": {
      "structure_partnership": {"label": "Partnership", "order": 0},
      "structure_localresearch": {"label": "Local Research Organization", "order": 1},
      "structure_outsideresearch":{"label": "Outside Research Organization", "order": 2},
      "structure_firstnations": {"label": "First Nations Government", "order": 3},
      "structure_municipal": {"label": "Municipal Government", "order": 4},
      "structure_canadagov": {"label": "Federal Government", "order": 5},
      "structure_yukongov": {"label": "Territorial Government", "order": 6},
      "structure_informal": {"label": "Informal/Ad-hoc", "order": 7},
      "structure_ngo": {"label": "Non-Governmental Organization",  "order": 8}, // YT <- !!!! ?!?!
      "structure_privatesector": {"label": "Private Sector", "order": 9},
      "structure_network": {"label": "Network", "order": 10},
      "structure_other": {"label": "Other", "order": 12}
    },
    "other_field": "structure_other",
    "explain_other_field": "structure_explain",
    "everyone_label": false
  },
  "popup": {
    "title_field": "initiative",
    "parts": [
      {
        "fieldname": "description",
        "class_name": "description",
        "add_separator": true
      },
      {
        "program_types": true
      },
      //{
      //  "target_groups": true
      //},
      {
        "fieldname": "structure",
        "icon": "fas fa-sitemap"
      },
      {
        "fieldname": "host",
        "icon": "fas fa-user"
      },
      //{
      //  "fieldname": "community",
      //  "icon": "fas fa-home"
      //},
      {
        "fieldname": "location",
        "icon": "fas fa-location-arrow"
      },
      //{
      //  "fieldname": "reach",
      //  "icon": "fas fa-expand-arrows-alt"
      //},
      {
        "fieldname": "start_date",
        "label": "Start Date",
        "more_info": true
      },
      {
        "fieldname": "end_date",
        "label": "End Date",
        "more_info": true
      },
      {
        "fieldname": "why_ending",
        "label": "Reason for ending",
        "more_info": true,
        "depends_on_field": "end_date"
      },
      {
        "fieldname": "funding",
        "label": "Funding Sources",
        "more_info": true
      },
      {
        "fieldname": "partners",
        "label": "Partners",
        "icon": "fas fa-handshake",
        "more_info": true
      },
      {
        "fieldname": "success_factors",
        "label": "Success Factors",
        "more_info": true
      },
      {
        "fieldname": "challenges",
        "label": "Challenges",
        "more_info": true
      }
    ],
    "contact_info": {
      "contact_name_field": "contact_name",
      "contact_org_field": "contact_org",
      "contact_tel_field": "contact_tel",
      "contact_email_field": "contact_email",
      "contact_website_field": "contact_website"
    }
  },
  "filters": {
    "reach": {
      "name": "Reach",
      "field": "reach",
      "icon": "fas fa-expand-arrows-alt",
    },
    //"structure": {
    //  "name": "Structure",
    //  "field": "structure",
    //  "icon": "fas fa-sitemap"
    //},
    "is_active": {
      "name": "Current Status",
      "field": "is_active",
      "icon": "fas fa-calendar-check"
    }
  },

  // Basemaps:
  "basemaps": {
    "Imagery": {"label": "Imagery", "enabled": true},
    "Topographic": {"label": "Topographic", "enabled": true},
    "Streets": {"label": "Streets", "enabled": false},
    "Oceans": {"label": "Oceans", "enabled": false},
    "Gray": {"label": "Gray Canvas", "enabled": true},
    "DarkGray": {"label": "Dark Gray Canvas", "enabled": false},
    "ShadedRelief": {"label": "Shaded Relief", "enabled": false},
    "Terrain": {"label": "Terrain", "enabled": false},
    "OpenStreetMap": {"label": "OpenStreetMap", "enabled": true}
  },

  // Labels used when creating content in JavaScript code.
  "labels": {
    "programtype": "Initiative Type",
    "targetgroup": "Initiative Structure",
    "programtypes": "Initiative Types",
    "targetgroups": "Initiative Structures",
    "morelink": "+{n} more...",
    "contactdetails": "Contact Details",
    "additionaldetails": "Additional Details",
    "moreinfo": "More Info",
    "locatetitle": "Show me where I am",
    "locatepopup": "You are within {distance} {unit} from this point.",
    "zoomintitle": "Zoom in",
    "zoomouttitle": "Zoom out",
    "defaultextent": "Zoom to default extent",
    "searchplaceholder": "Search for places or addresses",
    "appattribution": ' | Designed by <a href="//esri.ca/" target="_blank">Esri Canada</a>'
  },

  // The object below is a list of all general elements that contain text
  // displayed to the user. Each key in the list below specifies a CSS selector
  // to use, and the contnet of all matched items in the HTML will be
  // replaced with the corresponding text value...this happens on the initial
  // page-load.
  "text": {
      // Document title (displayed in browser tab)...
      "head title": "AICBR | Climate Change Inventory",

      // Labels in the calcite UI header...
      ".aicbr-logo-label": "AICBR",
      ".aicbr-project-title": "Climate Change Inventory",

      // Loading labels (visible initially if it takes time to load features).
      ".loading-label": "Loading...",

      // Menu titles...
      ".programtypes-label": "Initiative Types",
      ".communities-label": "Communities",
      ".targetgroups-label": "Initiative Structure",
      ".search-label": "Search for places or addresses",
      ".basemaps-label": "Basemaps",
      ".about-label": "About",
      ".chooseterritory-label": "Region",
      ".download-label": "Download Data",
      ".complete-data-label": "All initiatives",
      ".filtered-data-label": "Filtered Initiatives",

      ".about-details": '<h3>About Us</h3><p>The Arctic Institute of Community-Based Research (AICBR) is a unique Northern organization that works to bring together multiple groups and sectors on issues that are identified by and relevant to our partners. Our current priorities include food security and food sovereignty, healthy lifestyles, youth engagement and leadership, and climate change adaptation. We work with northern Indigenous communities, Non-Governmental Organizations, governments (Indigenous, municipal, territorial, and federal), academics, graduate students, research organizations, and the private sector. Our approach prioritizes the principles of community-based research, youth engagement, collective impact, partnership development, community capacity building, knowledge sharing, intersectoral collaboration, and evaluation.</p><h3>The Yukon Climate Change Inventory Map</h3><p>Climate change is happening at a rapid pace all around us. Yukon is warming twice the rate of the rest of the world. In 2017, AICBR and its partners sought out to develop a more comprehensive picture of the activities going on across the territory related to climate change <em>adaptation</em>, <em>mitigation</em> and <em>monitoring</em>. <em>Adaptation</em> refers to the actions taken to limit our vulnerability or adjust to the impacts of climate change (not necessarily dealing with root causes of those impacts); <em>mitigation</em> refers to the actions taken to reduce the severity of climate change; and <em>monitoring</em> refers to the actions taken to understand our changing climate and its impacts. This inventory map is also connected to the Northern Food Systems Inventory Map, which are both part of two wider projects seeking to mobilize knowledge for climate change adaptation and food systems development in the North. The aim of these mapping tools are to connect communities, share information and strengthen potential partnerships for climate change action and food security promotion.</p><p><em>Note: The map contains several initiatives whose reach is broader than the community-level. These initiatives are tagged as either National, Pan-Northern, Circumpolar, or Yukon-Wide. They are coded at each community but may not necessarily be active in each community, unless otherwise noted. These initiatives should only be used for information sharing purposes and not for analysis.</em></p><h3>Getting Started</h3><p>When you open the <em>Yukon Climate Change Inventory Map</em>, you will see all initiatives, services and entities taking place in communities across the territory. Designed for both mobile and desktop devices, multiple initiatives will be displayed in clusters at each scale and at any screen size. Click or tap on a cluster to split it into smaller clusters or individual initiatives. Colour-coded map markers indicate different program types (<strong><span class="mitigation-text">red</span></strong> for <strong>Mitigation</strong>, <strong><span class="adaptation-text">blue</span></strong> for <strong>Adaptation</strong>, and <strong><span class="monitoring-text">green</span></strong> for <strong>Monitoring</strong>) to help you quickly spot the initiatives you are most interested in. Use the <strong>filter function</strong> (top left corner) to search by community, type of initiative, reach, etc.</p><p>Within each cluster, click on the <strong>individual icon</strong> to see essential information - what, when, where - about a particular initiative. If you want to know more, click <strong>more info</strong> to open an expanded popup with initiative details and contact information.</p><p>If you are using a smartphone or tablet, click the <strong>menu</strong> button in the top-left corner, and you\'ll see a list of filters to help you narrow down what\'s displayed on the map to only <strong>what/when/where</strong> you\'re interested in.</p><p>Click the <strong>geolocator</strong> (underneath the zoom controls) to find exactly where you are on the map, or click the <strong>magnifying glass</strong> in the top-right corner to search and zoom to an address on the map.</p>'
  },

  "menu_footer_items": [
      '<a class="fa fa-lg fa-envelope" href="//www.aicbr.ca/contact-us/" target="_blank"></a>',
      '<a class="fab fa-lg fa-twitter" href="https://twitter.com/AicbrYukon" target="_blank"></a>',
      '<a class="fab fa-lg fa-facebook" href="https://www.facebook.com/Arctic-Institute-of-Community-Based-Research-947539015291917/?fref=ts" target="_blank"></a>',
      '<a class="fab fa-lg fa-linkedin" href="https://www.linkedin.com/company/arctic-institute-of-community-based-research?trk=biz-companies-cym" target="_blank"></a>',
      '<a class="fab fa-lg fa-youtube" href="https://www.youtube.com/channel/UC0vT-yLsTKZMlX2iBmibEgQ" target="_blank"></a>'
  ]
});
