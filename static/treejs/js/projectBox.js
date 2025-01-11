"use strict";

App.ProjectView = App.RaphaelView.extend({
    initialize: function() {
        this.paper = App.paper;
        this.loveFaveSprite = App.paper.set(); // The stars and hearts
        this.boxSprite = App.paper.set(); // The project box
        this.sprite = App.paper.set();
        this.sprite.push(this.loveFaveSprite);
        this.sprite.push(this.boxSprite);
        this.render(this.options.branch.model);
    },

    render: function(b) {
        var that = this;
        var posx = -b.absPositionX()-b.upHingeX();
        var posy = -b.absPositionY()-b.upHingeY();
        this.posx = posx;
        this.posy = posy;
        var scale = b.get('scale');
        var w = App.projectBoxSvg.w;
        var h = App.projectBoxSvg.h;
        var puffFactor = App.projectBoxSvg.puffFactor;
        var glowColor = App.projectBoxSvg.glowColor;
        var authTextFontSize = App.projectBoxSvg.authTextFontSize;
        var projTextFontSize = App.projectBoxSvg.projTextFontSize;
        var textColor = App.projectBoxSvg.textColor;

        var unhoverH = h*scale; // Height of the project image by default
        var unhoverW = w*scale;
        var hoverH = function() {
            var ans = h*puffFactor/App.wrapper.scale; // Height of the project image when hovered (only the image, not the surrounding container)
            if (ans < unhoverH)
                return unhoverH;
            return ans;
        }
        var hoverW = function() {
            var ans = w*puffFactor/App.wrapper.scale;
            if (ans < unhoverW)
                return unhoverW;
            return ans;
        }

        var imageLoc;
        var c = b.get('content')[b.get('id')];
        var projectid = b.get('id');
        var title = c.title;
        var creator = c.username;
        if (creator === undefined) {
            creator = c.creator; // Variable name is stored inconsistently.
        }
        var projectVisible = (c.visibility == 'visible' && c.is_published != false);
        if (projectVisible) {
            // Last part of URL must be 4 letters long. Ensure that the number is long enough.
            var s = "000"+projectid.toString();
            imageLoc = Scratch.INIT_DATA.GLOBAL_URLS['media_url']+"/projects/thumbnails/"+Math.floor(projectid/10000)+"/"+s.substr(s.length-4)+".png";
        } else {
            imageLoc = Scratch.INIT_DATA.GLOBAL_URLS['static_url']+"/treejs/img/private_cat.png";
        }
        var sprite = this.sprite;

        var origHeart = this.paper.path(App.loveitSvg.path);
        origHeart.attr({
            'stroke-opacity':0,
        });
        var colorOptions = ['f','e','d','c','b','a']; // "blackness"
        var maxIndicators = 20;
        var distMultX = .5;
        var distMultY = .5;
        for (var i = 0; i < c.love_count && i < maxIndicators; i++) { // Don't show more than maxIndicators; it's just a rough visual indication and shouldn't slow down performance.
            var heart = origHeart.clone();
            this.loveFaveSprite.push(heart);
            var randColor = colorOptions[Math.floor(Math.random()*colorOptions.length)];
            var rand2 = Math.floor(Math.random()*4); // "whiteness"
            heart.attr({
                fill:"#"+randColor+randColor+rand2+rand2+rand2+rand2,
            });

            var heartRelativeAngle = Math.random()*Math.PI/2; // Somewhere on an ellipse
            var heartx = unhoverW*Math.cos(heartRelativeAngle)*distMultX+heart.getBBox().width/2;
            if (Math.round(Math.random()) == 0) heartx = -heartx;
            var hearty = unhoverH*Math.sin(heartRelativeAngle)*distMultY+heart.getBBox().height/2;
            if (Math.round(Math.random()) == 0) hearty = -hearty;
            var heartAngle = 180;
            if (heartx > 0) heartAngle = Math.floor(Math.random()*16-8)-90+Raphael.deg(Math.atan((unhoverH/4+hearty)/heartx));
            if (heartx < 0) heartAngle = Math.floor(Math.random()*16-8)+90+Raphael.deg(Math.atan((unhoverH/4+hearty)/heartx));
            heart.transform("t"+(posx+heartx-heart.getBBox().width/2)+","+(posy+hearty-heart.getBBox().height/2));
            heart.transform("...r"+heartAngle);
            heart.transform("...s1.3");

            distMultX *= 1.04; // Leaves thin out with distance
            distMultY *= 1.02;
        }
        origHeart.remove();

        /* Don't show stars Mitch thinks it's messy
        // Chose stars on top because there are usually fewer of them
        var origStar = this.paper.path(App.faveSvg.path);
        origStar.attr({
            'stroke-opacity':0,
        });
        distMultX = .5;
        distMultY = .5;
        var colorOptionsStar = ['f','e','d'];
        for (i = 0; i < c.favorite_count && i < maxIndicators; i++) {
            var star = origStar.clone();
            this.loveFaveSprite.push(star);
            var randColor = colorOptionsStar[Math.floor(Math.random()*colorOptionsStar.length)];
            var rand2 = Math.floor(Math.random()*8);
            star.attr({
                fill:"#"+randColor+randColor+"d6"+rand2+rand2,
            });

            var starRelativeAngle = Math.random()*Math.PI/2;
            var starx = unhoverW*Math.cos(starRelativeAngle)*distMultX+star.getBBox().width/2;
            if (Math.round(Math.random()) == 0) starx = -starx;
            var stary = unhoverH*Math.sin(starRelativeAngle)*distMultY+star.getBBox().height/2;
            if (Math.round(Math.random()) == 0) stary = -stary;
            star.transform("t"+(posx+starx-star.getBBox().width/2)+","+(posy+stary-star.getBBox().height/2));
            //star.transform("...s1.2");

            distMultY *= 1.01;
            distMultX *= 1.03;
        }
        origStar.remove();
        */

        var projectBox = this.paper.image(imageLoc);
        that.focusTarget = projectBox; // for other classes to put the glow on
        projectBox.attr({
            x:-w/2*scale+posx,
            y:-h/2*scale+posy,
            width:w*scale,
            height:h*scale,
        });
        projectBox.toFront();

        var outline = this.paper.rect();
        that.hoverTarget = outline; // for other classes to pull the event catcher to the front
        outline.attr({
            x:-w/2*scale+posx,
            y:-h/2*scale+posy,
            width:w*scale,
            height:h*scale,
            r:2*scale,
            // 'stroke-width': scale,
            'stroke':App.projectBoxSvg.strokeColor,
            'fill':App.projectBoxSvg.fillColor,
            'fill-opacity':0,
        });
        if (projectVisible) {
            outline.attr({
                href: "/projects/"+projectid+"/"
            })
            outline.node.onclick = function() {
                on_click_projectbox(App.root_id,window.location.pathname, "/projects/"+projectid+"/", b.get("id"));
            }
        }
        outline.toFront();
        this.boxSprite.push(projectBox);
        this.boxSprite.push(outline);

        var dupOutline;
        var detailBoxPadding = function() {
            return App.projectBoxSvg.detailBoxPadding/App.wrapper.scale;
        }
        var detailBoxPadding2 = App.projectBoxSvg.detailBoxPadding;
        var projectName;
        var authorName;
        var container;
        var contX, contY, contW, contH;
        var hovered = false;
        var loveit;
        var loveText;
        var fave;
        var faveText;

        var hoverIn = function(firstTime) {
            // Don't activate hover while dragging
            if (App.wrapper.draggingActive == true) {
                return;
            }

            // Don't activate if already hovering over
            if (hovered == true) {
                return;
            }

            hovered = true;
            navData.push({type:"I", project:b.get("id"), time:new Date().getTime()});

            // Set to contain popup
            var detailBox = App.paper.set();

            // Remove glow from previous focus and apply new glow
            if (App.wrapper.focused != false) {
                App.wrapper.focused.g.remove();
            }
            projectBox.g = projectBox.glow({
                color: glowColor,
                width: 20,
                opacity: 1
            });
            that.boxSprite.push(projectBox.g);

            App.wrapper.focused = projectBox;

            // Close previous hover if for some reason it's still open and set this to hoverActive
            if (App.wrapper.hoverActive != false) {
                App.wrapper.hoverActive[1].inBounds = false; // Fix hoverInBounds state if hoverInBounds.js is in use
                App.wrapper.hoverActive[0].hoverOut(); // Run callback; close last box
            }
            App.wrapper.hoverActive = [that,this];

            var hoverInTime = 100; //ms for project box to blow up

            // Create detail box components
            dupOutline = outline.clone();
            dupOutline.animate({
                x:posx-hoverW()/2,
                y:posy-hoverH()/2,
                width:hoverW(),
                height:hoverH(),
            },hoverInTime);

            // If project visible, show author and title.
            var authorText = projectVisible ? "by "+creator : "No longer available";
            var titleText = projectVisible ? title : " ";

            authorName = $('<p id="authorName" class="overText"></p>').text(authorText);;
            authorName.appendTo('#textOverlay');
            projectName = $('<p id="projectName" class="overText boldText"></p>').text(titleText);
            projectName.appendTo('#textOverlay');

            var authWidth = $('#authorName').width();
            var authHeight = $('#authorName').height();
            var authX;
            if (authWidth > App.wrapper.scale*hoverW()-2/5*detailBoxPadding2) {
                authX = App.wrapper.scale*(posx - hoverW()/2);
            } else {
                authX = App.wrapper.scale*posx - authWidth/2;
            }
            var authY = App.wrapper.scale*(posy - hoverH()/2) - authHeight - 2/5*detailBoxPadding2;

            var projWidth = $('#projectName').width();
            var projHeight = $('#projectName').height();
            var projX;
            if (projWidth > App.wrapper.scale*hoverW()-2/5*detailBoxPadding2) {
                projX = App.wrapper.scale*(posx - hoverW()/2);
            } else {
                projX = App.wrapper.scale*posx - projWidth/2;
            }
            var projY = authY - projHeight - 1/5*detailBoxPadding2;

            authorName.css('color',textColor);
            projectName.css('color',textColor);

            // Project stats
            // Show project stats if loves and faves aren't both 0
            var showProjectStats = (c.hasOwnProperty('love_count') && c.hasOwnProperty('favorite_count') && (c.love_count > 0 || c.favorite_count > 0));
            // Don't show project stats if project not visible
            showProjectStats = projectVisible ? showProjectStats : false;
            if (showProjectStats) {
                fave = this.paper.path(App.faveSvg.path);
                fave.attr({
                    fill:App.scratchColors.black,
                    'stroke-opacity':0
                });
                var favX = posx - hoverW()/2;
                var favY = posy + hoverH()/2+ detailBoxPadding()/2;
                fave.transform("...t"+favX+","+favY);
                fave.transform("...s"+1/App.wrapper.scale+","+1/App.wrapper.scale+",0,0");
                faveText = this.paper.print(0,0," "+c.favorite_count,this.paper.getFont("NotoSans"),authTextFontSize/App.wrapper.scale,"baseline");
                var faveTextX = favX+fave.getBBox().width;
                var faveTextY = favY+(fave.getBBox().height+faveText.getBBox().height)/2;
                faveText.transform("t"+faveTextX+","+faveTextY);

                loveit = this.paper.path(App.loveitSvg.path);
                loveit.attr({
                    fill:App.scratchColors.black,
                    'stroke-opacity':0
                });
                var lovX = favX + fave.getBBox().width+faveText.getBBox().width + detailBoxPadding()*3;
                var lovY = favY;
                loveit.transform("...t"+lovX+","+lovY);
                loveit.transform("...s"+1/App.wrapper.scale+","+1/App.wrapper.scale+",0,0");
                loveText = this.paper.print(0,0," "+c.love_count,this.paper.getFont("NotoSans"),authTextFontSize/App.wrapper.scale,"baseline");
                loveText.transform("t"+(lovX+loveit.getBBox().width)+","+faveTextY);
            }

            // Extra space to leave to show stats
            var statsSpace;
            if (showProjectStats)
                statsSpace = Math.max(loveit.getBBox().height, loveText.getBBox().height);
            else
                statsSpace = 0;

            // Container is the white background to the popup
            container = outline.clone();

            // While dupeOutline plays the old role of outline, outline
            // transparently covers the entire popup to allow it to act as one link
            // and hover item. This trick is necessary to detect hover events accurately
            // on the popup, but means we can only have 1 hyperlink, and outline's node
            // does get and remain reordered.
            outline.attr({
                'stroke-opacity': 0
            });

            // Project box becomes larger
            projectBox.g.hide();
            projectBox.stop();
            projectBox.animate({
                x:posx-hoverW()/2,
                y:posy-hoverH()/2,
                width:hoverW(),
                height:hoverH(),
            },hoverInTime);

            // Bring group forward
            projectBox.toFront();
            dupOutline.toFront();
            detailBox.push(projectBox);
            detailBox.push(dupOutline);
            detailBox.push(projectName);
            detailBox.push(authorName);
            detailBox.push(container);

            if (showProjectStats) {
                loveit.toFront();
                fave.toFront();
                loveText.toFront();
                faveText.toFront();
                detailBox.push(loveit);
                detailBox.push(fave);
                detailBox.push(loveText);
                detailBox.push(faveText);
            }

            contX = posx-hoverW()/2-detailBoxPadding();
            contY = posy-hoverH()/2-(projHeight+authHeight+detailBoxPadding2)/App.wrapper.scale;
            contW = hoverW()+2*detailBoxPadding();
            contH = hoverH()+(projHeight+authHeight+2*detailBoxPadding2)/App.wrapper.scale+statsSpace;

            container.attr({
                x:contX,
                y:contY,
                width:contW,
                height:contH,
                //'stroke-width': 1,
                r:5/App.wrapper.scale
            });

            // Outline is the event catcher so it should be on top
            outline.toFront();

            var offsetX = 0;
            var offsetY = 0;
            // Make sure it's not falling off the canvas. Prefer to align top left
            if (contY + contH > App.wrapper.viewBox.yy + App.wrapper.minHeight/App.wrapper.scale) {
                offsetY = App.wrapper.viewBox.yy + App.wrapper.minHeight/App.wrapper.scale - contH - contY;
            }
            if (contX + contW > App.wrapper.viewBox.xx + App.wrapper.minWidth/App.wrapper.scale) {
                offsetX = App.wrapper.viewBox.xx + App.wrapper.minWidth/App.wrapper.scale - contW - contX;
            }
            if (contY < App.wrapper.viewBox.yy) {
                offsetY = -contY+App.wrapper.viewBox.yy;
            }
            if (contX < App.wrapper.viewBox.xx) {
                offsetX = -contX+App.wrapper.viewBox.xx;
            }
            detailBox.transform('...t'+offsetX+','+offsetY);

            authorName.css({
                "left":(authX+(-App.wrapper.viewBox.xx+offsetX)*App.wrapper.scale)+"px",
                "top":(authY+(-App.wrapper.viewBox.yy+offsetY)*App.wrapper.scale)+"px",
                "width":hoverW()*App.wrapper.scale-2/5*detailBoxPadding2+"px",
            });

            projectName.css({
                "left":(projX+(-App.wrapper.viewBox.xx+offsetX)*App.wrapper.scale)+"px",
                "top":(projY+(-App.wrapper.viewBox.yy+offsetY)*App.wrapper.scale)+"px",
                "width":hoverW()*App.wrapper.scale-2/5*detailBoxPadding2+"px",
            });

            container.animate({
                'fill-opacity':1
            },
            hoverInTime,
            function() {
                container.g = container.glow({
                    color: glowColor,
                    width: 20
                });
            });

            detailBox.push(container.g);

            if  (firstTime == true) {
                // Behavior for first hover (when you highlightActive in treeViews and didn't mouse over initially); make it so hovering off of the whole container area activates hoverOut, rather than just the center.
                outline.attr({
                    'x':contX,
                    'y':contY,
                    'width':contW,
                    'height':contH,
                });
            }
        };

        var onInitialHoverOut = function() {
            outline.attr({
                x:-w/2*scale+posx,
                y:-h/2*scale+posy,
                width:w*scale,
                height:h*scale,
            });
            outline.hover(hoverIn, hoverOut);
            hoverOut();
        };

        var hoverOut = function() {
            if (hovered == false) {
                return;
            }

            hovered = false;
            navData.push({
                type:"O",
                project:b.get("id"),
                time:new Date().getTime()
            });

            // Remove info
            authorName.remove();
            projectName.remove();

            dupOutline.remove();
            // For some reason the glow doesn't get removed when project is not visible
            if (!projectVisible && container.g) container.g.remove();
            if (loveit) loveit.remove();
            if (fave) fave.remove();
            if (loveText) loveText.remove();
            if (faveText) faveText.remove();

            container.remove();

            var hoverOutTime = 100;
            outline.attr({
                x:-w/2*scale+posx,
                y:-h/2*scale+posy,
                width:w*scale,
                height:h*scale,
            });
            projectBox.transform('T0,0');
            projectBox.stop();
            projectBox.animate({
                x:-w/2*scale+posx,
                y:-h/2*scale+posy,
                width:w*scale,
                height:h*scale,
            }, hoverOutTime, function() {
              outline.attr({
                'stroke-opacity':1
              });
              projectBox.g.show();
            });

            App.wrapper.hoverActive = false;
        };
        this.hoverIn = hoverIn;
        this.hoverOut = onInitialHoverOut;

        outline.hover( hoverIn, onInitialHoverOut );

    },

});