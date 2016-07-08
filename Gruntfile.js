module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      vex: {
        src: 'src/vex.js',
        dest: 'dist/vex.js'
      },

      vexDialog: {
        src: 'src/vex.dialog.js',
        dest: 'dist/vex.dialog.js'
      },

      vexCombined: {
        src: 'src/vex.combined.js',
        dest: 'dist/vex.combined.js'
      }
    },

    uglify: {
      vex: {
        src: 'dist/vex.js',
        dest: 'dist/vex.min.js',
        options: {
          banner: '/*! vex.js <%= pkg.version %> */\n'
        }
      },

      vexDialog: {
        src: 'dist/vex.dialog.js',
        dest: 'dist/vex.dialog.min.js',
        options: {
          banner: '/*! vex.dialog.js <%= pkg.version %> */\n'
        }
      },

      vexCombined: {
        src: 'dist/vex.combined.js',
        dest: 'dist/vex.combined.min.js',
        options: {
          banner: '/*! vex.js, vex.dialog.js <%= pkg.version %> */\n'
        }
      }
    },

    compass: {
      dist: {
        options: {
          sassDir: 'sass',
          cssDir: 'css'
        }
      }
    },

    sass: {
      dist: {
        cwd: 'sass',
        dest: 'css',
        expand: true,
        outputStyle: 'compressed',
        src: '*.sass',
        ext: '.css'
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-compass')
  grunt.loadNpmTasks('grunt-sass')

  grunt.registerTask('default', ['browserify', 'uglify', 'sass'])
}
