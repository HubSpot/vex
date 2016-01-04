vexFactory = ($) ->

    animationEndSupport = false

    $ ->
        # Detect CSS Animation Support

        s = (document.body || document.documentElement).style
        animationEndSupport = s.animation isnt undefined or s.WebkitAnimation isnt undefined or s.MozAnimation isnt undefined or s.MsAnimation isnt undefined or s.OAnimation isnt undefined

        # Register global handler for ESC

        $(window).bind 'keyup.vex', (event) ->
            vex.closeByEscape() if event.keyCode is 27

    # Vex

    vex =

        globalID: 1

        animationEndEvent: 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend' # Inconsistent casings are intentional http://stackoverflow.com/a/12958895/131898

        baseClassNames:
            vex: 'vex'
            content: 'vex-content'
            overlay: 'vex-overlay'
            close: 'vex-close'
            closing: 'vex-closing'
            open: 'vex-open'

        defaultOptions:
            content: ''
            showCloseButton: true
            escapeButtonCloses: true
            overlayClosesOnClick: true
            appendLocation: 'body'
            className: ''
            css: {}
            overlayClassName: ''
            overlayCSS: {}
            contentClassName: ''
            contentCSS: {}
            closeClassName: ''
            closeCSS: {}

        open: (options) ->
            options = $.extend {}, vex.defaultOptions, options

            options.id = vex.globalID
            vex.globalID += 1

            # Vex

            options.$vex = $('<div>')
                .addClass(vex.baseClassNames.vex)
                .addClass(options.className)
                .css(options.css)
                .data(vex: options)

            # Overlay

            options.$vexOverlay = $('<div>')
                .addClass(vex.baseClassNames.overlay)
                .addClass(options.overlayClassName)
                .css(options.overlayCSS)
                .data(vex: options)

            if options.overlayClosesOnClick
                options.$vexOverlay.bind 'click.vex', (e) ->
                    return unless e.target is @
                    vex.close $(@).data().vex.id

            options.$vex.append options.$vexOverlay

            # Content

            options.$vexContent = $('<div>')
                .addClass(vex.baseClassNames.content)
                .addClass(options.contentClassName)
                .css(options.contentCSS)
                .append(options.content)
                .data(vex: options)

            options.$vex.append options.$vexContent

            # Close button

            if options.showCloseButton
                options.$closeButton = $('<div>')
                    .addClass(vex.baseClassNames.close)
                    .addClass(options.closeClassName)
                    .css(options.closeCSS)
                    .data(vex: options)
                    .bind('click.vex', -> vex.close $(@).data().vex.id)

                options.$vexContent.append options.$closeButton

            # Inject DOM and trigger callbacks/events

            $(options.appendLocation).append options.$vex

            # Set up body className

            vex.setupBodyClassName options.$vex

            # Call afterOpen callback and trigger vexOpen event

            options.afterOpen options.$vexContent, options if options.afterOpen
            setTimeout (-> options.$vexContent.trigger 'vexOpen', options), 0

            return options.$vexContent # For chaining

        getSelectorFromBaseClass: (baseClass) ->
            return ".#{baseClass.split(' ').join('.')}"

        getAllVexes: ->
            return $(""".#{vex.baseClassNames.vex}:not(".#{vex.baseClassNames.closing}") #{vex.getSelectorFromBaseClass(vex.baseClassNames.content)}""")

        getVexByID: (id) ->
            return vex.getAllVexes().filter(-> $(@).data().vex.id is id)

        close: (id) ->
            if not id
                $lastVex = vex.getAllVexes().last()
                return false unless $lastVex.length
                id = $lastVex.data().vex.id

            return vex.closeByID id

        closeAll: ->
            ids = vex.getAllVexes().map(-> $(@).data().vex.id).toArray()
            return false unless ids?.length

            $.each ids.reverse(), (index, id) -> vex.closeByID id

            return true

        closeByID: (id) ->
            $vexContent = vex.getVexByID id
            return unless $vexContent.length

            $vex = $vexContent.data().vex.$vex

            options = $.extend {}, $vexContent.data().vex

            beforeClose = ->
                options.beforeClose $vexContent, options if options.beforeClose

            close = ->
                $vexContent.trigger 'vexClose', options
                $vex.remove()
                $('body').trigger 'vexAfterClose', options # Triggered on the body since $vexContent was removed
                options.afterClose $vexContent, options if options.afterClose

            hasAnimation = $vexContent.css('animationName') != 'none' && $vexContent.css('animationDuration') != '0s'

            if animationEndSupport && hasAnimation
                unless beforeClose() is false
                    $vex
                        .unbind(vex.animationEndEvent).bind(vex.animationEndEvent, -> close())
                        .addClass(vex.baseClassNames.closing)

            else
                unless beforeClose() is false
                    close()

            return true

        closeByEscape: ->
            ids = vex.getAllVexes().map(-> $(@).data().vex.id).toArray()
            return false unless ids?.length

            id = Math.max ids...
            $lastVex = vex.getVexByID id
            return false if $lastVex.data().vex.escapeButtonCloses isnt true

            return vex.closeByID id

        setupBodyClassName: ($vex) ->
            $('body')
                .bind('vexOpen.vex', -> $('body').addClass(vex.baseClassNames.open))
                .bind('vexAfterClose.vex', -> $('body').removeClass(vex.baseClassNames.open) unless vex.getAllVexes().length)

        hideLoading:  ->
            $('.vex-loading-spinner').remove()

        showLoading: ->
            vex.hideLoading()
            $('body').append("""<div class="vex-loading-spinner #{vex.defaultOptions.className}"></div>""")

if typeof define is 'function' and define.amd
    # AMD
    define ['jquery'], vexFactory
else if typeof exports is 'object'
    # CommonJS
    module.exports = vexFactory require('jquery')
else
    # Global
    window.vex = vexFactory jQuery