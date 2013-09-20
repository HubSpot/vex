(function() {
  var $, EscapeStack, animationEndSupport, vex;

  $ = jQuery;

  animationEndSupport = false;

  $(function() {
    var s;
    s = (document.body || document.documentElement).style;
    return animationEndSupport = s.animation !== void 0 || s.WebkitAnimation !== void 0 || s.MozAnimation !== void 0 || s.MsAnimation !== void 0 || s.OAnimation !== void 0;
  });

  EscapeStack = (function() {
    function EscapeStack() {
      this.empty();
    }

    EscapeStack.prototype.empty = function() {
      return this._stack = [];
    };

    EscapeStack.prototype.add = function(vexId, shouldClose) {
      this._stack.push({
        id: vexId,
        shouldClose: shouldClose
      });
      return this.rebind();
    };

    EscapeStack.prototype.remove = function(vexId) {
      var item, newStack, _i, _len, _ref;
      if (vexId.length === 0) {
        return;
      }
      newStack = [];
      _ref = this._stack;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (!(item.id === vexId)) {
          newStack.push(item);
        }
      }
      this._stack = newStack;
      return this.rebind();
    };

    EscapeStack.prototype.rebind = function() {
      var top,
        _this = this;
      if (this.lastHandler != null) {
        $('body').unbind('keyup', this.lastHandler);
      }
      top = this._stack[this._stack.length - 1];
      if (!(top != null ? top.shouldClose : void 0)) {
        return;
      }
      this.lastHandler = function(e) {
        if (e.keyCode !== 27) {
          return true;
        }
        vex.closeByID(top.id);
        return false;
      };
      return $('body').bind('keyup', this.lastHandler);
    };

    return EscapeStack;

  })();

  vex = {
    globalID: 1,
    escapeStack: new EscapeStack(),
    animationEndEvent: 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend',
    baseClassNames: {
      vex: 'vex',
      content: 'vex-content',
      overlay: 'vex-overlay',
      close: 'vex-close',
      closing: 'vex-closing'
    },
    defaultOptions: {
      content: '',
      showCloseButton: true,
      overlayClosesOnClick: true,
      escapeButtonCloses: true,
      appendLocation: 'body',
      className: '',
      css: {},
      overlayClassName: '',
      overlayCSS: {},
      contentClassName: '',
      contentCSS: {},
      closeClassName: '',
      closeCSS: {}
    },
    open: function(options) {
      options = $.extend({}, vex.defaultOptions, options);
      options.id = vex.globalID;
      vex.globalID += 1;
      options.$vex = $('<div>').addClass(vex.baseClassNames.vex).addClass(options.className).css(options.css).data({
        vex: options
      });
      options.$vexOverlay = $('<div>').addClass(vex.baseClassNames.overlay).addClass(options.overlayClassName).css(options.overlayCSS).data({
        vex: options
      });
      if (options.overlayClosesOnClick) {
        options.$vexOverlay.bind('click.vex', function(e) {
          if (e.target !== this) {
            return;
          }
          return vex.close($(this).data().vex.id);
        });
      }
      options.$vex.append(options.$vexOverlay);
      options.$vexContent = $('<div>').addClass(vex.baseClassNames.content).addClass(options.contentClassName).css(options.contentCSS).append(options.content).data({
        vex: options
      });
      options.$vex.append(options.$vexContent);
      if (options.showCloseButton) {
        options.$closeButton = $('<div>').addClass(vex.baseClassNames.close).addClass(options.closeClassName).css(options.closeCSS).data({
          vex: options
        }).bind('click.vex', function() {
          return vex.close($(this).data().vex.id);
        });
        options.$vexContent.append(options.$closeButton);
      }
      $(options.appendLocation).append(options.$vex);
      if (options.afterOpen) {
        options.afterOpen(options.$vexContent, options);
      }
      setTimeout((function() {
        return options.$vexContent.trigger('vexOpen', options);
      }), 0);
      vex.escapeStack.add(options.id, options.escapeButtonCloses);
      return options.$vexContent;
    },
    getAllVexes: function() {
      return $("." + vex.baseClassNames.vex + ":not(\"." + vex.baseClassNames.closing + "\") ." + vex.baseClassNames.content);
    },
    getVexByID: function(id) {
      return vex.getAllVexes().filter(function() {
        return $(this).data().vex.id === id;
      });
    },
    close: function(id) {
      var $lastVexContent;
      if (!id) {
        $lastVexContent = vex.getAllVexes().last();
        if (!$lastVexContent.length) {
          return false;
        }
        id = $lastVexContent.data().vex.id;
      }
      return vex.closeByID(id);
    },
    closeAll: function() {
      var ids;
      ids = vex.getAllVexes().map(function() {
        return $(this).data().vex.id;
      });
      if (!(ids && ids.length)) {
        return false;
      }
      $.each(ids.reverse(), function(index, id) {
        return vex.closeByID(id);
      });
      vex.escapeStack.empty();
      return true;
    },
    closeByID: function(id) {
      var $vex, $vexContent, beforeClose, close, options;
      $vexContent = vex.getVexByID(id);
      if (!$vexContent.length) {
        return;
      }
      $vex = $vexContent.data().vex.$vex;
      options = $.extend({}, $vexContent.data().vex);
      beforeClose = function() {
        if (options.beforeClose) {
          return options.beforeClose($vexContent, options);
        }
      };
      close = function() {
        $vexContent.trigger('vexClose', options);
        $vex.remove();
        if (options.afterClose) {
          return options.afterClose($vexContent, options);
        }
      };
      if (animationEndSupport) {
        beforeClose();
        $vex.unbind(vex.animationEndEvent).bind(vex.animationEndEvent, function() {
          return close();
        }).addClass(vex.baseClassNames.closing);
      } else {
        beforeClose();
        close();
      }
      vex.escapeStack.remove(id);
      return true;
    },
    hideLoading: function() {
      return $('.vex-loading-spinner').remove();
    },
    showLoading: function() {
      vex.hideLoading();
      return $('body').append("<div class=\"vex-loading-spinner " + vex.defaultOptions.className + "\"></div>");
    }
  };

  window.vex = vex;

}).call(this);
