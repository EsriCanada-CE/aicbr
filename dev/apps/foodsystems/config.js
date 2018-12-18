define({
  "territories": {
    "yt": {
      "layer": "https://services8.arcgis.com/Ryw8BjFdgxyjmolc/arcgis/rest/services/yt_foodsystem_inventory_2018_3_public/FeatureServer/0",
      "label": "Yukon Food System Inventory",
      "name": "Yukon"
    },
    "northern": {
      "layer": "https://services8.arcgis.com/Ryw8BjFdgxyjmolc/arcgis/rest/services/northern_foodsystems_inventory_2018_public_1/FeatureServer/0",
      "label": "Northern Food Systems Inventory",
      "name": "Northern Regions"
    }
  },
  "territory_switch_disabled": true,
  "communities": {
    "name_field": "community"
  },
  "program_types": {
    "menu_icon": "fas fa-list",
    "yes_no_fields": {
      "type_consumption": {"label": "Consumption", "colour": "#d5341c", "order": 4}, // YT
      "type_production": {"label": "Production and Harvesting", "colour": "#532f64", "order": 0}, // YT & NWT
      "type_transportation": {"label": "Transportation", "colour": "#000000", "order": 1}, // YT & NTW
      "type_processing": {"label": "Processing and Storage", "colour": "#bf539e", "order": 2}, // YT
      "type_distribution": {"label": "Distribution and Exchange", "colour": "#26a4db", "order": 3}, // YT
      "type_skills": {"label": "Food Skills, Knowledge, and Culture", "colour": "#008d3c", "order": 5}, // YT
      "type_coordination": {"label": "Food System Coordination/Policy/Networks", "colour": "#106ab6", "order": 6}, // YT
      "type_waste": {"label": "Food Waste", "colour": "#ee8c1d", "order": 7}// YT  <- !!!! ?!?!
      },
    "display": {
      "field": "initiative_type",
      "default_type": "Other",
      "types": {
        "Production/Harvesting": {
          "markerColor": "purple", /*"#532f64"*/
          "text": {"classname": "production-text", "colour": "#532f64", "colourname": "purple"},
          "pie": { "filling": "#532f64", "crust": "#3b2247" },
          "iconColor": "white",
          "icon": "fa-apple-alt",
          "shape": "circle",
          "prefix": "fa"
        },
        "Transportation": {
          "markerColor": "black", /* "#000000" */
          "text": {"classname": "transportation-text", "colour": "#000000", "colourname": "black"},
          "pie": { "filling": "#000000", "crust": "#191919" },
          "iconColor": "white",
          "icon": "fa-shuttle-van",
          "shape": "circle",
          "prefix": "fa"
        },
        "Processing/Storage": {
          "markerColor": "pink", /* "#bf539e" */
          "text": {"classname": "processing-text", "colour": "#bf539e", "colourname": "pink"},
          "pie": { "filling": "#bf539e", "crust": "#8c3d74" },
          "iconColor": "white",
          "icon": "fa-cogs",
          "shape": "circle",
          "prefix": "fa"
        },
        "Distribution/Exchange": {
          "markerColor": "cyan", /* "#26a4db" */
          "text": {"classname": "distribution-text", "colour": "#26a4db", "colourname": "light blue"},
          "pie": { "filling": "#26a4db", "crust": "#1a6f94" },
          "iconColor": "white",
          "icon": "fa-exchange-alt",
          "shape": "circle",
          "prefix": "fa"
        },
        "Consumption": {
          "markerColor": "orange-dark", /* "#d5341c", closer to red than orange (the ExtraMarkers default red is too dark) */
          "text": {"classname": "consumption-text", "colour": "#d5341c", "colourname": "red"},
          "pie": { "filling": "#d5341c", "crust": "#a52816" },
          "iconColor": "white",
          "icon": "fa-cookie-bite",
          "shape": "circle",
          "prefix": "fa"
        },
        "Food Skills/Knowledge/Culture": {
          "markerColor": "green", /* "#008d3c" */
          "text": {"classname": "skills-text", "colour": "#008d3c", "colourname": "green"},
          "pie": { "filling": "#008d3c", "crust": "#00632a" },
          "iconColor": "white",
          "icon": "fa-graduation-cap",
          "shape": "circle",
          "prefix": "fa"
        },
        "Food System Coordination/Policy/Networks": {
          "markerColor": "blue", /* "#106ab6" */
          "text": {"classname": "coordination-text", "colour": "#106ab6", "colourname": "blue"},
          "pie": { "filling": "#106ab6", "crust": "#0c4e86" },
          "iconColor": "white",
          "icon": "fa-handshake",
          "shape": "circle",
          "prefix": "fa"
        },
        "Food Waste": {
          "markerColor": "orange",
          "text": {"classname": "waste-text", "colour": "#ee8c1d", "colourname": "orange"},
          "pie": { "filling": "#ee8c1d", "crust": "#c07117" },
          "iconColor": "white",
          "icon": "fa-trash",
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
    "menu_icon": "fas fa-users",
    "yes_no_na_fields": {
      "target_wholecommunity": {"label": "Whole community", "order": 0},
      "target_preschool": {"label": "Pre-school children aged 1-4yrs", "order": 1},
      "target_children":{"label": "Children aged 5-12yrs", "order": 2},
      "target_youth": {"label": "Youth aged 13-19yrs", "order": 3},
      "target_families": {"label": "Families", "order": 4},
      "target_adults": {"label": "Adults", "order": 5},
      "target_seniors": {"label": "Seniors/Elders", "order": 6},
      "target_lowincome": {"label": "People living with low income", "order": 7},
      "target_disabilities": {"label": "People living with disabilities",  "order": 8}, // YT <- !!!! ?!?!
      "target_natal": {"label": "Pre/Postnatal", "order": 9},
      "target_menonly": {"label": "Men only", "order": 10},
      "target_womengirls_only":  {"label": "Women/girls only", "order": 11},
      "target_other": {"label": "Other", "order": 12}
    },
    "other_field": "target_other",
    "explain_other_field": "target_explainother",
    "everyone_label": "Everyone"
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
      {
        "target_groups": true,
        "more_info": true
      },
      {
        "fieldname": "cost",
        "label": "Cost",
        "more_info": true
      },
      {
        "fieldname": "volunteer_run",
        "label": "Volunteer Run",
        "more_info": true
      },
      {
        "fieldname": "season",
        "label": "Season",
        "more_info": true
      },
      {
        "fieldname": "time_frame",
        "label": "Time Frame",
        "more_info": true
      },
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
        "fieldname": "why_end",
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
      "territories": ["northern", "yt"]
    },
    "region": {
      "name": "Region",
      "field": "region",
      "icon": "fas fa-map-marker-alt",
      "territories": ["northern"]
    },
    "structure": {
      "name": "Structure",
      "field": "structure",
      "icon": "fas fa-sitemap"
    },
    "is_current": {
      "name": "Current Status",
      "field": "is_current",
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
    "targetgroup": "Target Group",
    "programtypes": "Initiative Types",
    "targetgroups": "Target Groups",
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
      "head title": "AICBR | Food System Inventory",

      // Labels in the calcite UI header...
      ".aicbr-logo-label": "AICBR",
      ".aicbr-project-title": "Food System Inventory",

      // Loading labels (visible initially if it takes time to load features).
      ".loading-label": "Loading...",

      // Menu titles...
      ".programtypes-label": "Initiative Types",
      ".communities-label": "Communities",
      ".targetgroups-label": "Target Groups",
      ".search-label": "Search for places or addresses",
      ".basemaps-label": "Basemaps",
      ".about-label": "About",
      ".chooseterritory-label": "Inventory",
      ".download-label": "Download Data",
      ".complete-data-label": "All initiatives",
      ".filtered-data-label": "Filtered Initiatives",

      ".about-details": '<h3>About Us</h3><p>The Arctic Institute of Community-Based Research (AICBR) is a unique Northern organization that works to bring together multiple groups and sectors on issues that are identified by and relevant to our partners. Our current priorities include food security and food sovereignty, healthy lifestyles, youth engagement and leadership, and climate change adaptation. We work with northern Indigenous communities, Non-Governmental Organizations, governments (Indigenous, municipal, territorial, and federal), academics, graduate students, research organizations, and the private sector. Our approach prioritizes the principles of community-based research, youth engagement, collective impact, partnership development, community capacity building, knowledge sharing, intersectoral collaboration, and evaluation.</p><h3>The Northern Food Systems Inventory Map</h3><p>Our food system is complex and is made up of a number of interconnected facets: <em>production and harvesting</em>; <em>transportation</em>; <em>processing</em>; <em>distribution and exchange</em>; <em>consumption</em>; <em>food skills</em>, <em>knowledge and culture</em>; <em>food system coordination</em>, <em>policy and networks</em>; and <em>food waste</em>. The <strong>Northern Food System Inventory Map</strong> was developed by AICBR and its partners as part of a wider project seeking to mobilize knowledge for climate change adaptation and food systems development in the North. The aim is to create a more comprehensive picture of the many activities, services, entities, and programs that make up our food system and to connect communities, share information, and strengthen potential partnerships for climate change action and food security promotion.</p><h3>Getting Started</h3><p>When you open the Northern Food Systems Inventory Map, you will see all initiatives, services and entities taking place in communities across the North <em>(you can filter the map to show only each region represented separately)</em>. Designed for both mobile and desktop devices, multiple initiatives will be displayed in clusters at each scale and at any screen size. Click or tap on a cluster to split it into smaller clusters or individual initiatives. Colour-coded map markers indicate different program types (<strong><span class="consumption-text">red</span></strong> for <em>Consumption</em>, <strong><span class="coordination-text">dark blue</span></strong> for <em>Food System Coordination/Policy/Networks</em>, <strong><span class="skills-text">green</span></strong> for <em>Food Skills/Knowledge/Culture</em>, <strong><span class="production-text">purple</span></strong> for <em>Production/Harvesting</em>, <strong><span class="distribution-text">light blue</span></strong> for <em>Distribution/Exchange</em>, <strong><span class="transportation-text">black</span></strong> for <em>Transportation</em>, <strong><span class="processing-text">pink</span></strong> for <em>Processing/Storage</em>, and <strong><span class="waste-text">orange</span></strong> for <em>Food Waste</em>) to help you quickly spot the initiatives you are most interested in. Use the filter function (top left corner) to search by community, initiatives, target group, region, etc.</p><p>Within each cluster, click on the individual icon to see essential information - what, when, where - about a particular initiative. If you want to know more, click more info to open an expanded popup with initiative details and contact information.</p><p>If you are using a smartphone or tablet, click the  menu button in the top-left corner, and you will see a list of filters to help you narrow down what is displayed on the map to only what/when/where you are interested in.</p><p>Click the geolocator (underneath the zoom controls) to find exactly where you are on the map, or click the magnifying glass in the top-right corner to search and zoom to an address on the map.</p>'
  },

  "menu_footer_items": [
      '<a class="fa fa-lg fa-envelope" href="//www.aicbr.ca/contact-us/" target="_blank"></a>',
      '<a class="fab fa-lg fa-twitter" href="https://twitter.com/AicbrYukon" target="_blank"></a>',
      '<a class="fab fa-lg fa-facebook" href="https://www.facebook.com/Arctic-Institute-of-Community-Based-Research-947539015291917/?fref=ts" target="_blank"></a>',
      '<a class="fab fa-lg fa-linkedin" href="https://www.linkedin.com/company/arctic-institute-of-community-based-research?trk=biz-companies-cym" target="_blank"></a>',
      '<a class="fab fa-lg fa-youtube" href="https://www.youtube.com/channel/UC0vT-yLsTKZMlX2iBmibEgQ" target="_blank"></a>'
  ]
});
