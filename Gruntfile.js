module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
      },
      dist: {
        files: {
          'build/mergus-icons.css': 'index.scss'
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({ browsers: '> 5%' })
        ]
      },
      build: {
        src: 'build/**/*.*css'
      }
    },

    cssnano: {
      options: {
        sourcemap: true
      },
      dist: {
        files: {
          'build/mergus-icons.min.css': 'build/mergus-icons.css',
          'build/font/mergus-icons.min.css': 'build/font/mergus-icons.css'
        }
      }
    },

    svgmin: {
      dist: {
        options: {
          plugins: [
            {removeTitle: true},
            {removeStyleElement: true},
            {removeAttrs: { attrs: ['id', 'class', 'data-name', 'fill', 'fill-rule'] }},
            {removeEmptyContainers: true},
            {sortAttrs: true},
            {removeUselessDefs: true},
            {removeEmptyText: true},
            {removeEditorsNSData: true},
            {removeEmptyAttrs: true},
            {removeHiddenElems: true}
          ]
        },
        files: [{
          expand: true,
          cwd: 'lib/svg',
          src: ['*.svg'],
          dest: 'build/svg'
        }]
      }
    },

    svg_sprite: {
      mergusicons: {
        expand: true,
        cwd: 'lib/svg',
        src: ['*.svg'],
        dest: 'build/',
        options: {
          mode: {
            symbol: {
              dest: "",
              sprite: "sprite.mergus-icons.svg"
            }
          }
        }
      }
    },

    webfont: {
      options: {
        font: "mergus-icons",
        fontFamilyName: "Mergus-icons",
        types: 'eot,woff,woff2,ttf,svg',
        fontHeight: 96,
        normalize: false,
        ascent: 84,
        descent: 12,
        htmlDemo: false,
        codepointsFile: 'lib/font/codepoints.json',
        templateOptions: {
          baseClass: 'mgi',
          classPrefix: 'mgi-',
          mixinPrefix: 'mgi-',
          fontFamilyName: "Mergus-icons"
        }
      },
      mergusicons_css: {
        src: 'lib/svg/*.svg',
        dest: 'build/font',
        options: {
          template: 'lib/font/template.css'
        }
      },
      mergusicons_scss: {
        src: 'lib/svg/*.svg',
        dest: 'build/font',
        options: {
          stylesheet: 'scss',
          template: 'lib/font/template.scss'
        }
      }
    },

    clean: {
      font: [
        'build/font/*'
      ],
      svg: [
        'build/svg/*',
        'build/sprite.mergus-icons.svg',
        'build/mergus-icons.*'
      ],
      all: [
        'build'
      ]
    },

    sync: {
        all: {
          options: {
            // sync specific options
            // sync: ['author', 'name', 'version', 'private'],
            // optional: override package values
            overrides: {
              main: [
                '<%= pkg.codename %>.js',
                '<%= pkg.codename %>.css'
              ]
            },
            // optional: specify source and destination filenames
            from: 'package.json',
            to: 'bower.json'
          }
        }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-svg-sprite');
  grunt.loadNpmTasks('grunt-webfont');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-cssnano');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-npm2bower-sync');

  // build tasks
  grunt.registerTask('cleanAll',  ['clean:all']);
  grunt.registerTask('css',  ['sass', 'postcss', 'cssnano']);
  grunt.registerTask('font', ['webfont']);
  grunt.registerTask('svg', ['svgmin', 'svg_sprite']);

  // default task, build /dist/
  grunt.registerTask('default', [ 'sync','cleanAll','svg', 'font', 'css']);
};
