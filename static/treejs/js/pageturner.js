"use strict";

App.Pageturner = App.RaphaelView.extend({

    svg: App.turnerSvg,
    disable: false,
    leftHover: false,
    rightHover: false,

    initialize: function() {
        this.paper = App.paper;
        this.sprite = App.paper.set();
        this.b = this.options.branch.model;
        this.bView = this.options.branch;
        this.render();
    },

    render: function() {
        var thiss = this;
        var b = this.b;
        var posx = -b.absPositionX()-b.upHingeX();
        var posy = -b.absPositionY()-b.upHingeY();
        this.posx = posx;
        this.posy = posy;
        var svg = this.svg;
        var scale = b.get('scale')*svg.falloff;
        var puffFactor = svg.puffFactor;

        var sprite = this.sprite;
        this.leftLeaf = this.paper.path(svg.path);
        this.leftLeaf.attr({
            fill: svg.fillColor,
            'fill-opacity': svg.fillOpacity,
            'stroke-dasharray': svg.strokeDashArray,
            stroke: svg.strokeColor,
            //  'stroke-width': scale
        });
        this.leftLeaf.transform('t'+posx+','+posy);
        this.leftLeaf.transform('...s'+scale+','+scale+',0,0');

        this.rightLeaf = this.leftLeaf.clone();

        var leafangle = (b.totalChildAngle()+b.branchSvg.minAngle)/2;
        this.leftLeaf.transform('...r'+(b.absAngle+180-leafangle)+',0,0');
        this.sprite.push(this.leftLeaf);
        this.rightLeaf.transform('...r'+(b.absAngle-180+leafangle)+',0,0');
        this.sprite.push(this.rightLeaf);

        this.leftBoxes = this.paper.set();
        this.rightBoxes = this.paper.set();
        var w = App.projectBoxSvg.w;
        var h = App.projectBoxSvg.h;
        this.w = w*scale;
        this.h = h*scale;
        this.box1 =  this.paper.rect();
        this.box1.attr({
            x:-w/2*scale+posx,
            y:-h/2*scale+posy,
            width:w*scale,
            height:h*scale,
            r:2*scale,
            //'stroke-width': scale,
            'fill':svg.fillColor,
            'stroke': svg.strokeColor,
            'opacity':svg.fillOpacity,
        });

        this.box4 = this.box1.clone();
        this.box1.transform('...t'+(svg.upHingeY*scale)*Math.cos(Raphael.rad(b.absAngle-90+leafangle))+','+(svg.upHingeY*scale)*Math.sin(Raphael.rad(b.absAngle-90+leafangle)));
        this.box2 = this.box1.clone();
        this.box1.transform('...t'+(-svg.boxOffsetX*scale)+','+(-svg.boxOffsetY*scale));
        this.box3 = this.box2.clone();
        this.box3.transform('...t'+(svg.boxOffsetX*scale)+','+(svg.boxOffsetY*scale));
        this.rightText = this.paper.set();
        this.rightTransform = this.box3.transform().toString();

        this.rightBoxes.push(this.box1);
        this.rightBoxes.push(this.box2);
        this.rightBoxes.push(this.box3);
        this.rightBoxes.push(this.rightText);

        this.box4.transform('...t'+(svg.upHingeY*scale)*Math.cos(Raphael.rad(b.absAngle-90-leafangle))+','+(svg.upHingeY*scale)*Math.sin(Raphael.rad(b.absAngle-90-leafangle)));
        this.box5 = this.box4.clone();
        this.box4.transform('...t'+(-svg.boxOffsetX*scale)+','+(-svg.boxOffsetY*scale));
        this.box6 = this.box5.clone();
        this.box6.transform('...t'+(svg.boxOffsetX*scale)+','+(svg.boxOffsetY*scale));
        this.leftText = this.paper.set();
        this.leftTransform = this.box6.transform().toString();

        this.box3.node.setAttribute("class","clickable");
        this.box6.node.setAttribute("class","clickable");

        this.leftBoxes.push(this.box4);
        this.leftBoxes.push(this.box5);
        this.leftBoxes.push(this.box6);
        this.leftBoxes.push(this.leftText);

        sprite.push(this.rightBoxes);
        sprite.push(this.leftBoxes);

        this.update();

        // right page turn
        var rightClickHandler = function(e) {
            // Do nothing if right click shouldn't be possible
            if (b.activeBunch == b.myBunches.length - 1 || thiss.disable) {
                return;
            }
            hoverOutRight();

            var rotation = -30;
            var steps = 1;
            var duration = 400;
            var newActiveBunch = thiss.b.activeBunch + 1;
            pageChangeAnimation(rotation, steps, duration, newActiveBunch);
        };

        // left page turn
        var leftClickHandler = function(e) {
            // Do nothing if left click shouldn't be possible
            if (b.activeBunch == 0 || thiss.disable) {
                return;
            }

            hoverOutLeft();

            var rotation = 30;
            var steps = 1;
            var duration = 400;
            var newActiveBunch = thiss.b.activeBunch - 1;
            pageChangeAnimation(rotation, steps, duration, newActiveBunch);
        };

        var pageChangeAnimation = function(rotation, steps, duration, newActiveBunch) {
            var b = thiss.b;

            // Disable turning until animation is over
            thiss.disable = true;

            // Clone b's current branches, animate them
            var sprite = thiss.bView.branchSprites;
            var copy = sprite.clone();

            // Pull mask to front to avoid unintentional mouseovers
            App.wrapper.mask.on();

            doRotationAnimation(copy, rotation, 0, steps, duration, function() {copy.remove()});

            // Unload b's branches
            thiss.bView.resetBranches();

            // Switch to b's next branches, then animate them.
            b.activeBunch = newActiveBunch;
            App.rootView.redrawTree(thiss.bView);

            sprite = thiss.bView.branchSprites;
            sprite.attr('opacity','0')

            // Pull mask to front again
            App.wrapper.mask.on();

            // so the animation doesn't interfere with the page turners
            thiss.bView.pageturners.sprite.toFront();
            thiss.bView.projectBox.sprite.toFront();
            thiss.bView.projectBox.focusTarget.toFront();
            thiss.bView.projectBox.hoverTarget.toFront();

            sprite.transform(getRotationString(-rotation));
            doRotationAnimation(sprite, rotation, 1, steps, duration ,function(){
                thiss.disable = false;
                App.wrapper.mask.off();

                // if glow was removed reset focus status
                if (App.wrapper.focused.node == null){
                    App.wrapper.focused = false;
                }

            });
        };

        // This is implemented as a chain of animations rather than a single animation,
        // because as the change is a transformation, a linear interpolation is used for the animation.
        // If for example the rotation is 180 degrees, the branches invert across the origin rather than
        // doing any rotation.
        //
        // However, it looks reasonable to use one step for small angles, and is much smoother. (Currently using this option)
        var doRotationAnimation = function(elem, rotation, opacity, steps, duration, callback, stepnum) {
            if (stepnum == undefined)
                stepnum = 1;

            if (stepnum > steps) {
                callback();
                return;
            }

            var ease = "linear";
            if (steps == 1) // Use fancy ease if there's only 1 step
                ease = ">";

            var setOpacity
            if (opacity == 0) // opacity from 1 to 0
                setOpacity = 1-stepnum/steps;
            else if (opacity == 1) // opacity from 0 to 1
                setOpacity = stepnum/steps;
            else
                throw "Unsupported opacity goal";

            elem.animate({transform: getRotationString(rotation/steps), opacity: setOpacity},
                         duration/steps,
                         ease,
                         function() {
                             doRotationAnimation(elem, rotation, opacity, steps, duration, callback, stepnum+1);
                         }
                        );

        }

        var getRotationString = function(deg) {
            return 'r'+deg+','+posx+','+posy+'...';
        }

        var hoverInLeft = function(e) {
            thiss.leftHover = true;
            thiss.updateLargeText(b,'l');

            var puffW = w*scale*puffFactor;
            var puffH = h*scale*puffFactor;

            var svg = thiss.svg;
            thiss.leftLeaf.attr({
                fill: svg.hoverFillColor,
                stroke: svg.hoverStrokeColor
            });

            thiss.leftBoxes.toFront();
            thiss.box4.animate({
                x:posx-puffW/2,
                y:posy-puffH/2,
                width:puffW,
                height:puffH,
            }, 100);
            thiss.box5.animate({
                x:posx-puffW/2,
                y:posy-puffH/2,
                width:puffW,
                height:puffH,
            }, 100);
            thiss.box6.animate({
                x:posx-puffW/2,
                y:posy-puffH/2,
                width:puffW,
                height:puffH,
            }, 100);
        };

        var hoverOutLeft = function(e) {
            // Close projectbox hover
            App.wrapper.closeHover();

            thiss.leftHover = false;
            if(thiss.box4.isVisible())
                thiss.updateSmallText(b,'l');

            var svg = thiss.svg;
            thiss.leftLeaf.attr({
                fill: svg.fillColor,
                stroke: svg.strokeColor
            });

            thiss.box4.animate({
                x:-w/2*scale+posx,
                y:-h/2*scale+posy,
                width:w*scale,
                height:h*scale,
                r:2*scale
            },
                               100);
            thiss.box5.animate({
                x:-w/2*scale+posx,
                y:-h/2*scale+posy,
                width:w*scale,
                height:h*scale,
                r:2*scale
            },
                               100);
            thiss.box6.animate({
                x:-w/2*scale+posx,
                y:-h/2*scale+posy,
                width:w*scale,
                height:h*scale,
                r:2*scale
            },
                               100);
        };

        var hoverInRight = function() {
            thiss.rightHover = true;
            thiss.updateLargeText(b,'r');

            var puffW = w*scale*puffFactor;
            var puffH = h*scale*puffFactor;

            var svg = thiss.svg;
            thiss.rightLeaf.attr({
                fill: svg.hoverFillColor,
                stroke: svg.hoverStrokeColor
            });

            thiss.rightBoxes.toFront();
            thiss.box1.animate({
                x:posx-puffW/2,
                y:posy-puffH/2,
                width:puffW,
                height:puffH,
            }, 100);
            thiss.box2.animate({
                x:posx-puffW/2,
                y:posy-puffH/2,
                width:puffW,
                height:puffH,
            }, 100);
            thiss.box3.animate({
                x:posx-puffW/2,
                y:posy-puffH/2,
                width:puffW,
                height:puffH,
            }, 100);
        };

        var hoverOutRight = function() {
            // Close projectbox hover
            App.wrapper.closeHover();

            thiss.rightHover = false;
            if(thiss.box1.isVisible())
                thiss.updateSmallText(b,'r');

            thiss.rightLeaf.attr({
                fill: svg.fillColor,
                stroke: svg.strokeColor
            });

            thiss.box1.animate({
                x:-w/2*scale+posx,
                y:-h/2*scale+posy,
                width:w*scale,
                height:h*scale,
                r:2*scale
            },
                               100);
            thiss.box2.animate({
                x:-w/2*scale+posx,
                y:-h/2*scale+posy,
                width:w*scale,
                height:h*scale,
                r:2*scale
            },
                               100);
            thiss.box3.animate({
                x:-w/2*scale+posx,
                y:-h/2*scale+posy,
                width:w*scale,
                height:h*scale,
                r:2*scale
            },
                               100);
        };

        this.box6.node.onclick = leftClickHandler;
        this.box3.node.onclick = rightClickHandler;

        this.box3.hover( hoverInRight, hoverOutRight );
        this.box6.hover( hoverInLeft, hoverOutLeft );
    },

    update: function() {
        var b = this.b;
        this.updateText(b,'r');
        this.updateText(b,'l');
        if (b.activeBunch == 0) {
            this.leftLeaf.hide();
            this.leftBoxes.hide();
            this.rightLeaf.show();
            this.rightBoxes.show();
        } else if (b.activeBunch == b.myBunches.length - 1) {
            this.rightLeaf.hide();
            this.rightBoxes.hide();
            this.leftLeaf.show();
            this.leftBoxes.show();
        } else {
            this.leftLeaf.show();
            this.leftBoxes.show();
            this.rightLeaf.show();
            this.rightBoxes.show();
        }
    },

    updateText:function(b, side) {
        if (side == 'r' && this.rightHover || side == 'l' && this.leftHover) {
            this.updateLargeText(b, side);
        } else if (side == 'r' || side == 'l') {
            this.updateSmallText(b, side);
        } else {
            throw "side must be 'l' or 'r'";
            return;
        }
    },

    updateSmallText:function(b, side) {
        var t, txt;
        if (side == "r") {
            t = this.rightText;
            var projectsToRight = b.activeBunch == b.myBunches.length-1 ? 0 : b.numChildren-b.projectsToLeft[b.activeBunch+1];
            txt = projectsToRight;
        } else if (side == "l") {
            t = this.leftText;
            txt = b.projectsToLeft[b.activeBunch];
        } else {
            throw "Side must be 'l' or 'r'";
            return;
        }
        this.textPositioner(txt, side, t, this.w, this.h);

    },

    updateLargeText:function(b, side) {
        var t, txt;
        if (side == "r") {
            t = this.rightText;
            var projectsToRight = b.activeBunch == b.myBunches.length-1 ? 0 : b.numChildren-b.projectsToLeft[b.activeBunch+1];
            txt = projectsToRight+" more >";
        } else if (side == "l") {
            t = this.leftText;
            txt = "< "+b.projectsToLeft[b.activeBunch]+" more";
        } else {
            throw "Side must be 'l' or 'r'";
            return;
        }

        var puffFactor = this.svg.puffFactor;
        var scale = b.get('scale')*this.svg.falloff;
        var w = App.projectBoxSvg.w*scale*puffFactor;
        var h = App.projectBoxSvg.h*scale*puffFactor;

        this.textPositioner(txt, side, t, w, h);

    },

    textPositioner:function(txt, side, parentSprite, parentW, parentH) {
        // Remove old text
        while (parentSprite.length > 0) {
            parentSprite.pop().remove();
        }

        // Create new text. Resize so that it fits in box.
        var textPath = this.paper.print(0,0,txt,this.paper.getFont("NotoSans"),20,"baseline");
        parentSprite.push(textPath);
        textPath.attr({
            fill:this.svg.textColor
        });
        var textOffsetX = textPath.getBBox().x;
        var textOffsetY = textPath.getBBox().y;
        var textOrigW = textPath.getBBox().width;
        var textOrigH = textPath.getBBox().height;
        var thiss = this
        var padding = function() {
            return App.turnerSvg.padding*thiss.b.get('scale');
        }
        var maxTextFraction = 1/2;
        var textPathScale = Math.min((parentW-2*padding())/textOrigW,(parentH*maxTextFraction-padding())/textOrigH);

        // Calculate coordinates of new path
        var x, y;
        if (side == 'l') {
            // Left align
            x = this.posx-textOffsetX-parentW/2+padding();
            textPath.transform(this.leftTransform);
        } else if (side == 'r') {
            // Right align
            x = this.posx-textOffsetX+parentW/2-textOrigW*textPathScale-padding();
            textPath.transform(this.rightTransform);
        }

        y = this.posy-textOffsetY+parentH/2-textOrigH*textPathScale-padding();
        textPath.transform('...t'+x+','+y);
        textPath.transform('...s'+textPathScale+','+textPathScale+','+(textOffsetX)+','+(textOffsetY));
    },

});