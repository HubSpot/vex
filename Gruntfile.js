module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dialogPkg: grunt.file.readJSON('node_modules/vex-dialog/package.json'),

    browserify: {
      vex: {
        src: 'src/vex.js',
        dest: 'dist/js/vex.js',
        options: {
          browserifyOptions: {
            'standalone': 'vex'
          }
        }
      },
      combined: {
        src: 'src/vex.combined.js',
        dest: 'dist/js/vex.combined.js',
        options: {
          browserifyOptions: {
            'standalone': 'vex'
          }
        }
      }
    },

    uglify: {
      vex: {
        src: 'dist/js/vex.js',
        dest: 'dist/js/vex.min.js',
        options: {
          banner: '/*! vex.js <%= pkg.version %> */\n',
          report: 'gzip'
        }
      },
      combined: {
        src: 'dist/js/vex.combined.js',
        dest: 'dist/js/vex.combined.min.js',
        options: {
          banner: '/*! vex.combined.js: vex <%= pkg.version %>, vex-dialog <%= dialogPkg.version %> */\n',
          report: 'gzip'
        }
      }
    },

    compass: {
      dist: {
        options: {
          sassDir: 'sass',
          cssDir: 'dist/css'
        }
      }
    },

    sass: {
      dist: {
        cwd: 'sass',
        dest: 'dist/css',
        expand: true,
        outputStyle: 'compressed',
        src: '*.sass',
        ext: '.css'
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({ cascade: false })
        ]
      },
      dist: {
        src: 'dist/css/*.css'
      }
    }
  })

  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-compass')
  grunt.loadNpmTasks('grunt-sass')
  grunt.loadNpmTasks('grunt-postcss')

  grunt.registerTask('default', ['browserify', 'uglify', 'sass', 'postcss'])
}
