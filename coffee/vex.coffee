$ = jQuery

# Detect CSS Animation Support

animationEndSupport = false

$ ->
    s = (document.body || document.documentElement).style
    animationEndSupport = s.animation isnt undefined or s.WebkitAnimation isnt undefined or s.MozAnimation isnt undefined or s.MsAnimation isnt undefined or s.OAnimation isnt undefined

class EscapeStack
    constructor: ->
        @empty()

    empty: ->
        @_stack = []

    add: (vexId, shouldClose) ->
        @_stack.push(
            id: vexId
            shouldClose: shouldClose
        )
        @rebind()

    remove: (vexId) ->
        return if vexId.length is 0
        newStack = []
        for item in @_stack
            if not (item.id is vexId)
                newStack.push(item)
        @_stack = newStack
        @rebind()

    rebind: ->
        if @lastHandler?
            $('body').unbind('keyup', @lastHandler)

        top = @_stack[@_stack.length - 1]

        return unless top?.shouldClose
        @lastHandler = (e) =>
            return true unless e.keyCode is 27
            vex.closeByID(top.id)
            return false

        $('body').bind('keyup', @lastHandler)


# Vex

vex =

    globalID: 1
    escapeStack: new EscapeStack()

    animationEndEvent: 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend' # Inconsistent casings are intentional http://stackoverflow.com/a/12958895/131898

    baseClassNames:
        vex: 'vex'
        content: 'vex-content'
        overlay: 'vex-overlay'
        close: 'vex-close'
        closing: 'vex-closing'

    defaultOptions:
        content: ''
        showCloseButton: true
        overlayClosesOnClick: true
        escapeButtonCloses: true
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

        # Call afterOpen callback and trigger vexOpen event

        options.afterOpen options.$vexContent, options if options.afterOpen
        setTimeout (-> options.$vexContent.trigger 'vexOpen', options), 0
        vex.escapeStack.add(options.id, options.escapeButtonCloses)

        return options.$vexContent # For chaining

    getAllVexes: ->
        return $(""".#{vex.baseClassNames.vex}:not(".#{vex.baseClassNames.closing}") .#{vex.baseClassNames.content}""")

    getVexByID: (id) ->
        return vex.getAllVexes().filter(-> $(@).data().vex.id is id)

    close: (id) ->
        if not id
            $lastVexContent = vex.getAllVexes().last()
            return false unless $lastVexContent.length
            id = $lastVexContent.data().vex.id

        return vex.closeByID id

    closeAll: ->
        ids = vex.getAllVexes().map(-> $(@).data().vex.id)
        return false unless ids and ids.length

        $.each ids.reverse(), (index, id) -> vex.closeByID id

        vex.escapeStack.empty()

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
            options.afterClose $vexContent, options if options.afterClose

        if animationEndSupport
            beforeClose()
            $vex
                .unbind(vex.animationEndEvent).bind(vex.animationEndEvent, -> close())
                .addClass(vex.baseClassNames.closing)

        else
            beforeClose()
            close()

        vex.escapeStack.remove(id)

        return true

    hideLoading:  ->
        $('.vex-loading-spinner').remove()

    showLoading: ->
        vex.hideLoading()
        $('body').append("""<div class="vex-loading-spinner #{vex.defaultOptions.className}"></div>""")

window.vex = vex

