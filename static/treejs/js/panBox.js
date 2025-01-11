"use strict";

App.PanBox = App.RaphaelView.extend({
    initialize: function() {
        this.render();
    },

    render: function() {
        // Draw the box that you can zoom and pan on
        var that = this;
        this.sprite = App.paper.rect(0,0,App.wrapper.absWidth,App.wrapper.absHeight);
        this.sprite.attr({
            fill:'#ffffff',
            'fill-opacity':0,
            'stroke-opacity':0
        });

        // Get viewbox
        var viewBox = App.wrapper.viewBox;

        // Don't show panning cursor if zoomed all the way out
        if (App.wrapper.scale == App.wrapper.minScale) {
            this.sprite.node.style.cursor = "auto";
        } else {
            this.sprite.node.style.cursor = "move";
        }

        var dtime, dx, dy;

        // Add drag based pan
        this.sprite.drag(move, start, up);
        function move(dX,dY,x,y,e) {
            dx = dX;
            dy = dY;
            dx /= App.wrapper.scale;
            dy /= App.wrapper.scale;

            // Don't pan past edges of canvas
            var w = App.wrapper.absWidth/App.wrapper.scale;
            var h = App.wrapper.absHeight/App.wrapper.scale;
            var xBounded = Math.min(Math.max(0,viewBox.xx - dx), App.wrapper.absWidth-App.wrapper.minWidth/App.wrapper.scale);
            var yBounded = Math.min(Math.max(0,viewBox.yy - dy), App.wrapper.absHeight-App.wrapper.minHeight/App.wrapper.scale);
            App.paper.setViewBox(xBounded, yBounded, w, h);
        };
        function start(x,y,e) {
            // Close hovered project box if any is open
            App.wrapper.closeHover();

            dx = 0;
            dy = 0;
            dtime = new Date().getTime();
            App.wrapper.draggingActive = true;
        };
        function up(e) {
            App.wrapper.draggingActive = false;
            viewBox.xx = Math.min(Math.max(0,viewBox.xx - dx), App.wrapper.absWidth-App.wrapper.minWidth/App.wrapper.scale);
            viewBox.yy = Math.min(Math.max(0,viewBox.yy - dy), App.wrapper.absHeight-App.wrapper.minHeight/App.wrapper.scale);
            navData.push({type:"D", elapsed:new Date().getTime() - dtime, dx:dx, dy:dy, time:new Date().getTime()});
        }

        // Scroll based zoom
        $('#tree').bind('mousewheel', function(event,delta,dx,dy) {
            // Break hover if zoomed over project so project info doesn't fill screen
            if (App.wrapper.hoverActive != false) {
                App.wrapper.hoverActive[1].inBounds = false; // Fix hoverInBounds state
                App.wrapper.hoverActive[0].hoverOut(); // Run callback; close last box
                App.wrapper.hoverActive = false;

                // Don't scroll the page when scrolling to zoom
                if (event.preventDefault) {
                    event.preventDefault();
                } else{
                    event.stop();
                };
                // Darn, none of this stuff is working in Firefox to prevent the window from catching the scroll events.
                event.returnValue = false;
                event.stopPropagation();
                return false;
            }

            if (navData.length == 0 || navData[navData.length-1].type != "Z") //start zoom
                navData.push({type:"SZ", scale:App.wrapper.scale, time:new Date().getTime()});

            var oldScale = App.wrapper.scale;
            var mouseX = event.pageX - $('#tree').offset().left;
            var mouseY = event.pageY - $('#tree').offset().top;
            var documentX = viewBox.xx+mouseX/App.wrapper.scale;
            var documentY = viewBox.yy+mouseY/App.wrapper.scale;
            var newScale;

            // Get new scale
            if (delta) {
                var d = Math.log(Math.abs(delta)+1);
                if (delta < 0) {
                    newScale = App.wrapper.scale*(1-.05*d);
                }
                else {
                    newScale = App.wrapper.scale*(1+.05*d);
                }

                if (isNaN(documentX)) {
                    console.log('is nan!');
                    console.log(event.pageX, $('#tree').offset().left, mouseX, viewBox.xx, App.wrapper.scale, oldScale);
                    return;
                }
                that.zoomFixedPoint(documentX, documentY, newScale);
            }

            var obj = {type:"Z", scale:newScale, time:new Date().getTime()};
            if (navData[navData.length-1].type == "Z") //replace old one if we're continuing to zoom
                navData[navData.length-1] = obj;
            else //new zoom
                navData.push(obj);

            // Don't scroll the page when scrolling to zoom
            if (event.preventDefault) {
                event.preventDefault();
            } else{
                event.stop();
            };
            // Darn, none of this stuff is working in Firefox to prevent the window from catching the scroll events.
            event.returnValue = false;
            event.stopPropagation();
            return false;
        });
    },

    // DocumentX and documentY indicate the point about which to zoom in (it stays fixed),
    // where the point is in terms of an absolute location. Duration of animation is in ms, if not set
    // zoom will be instantaneous.
    zoomFixedPoint: function(documentX, documentY, newScale, duration) {
        var viewBox = App.wrapper.viewBox;
        var oldW = viewBox.width/App.wrapper.scale;
        var oldH = viewBox.height/App.wrapper.scale;
        var oldScale = App.wrapper.scale;

        // Most zoomed out you can get is seeing the whole tree. No limit on most zoomed in for now.
        App.wrapper.scale = Math.max(newScale,App.wrapper.minScale);

        // Don't show panning cursor if zoomed all the way out
        if (App.wrapper.scale == App.wrapper.minScale) {
            this.sprite.node.style.cursor = "auto";
        } else {
            this.sprite.node.style.cursor = "move";
        }

        // Calculate new view box
        var newX = (viewBox.xx - documentX)*oldScale/App.wrapper.scale + documentX;
        var newY = (viewBox.yy - documentY)*oldScale/App.wrapper.scale + documentY;
        var newW = App.wrapper.absWidth/App.wrapper.scale;
        var newH = App.wrapper.absHeight/App.wrapper.scale;

        // Clamp to bg area
        if (newX/App.wrapper.minScale + newW > App.wrapper.absWidth/App.wrapper.minScale) {
            newX = App.wrapper.absWidth - newW*App.wrapper.minScale;
        }
        if (newX < 0) {
            newX = 0;
        }
        if (newY/App.wrapper.minScale + newH > App.wrapper.absHeight/App.wrapper.minScale) {
            newY = App.wrapper.absHeight - newH*App.wrapper.minScale;
        }
        if (newY < 0) {
            newY = 0;
        }

        if (isNaN(newX) || isNaN(newY)) {
            console.log("is nan!");
            console.log(newX, newY, viewBox.xx, viewBox.yy, documentX, documentY, App.wrapper.scale, oldScale);
            return;
        }

        if (duration && duration > 0) {
            App.paper.animateViewBox(viewBox.xx, viewBox.yy, oldW, oldH, newX, newY, newW, newH, duration);
        } else {
            App.paper.setViewBox(newX, newY, newW, newH);
        }

        if (App.version == 1) {
            var fade = Math.min(1,Math.max(.25,1/.3*(App.wrapper.minScale/App.wrapper.scale-.4)));
            App.wrapper.backdrop.fadeSprite.attr('opacity',fade);
            App.wrapper.backdrop.showSprite.attr('opacity',1-fade);
        }

        viewBox.xx = newX;
        viewBox.yy = newY;
    },

    zoomCentered: function(scale) {
        var viewBox = App.wrapper.viewBox;
        var docX = viewBox.xx + viewBox.width/App.wrapper.scale*App.wrapper.minScale/2;
        var docY = viewBox.yy + viewBox.height/App.wrapper.scale*App.wrapper.minScale/2;
        this.zoomFixedPoint(docX, docY, scale, 250);
    },
});