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

    concat:
      vexCombined:
        src: ['js/vex.js', 'js/vex.dialog.js']
        dest: 'js/vex.combined.js'

        options:
          process: (source, path) ->
            source = source.replace "define(['jquery'], vexFactory)", "define('vex', ['jquery'], vexFactory)"
            source = source.replace "define(['jquery', 'vex'], vexDialogFactory)", "define('vex.dialog', ['jquery', 'vex'], vexDialogFactory)"
            source

    uglify:
      vex:
        src: 'js/vex.js'
        dest: 'js/vex.min.js'
        options:
          banner: "/*! vex.js <%= pkg.version %> */\n"

      vexDialog:
        dest: 'js/vex.dialog.min.js',
        src: 'js/vex.dialog.js',
        options:
          banner: "/*! vex.dialog.js <%= pkg.version %> */\n"

      vexCombined:
        dest: 'js/vex.combined.min.js',
        src: 'js/vex.combined.js'
        options:
          banner: "/*! vex.js, vex.dialog.js <%= pkg.version %> */\n"

    compass:
      dist:
        options:
          sassDir: 'sass'
          cssDir: 'css'

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-compass'
  grunt.loadNpmTasks 'grunt-contrib-concat'

  grunt.registerTask 'default', ['coffee', 'concat', 'uglify', 'compass']
