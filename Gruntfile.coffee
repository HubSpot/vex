module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    coffee:
      compile:
        files:
          'js/vex.js': 'coffee/vex.coffee'
          'js/vex.dialog.js': 'coffee/vex.dialog.coffee'

    watch:
      coffee:
        files: ['vex.coffee']
        tasks: ["coffee", "uglify"]

    uglify:
      options:
        banner: "/*! <%= pkg.name %> <%= pkg.version %> */\n"

      dist:
        files: [
          {
            dest: 'js/vex.min.js',
            src: 'js/vex.js'
          },
          {
            dest: 'js/vex.dialog.min.js',
            src: 'js/vex.dialog.js',
          }
          {
            dest: 'js/vex.combined.min.js',
            src: ['js/vex.js', 'js/vex.dialog.js']
          }
        ]

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'

  grunt.registerTask 'default', ['coffee', 'uglify']