(function() {
    window.vexMixin = (function() {
        function vexMixin() {}

        vexMixin.prototype.openModal = function() {
            var $vexContent, className, css, height, _this = this;

            this.modalOptions = this.modalOptions || {};

            height = this.modalOptions.height || 100;
            css = {
                width: this.modalOptions.width
            };

            className = this.modalOptions.className || "vex-content-auto";
            if (className === "vex-content-tall") {
                css.marginLeft = -parseInt(css.width, 10) / 2;
            }

            this.render();
            this.$el.find(".vex-dialog-button-primary").click(function() {
                _this.trigger("modalConfirm");
                return _this.confirmModal();
            });
            this.$el.find(".vex-dialog-button-secondary").click(function(e) {
                e.preventDefault();
                return _this.closeModal();
            });
            $vexContent = vex.open({
                height: height,
                css: css,
                className: className,
                content: this.$el,
                afterOpen: function($fancybox) {
                    return _this.trigger("modalOpen");
                }
            });
            this.vexId = $vexContent.data().vex.id;
            return this;
        };

        vexMixin.prototype.confirmModal = function() {
            this.closeModal();
            return this;
        };

        vexMixin.prototype.closeModal = function() {
            if (this.vexId) {
                vex.close(this.vexId);
            } else {
                vex.close();
            }
            this.trigger("modalClose");
            return this;
        };

        return vexMixin;
    })();
}).call(this);
