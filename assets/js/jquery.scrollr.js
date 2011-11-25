/*    
*
* jQuery.scrollr.js v0.1
* http://github.com/hovr/jquery-scrollr
*
* Copyright 2011, Hovr Ltd
* Licensed under the GPL Version 3 license.
*
* Date: Fri 25th november 2011
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*/

(function ($) {
    var methods = {
        init: function (options) {
            return this.each(function () {
                var self = $(this).addClass('scrollr-self').css('overflow', 'hidden'),
                    data = self.data('scrollr');
                if (!data) {
                    // Defaults
                    var opts = $.extend({
                        'height': self.css('height'),
                        'width': self.css('width'),
                        'innerHeight': 0,
                        'offSet': 0
                    }, options);
                    // wrap element in viewport div
                    opts.inner = $('<div></div>').addClass('scrollr-inner');
                    opts.viewPort = $('<div></div>').addClass('scrollr-viewport').css({
                        'height': opts.height,
                        'width': opts.width
                    });
                    self.wrapInner(opts.inner);
                    self.wrapInner(opts.viewPort);
                    opts.inner = self.find('.scrollr-inner');
                    opts.viewPort = self.find('.scrollr-viewport');
                    // get inner height of elements
                    opts.inner.children().each(function (i, e) {
                        opts.innerHeight = opts.innerHeight + $(e).outerHeight();
                    });
                    opts.inner.css('height', opts.innerHeight + 'px');
                    // Add scrollbar
                    opts.handle = $('<div></div>').addClass('scrollr-handle');
                    opts.scrollbar = $('<div></div>').addClass('scrollr-scrollbar').css('height', opts.height).append(opts.handle);
                    opts.scrollbar.appendTo(opts.viewPort)
                    opts.handle = self.find('.scrollr-handle');
                    opts.scrollbar = self.find('.scrollr-scrollbar');

                    function mwheel() {
                        opts.viewPort.bind('mousewheel', function (event, delta) {
                            event.preventDefault();
                            amount = (delta < 0) ? Math.abs(delta) : (delta * (-1))
                            opts.offSet = opts.offSet + (amount * 12);
                            if (0 > opts.offSet) {
                                opts.inner.css('top', '0px');
                                opts.offSet = 0;
                            } else if (opts.offSet > (opts.innerHeight - opts.viewPort.height())) {
                                opts.inner.css('top', '-' + (opts.innerHeight - opts.viewPort.height()) + 'px');
                                opts.offSet = (opts.innerHeight - opts.viewPort.height());
                            } else {
                                opts.inner.css('top', '-' + opts.offSet + 'px');
                            }
                            opts.handle.trigger('mwheel');
                        });
                        opts.handle.bind('mwheel', function () {
                            var per = Math.floor(((opts.offSet / (opts.innerHeight - opts.viewPort.height())) * 100));
                            opts.handle.dragger.css({
                                top: (((opts.handle.maxTop) / 100) * per)
                            });
                        });
                    };

                    function percent(p) {
                        per = Math.floor(((p / (opts.scrollbar.height() - opts.handle.height())) * 100));
                        return (((opts.innerHeight - opts.viewPort.height()) / 100) * per);
                    };

                    function scroll(s, animate) {
                        if (animate) {
                            opts.inner.animate({
                                top: '-' + percent(s) + 'px'
                            });
                        } else {
                            opts.inner.css('top', '-' + percent(s) + 'px');
                        }
                        opts.offSet = percent(s);
                    };

                    function handle() {
                        opts.handle.dragger = opts.handle;
                        opts.handle.maxTop = opts.scrollbar.height() - opts.handle.height();
                        // START DRAGGABLE
                        opts.handle.bind('mousedown', function (e) {
                            e.preventDefault();
                            opts.handle.mousePageY = e.pageY, opts.handle.dragPos = opts.handle.dragger.position().top, opts.handle.leftPos, opts.handle.topPos;
                            $(document).bind('mousemove mouseup', function (event) {
                                switch (event.type) {
                                case 'mousemove':
                                    opts.handle.topPos = (opts.handle.dragPos + event.pageY) - opts.handle.mousePageY;
                                    if (0 > opts.handle.topPos) {
                                        opts.handle.dragger.css({
                                            top: 0
                                        });
                                        scroll(0);
                                    } else if (opts.handle.topPos > opts.handle.maxTop) {
                                        opts.handle.dragger.css({
                                            top: opts.handle.maxTop + 'px'
                                        });
                                        scroll(opts.handle.maxTop);
                                    } else {
                                        opts.handle.dragger.css({
                                            top: opts.handle.topPos
                                        });
                                        scroll(opts.handle.topPos);
                                    }
                                    break;
                                case 'mouseup':
                                    $(this).unbind('mousemove mouseup');
                                    break;
                                }
                            });
                        });
                        // END DRAGGABLE
                    };

                    function scrollbar() {
                        opts.scrollbar.bind('click', function (e) {
                            if (e.originalEvent.originalTarget.className != opts.handle.dragger.attr('class')) {
                                opts.scrollbar.position = opts.scrollbar.offset().top;
                                opts.scrollbar.clickPos = e.pageY - opts.scrollbar.position;
                                opts.scrollbar.max = opts.scrollbar.height() - opts.handle.dragger.height();
                                opts.scrollbar.min = opts.handle.dragger.height();
                                if (opts.scrollbar.clickPos < opts.scrollbar.min) {
                                    opts.handle.dragger.animate({
                                        top: '0px'
                                    });
                                    scroll(0, true);
                                } else if (opts.scrollbar.clickPos > opts.scrollbar.max) {
                                    opts.handle.dragger.animate({
                                        top: opts.scrollbar.max + 'px'
                                    });
                                    scroll(opts.handle.maxTop, true);
                                } else {
                                    opts.handle.dragger.animate({
                                        top: opts.scrollbar.clickPos + 'px'
                                    });
                                    scroll(opts.scrollbar.clickPos, true);
                                }
                            }
                        });
                    }
                    handle();
                    mwheel();
                    scrollbar();
                    self.data('scrollr', opts); //pass data for other functions
                }
            });
        }
    };
    $.fn.scrollr = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.scrollr');
        }
    };
})(jQuery);