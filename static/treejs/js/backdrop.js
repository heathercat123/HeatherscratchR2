"use strict";

App.Backdrop = App.RaphaelView.extend({
    initialize: function() {
        this.fadeSprite = App.paper.set();
        this.showSprite = App.paper.set();
        this.render();
    },

    render: function() {
        // Draw the backdrop. Currently just white, but could show other trees or project-specific data
        this.bg = App.paper.rect(0,0,App.wrapper.absWidth+1,App.wrapper.absHeight+1); //+1 because it seems to miss a pixel in some browsers
        this.bg.attr({
            fill: App.scratchColors.offwhite,
            'stroke-opacity':0,
        });

        if (App.version == 1) {
            // Covering the original bg, but fades off
            this.bg2 = App.paper.rect(0,0,App.wrapper.absWidth+1,App.wrapper.absHeight+1);
            this.bg2.attr({
                fill:'270-#a181ff:0-#aba0ff:10-#b3beff:30-#ffe1f6:90-#ffd3e9:100',
                'stroke-opacity':0
            });
            this.fadeSprite.push(this.bg2);
            this.ground = App.paper.path(App.groundSvg.path);
            this.fadeSprite.push(this.ground);
            this.ground.attr({
                fill: App.scratchColors.black,
                'stroke-opacity':0
            });
            this.ground.transform("T"+App.wrapper.rootX+","+App.wrapper.rootY);

            /* Looks kinda weird
            this.grass = App.paper.path(App.grassSvg.path);
            this.fadeSprite.push(this.grass);
            this.grass.attr({
                fill: App.scratchColors.black,
                'stroke-opacity':0
            });
            this.grass.transform("T"+App.wrapper.rootX+","+App.wrapper.rootY);
            */

            this.bg.toFront();
            this.showSprite.push(this.bg);
            this.showSprite.attr ({
                opacity: 0,
            });

            this.cloud1 = App.paper.path(App.bigCloudSvg.path);
            this.cloud1.attr("fill","#ffffff");
            this.cloud1.attr("fill-opacity",".35");
            this.cloud1.attr("stroke-opacity","0");
            var x = Math.random()*(App.wrapper.absWidth - App.wrapper.minWidth);
            var y = Math.random()*(App.wrapper.absHeight - App.wrapper.minHeight);
            this.cloud1.transform('t'+x+','+y);
            this.fadeSprite.push(this.cloud1);


            this.cloud2 = App.paper.path(App.smallCloudSvg.path);
            this.cloud2.attr("fill","#ffffff");
            this.cloud2.attr("fill-opacity",".3");
            this.cloud2.attr("stroke-opacity","0");
            x = Math.random()*(App.wrapper.absWidth - App.wrapper.minWidth);
            y = Math.random()*(App.wrapper.absHeight - App.wrapper.minHeight);
            this.cloud2.transform('t'+x+','+y);
            this.fadeSprite.push(this.cloud2);

        }
    }
});

App.NotFoundBackdrop = App.RaphaelView.extend({
    initialize: function() {
        this.sprite = App.paper.set();
        this.render();
    },

    render: function() {
        // Draw the backdrop. Currently just white, but could show other trees or project-specific data
        this.bg = App.paper.rect(0,0,App.wrapper.absWidth+1,App.wrapper.absHeight+1); //+1 because it seems to miss a pixel in some browsers
        this.bg.attr({
            fill:'#fffcff',
            'stroke-opacity':0
        });

        var imgW = 170;
        var imgH = 179;
        var img = App.paper.image("/scratchr2/static/images/private_cat.png",App.wrapper.absWidth/2-imgW/2,App.wrapper.margins,imgW,imgH);

        var textPath = App.paper.print(App.wrapper.absWidth/2,App.wrapper.absHeight/2,"No remix data was found for this project!",App.paper.getFont("NotoSans",700),32);
        textPath.transform('t-'+textPath.getBBox().width/2+',0');
        textPath.attr({
            'fill': App.projectBoxSvg.textColor
        });

        this.sprite.push(this.bg);
        this.sprite.push(this.img);
        this.sprite.push(this.textPath);
    }
});