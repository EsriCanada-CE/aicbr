define({
  "territories": {
    "yt": {
      "layer":  "https://services7.arcgis.com/n6PcuTBOoBVHP4RI/arcgis/rest/services/yt_healthy_living_inventory_public/FeatureServer/0",
      "label": "Yukon Programs",
      "name": "Yukon"
    },
    "nwt": {
      "layer": "https://services7.arcgis.com/n6PcuTBOoBVHP4RI/arcgis/rest/services/nwt_healthy_living_inventory_public/FeatureServer/0",
      "label": "Northwest Territories Programs",
      "name": "Northwest Territories"
    }
  },
  "clusters": {
    "field": "program",
    "rmax": 20
  },
  "program_types": {
    "yes_no_fields": {
      "pt_active_living": {"label": "Active Living", "colour": "#1068b5", "order": 0}, // YT & NWT
      "pt_healthy_eating": {"label": "Healthy Eating", "colour": "#ef9228", "order": 1}, // YT & NTW
      "pt_mental_health": {"label": "Mental Health", "colour": "#aeaeae", "order": 2}, // YT
      "pt_cultural_activities": {"label": "Cultural Activities", "colour": "#aeaeae", "order": 3}, // YT
      "pt_youth_leadership": {"label": "Youth Leadership", "colour": "#aeaeae", "order": 4}, // YT
      "pt_sexual_health": {"label": "Sexual Health", "colour": "#aeaeae", "order": 5}, // YT
      "pt_career_exploration": {"label": "Career Exploration", "colour": "#aeaeae", "order": 6}, // YT
      "pt_dietititan_support": {"label": "Dietition Support", "colour": "#aeaeae", "order": 7}, // YT  <- !!!! ?!?!
      "pt_dietititan"        : {"label": "Dietition Support", "colour": "#aeaeae", "order": 8}  // NWT  <- !!!! ?!?!
    },
    "display": {
      "field": "program",
      "types": {
        "Active Living": {
          "markerColor": "blue", /*"#1068b5"*/
          "text": {"classname": "active-living-text", "colour": "#1068b5", "colourname": "blue"},
          "pie": { "filling": "#1068b5", "crust": "#0c4d86" },
          "iconColor": "white",
          "icon": "fa-heartbeat",
          "shape": "circle",
          "prefix": "fa"
        },
        "Healthy Eating": {
          "markerColor": "orange", /* "#ef9228" */
          "text": {"classname": "healthy-eating-text", "colour": "#ef9228", "colourname": "orange"},
          "pie": { "filling": "#ef9228", "crust": "#d47810" },
          "iconColor": "white",
          "icon": "fa-cutlery",
          "shape": "square",
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
    "yes_no_na_fields": {
      "tg_preschool": {"label": "Pre-School Children aged 1-4", "order": 0},
      "tg_children":{"label": "Children aged 5-12", "order": 1},
      "tg_youth": {"label": "Youth aged 13-19", "order": 2},
      "tg_families": {"label": "Families", "order": 3},
      "tg_adults": {"label": "Adults", "order": 4},
      "tg_seniors": {"label": "Seniors/Elders", "order": 5},
      "tg_income": {"label": "Low Income", "order": 6},
      "tg_disabilities": {"label": "Disabilities",  "order": 7}, // YT <- !!!! ?!?!
      "tg_disability": {"label": "Disabilities",  "order": 8},// NWT <- !!!! ?!?!
      "tg_natal": {"label": "Pre/Post-Natal", "order": 9},
      "tg_menonly": {"label": "People living with disabilities", "order": 10},
      "tg_womengirls":  {"label": "People living with low income", "order": 11},
      "tg_other": {"label": "Other", "order": 12}
    },
    "explain_other_field": "tg_explainother",
    "everyone_label": "Everyone"
  },
  "communities": {
    "name_field": "community"
  },
  "display_fields": {
    "community": "Community",
    "contact_name": "Name",
    "contact_email": "Email",
    "contact_tel": "Telephone",
    "contact_website": "Website",
    "contact_org": "Organization",
    "program_type": "Program Type",
    "program": "Program",
    "host": "Program Host",
    "location": "Location Description",
    "season": "Season",
    "time_frame": "Time Frame",
    "funding": "Funding Sources",
    "cost": "Cost to Participate",
    "duration": "Duration the Program has been Running",
    "continuing": "Continuing in 2017/2018 Fiscal Year",
    "why_not": "If not continuing, why not?",
    "success_factors": "Success Factors",
    "partners": "Partners",
    "volunteer_run": "Volunteer Run"
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
    "programtype": "Program Type",
    "targetgroup": "Target Group",
    "programtypes": "Program Types",
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
      "head title": "AICBR | Healthy Living Inventory",

      // Labels in the calcite UI header...
      ".aicbr-logo-label": "AICBR",
      ".aicbr-project-title": "Healthy Living Inventory",

      // Loading labels (visible initially if it takes time to load features).
      ".loading-label": "Loading...",

      // Menu titles...
      ".programtypes-label": "Program Types",
      ".communities-label": "Communities",
      ".targetgroups-label": "Target Groups",
      ".search-label": "Search for places or addresses",
      ".basemaps-label": "Basemaps",
      ".about-label": "About",
      ".chooseterritory-label": "Territory",

      ".about-details": '<h3>About Us</h3><p>The Arctic Institute of Community-Based Research (AICBR) is a unique Northern organization that works to bring together multiple groups and sectors on issues that are identified by and relevant to our partners. Our current priorities include food security, healthy lifestyles, chronic disease prevention, youth engagement and mental health, and climate change adaptation. We work with northern Indigenous communities, Non-Governmental Organizations, governments (Indigenous, municipal, territorial, and federal), academics, graduate students, research organizations, and the private sector. Our approach prioritizes the principles of community-based research, youth engagement, collective impact, partnership development, community capacity building, knowledge sharing, intersectoral collaboration and evaluation.</p><h3>The AICBR Healthy Living Inventory Map</h3><p>Every day, there are many different programs being held in the various communities across the territories. The AICBR Programs map allows you to filter programs by the <strong>community</strong>, the <strong>target group</strong>, and the <strong>type of program</strong> so you only see the programs you want to find.</p><h3>Getting Started</h3><p>When you open the AICBR Healthy Living Inventory Map, you will see all programs taking place in communities across the territory. Designed for both mobile and desktop devices, multiple programs will be displayed in clusters at each scale and at any screen size. Click or tap on a cluster to split it into smaller clusters or individual programs. Colour-coded map markers indicate different program types (<strong><span class="healthy-eating-text">orange</span></strong> for <strong>healthy eating</strong>, <strong><span class="active-living-text">blue</span></strong> for <strong>active living</strong>, and <strong><span class="other-text">gray</span></strong> for everything else) to help you quickly spot the programs you are most interested in.</p><p>Click on a <strong>program marker</strong> to see essential information - what, when, where - about a particular program.  If you want to know more, click <strong>more info</strong> to open an expanded popup with program details and contact information.</p><p>If you are using a smartphone or tablet, click the <strong><i class="fa fa-bars"></i> menu</strong> button in the top-left corner, and you&apos;ll see a list of filters to help you narrow down what&apos;s displayed on the map to only <strong>what/when/where</strong> you"re interested in.</p><p> Click the <strong><i class="fa fa-map-marker"></i> geolocator</strong> (underneath the zoom controls) to find exactly where you are on the map, or click the <strong><i class="fa fa-search"></i> magnifying glass</strong> in the top-right corner to search and zoom to an address on the map.</p>'
  }
});
