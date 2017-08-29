module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            build: [
                "dist/js/aicbr.js",
                "dist/css/",
                "dist/vendor/",
                "dist/calcite-maps/",
                "dist/img/",
                "dist/index.html"
            ]
        },
        postcss: {
          options: {
              map: {inline: false},

              processors: [
                  require('postcss-partial-import')({}),
                  require('autoprefixer')({browsers: ["> 1%", "last 3 versions", "Firefox ESR", "Opera 12.1", "ie 9"]}), // add vendor prefixes
                  require('cssnano')({
                    zindex: false // Don't let the z-index parameters be maniplated.
                  }) // minify the result
              ]
          },
          build: {
            files: {
              "dist/css/style.css": [
                "dev/css/style.css"
              ]
            }
          }
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            build: {
                files: {
                    "dist/index.html": "dev/index.html"
                }
            }
        },
        copy: {
            build: {
                files: [{
                    src: 'dev/js/config.js',
                    dest: 'dist/js/config-default.js'
                },{
                    expand: true,
                    cwd: 'dev/',
                    src: 'img/**',
                    dest: 'dist/'
                },{
                    expand: true,
                    cwd: 'dev/',
                    src: 'calcite-maps/**',
                    dest: 'dist/'
                },{
                    expand: true,
                    cwd: 'dev/',
                    src: 'vendor/**',
                    dest: 'dist/'
                }]
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "dev/js",
                    mainConfigFile: "dev/js/rjs-config.js",
                    out: "dist/js/rjs-config.js",
                    name: "rjs-config",
                    paths: {
                      "leaflet-marker-cluster": "empty:",  // Does not work when bundled into a single file...
                      "leaflet-markers": "empty:", // Does not work when bundled into a single file...
                      "leaflet-locate": "empty:", // Does not work when bundled into a single file...
                      "config": "empty:" // We do not want to bundle this file...since it's meant to be editable by a human if needed.
                    },
                    generateSourceMaps: false
                }
            }
        }
    });

    // Require the needed plugins
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-copy");;
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-postcss");
    //grunt.loadNpmTasks("grunt-regex-replace");

    // Build task
    grunt.registerTask("build", ["clean:build", "copy:build", "htmlmin:build", "postcss:build", "requirejs"]);
};
