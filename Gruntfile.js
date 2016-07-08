module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      Vex: {
        src: 'src/vex.js',
        dest: 'dist/vex.js',
        options: {
          browserifyOptions: {
            'standalone': 'Vex'
          }
        }
      }
    },

    uglify: {
      Vex: {
        src: 'dist/vex.js',
        dest: 'dist/vex.min.js',
        options: {
          banner: '/*! vex.js <%= pkg.version %> */\n'
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
