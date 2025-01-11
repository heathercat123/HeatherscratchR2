"use strict";

// A View that renders a Raphael paper
//Raphael paper is the canvas that allows us to render various SVG elements by calling
//methods such as paper.circle() or paper.path()
App.RaphaelPaper = Backbone.View.extend({
    minWidth: 940,
    minHeight: 500,
    margins: 100,
    bottomMargin: 50,
    absWidth: 0,
    absHeight: 0,
    rootX: 0,
    rootY: 0,
    paper: null,
    scale: 1,
    minScale: 1,
    focused: false,        // "Focused" on project (the one carrying glow)
    hoverActive: false,    // whether a project has hover over active right now
    draggingActive: false, // whether dragging backdrop currently occuring

    // This is called when the view element was inserted into the DOM
    render: function() {
        $("#treeView").append(this.el);
        this.el.id='paper';
        this.paper = Raphael(this.el.id, this.absWidth, this.absHeight);
        App.paper = this.paper;
        this.minScale = Math.min(this.minWidth/this.absWidth, this.minHeight/this.absHeight);
        this.scale = this.minScale;
        var ox = 0, oy = 0;
        this.viewBox = App.paper.setViewBox(ox, oy, App.wrapper.absWidth/App.wrapper.minScale, App.wrapper.absHeight/App.wrapper.minScale);
        this.viewBox.xx = ox;
        this.viewBox.yy = oy;

        return this;
    },

    zoomEqual: function() {
        this.closeHover()
        navData.push({type:"ZE", time:new Date().getTime()});
        this.panBox.zoomCentered(this.minScale);
    },

    zoomOut: function() {
        this.closeHover();
        navData.push({type:"ZO", time:new Date().getTime()});
        this.panBox.zoomCentered(this.scale*.8);
    },

    zoomIn: function() {
        this.closeHover();
        navData.push({type:"ZI", time:new Date().getTime()});
        this.panBox.zoomCentered(this.scale*1.2);
    },

    closeHover: function() {
        // Close projectbox hover if for some reason it's still open
        if (App.wrapper.hoverActive != false) {
            App.wrapper.hoverActive[1].inBounds = false; // Fix hoverInBounds state if hoverInBounds.js is in use
            App.wrapper.hoverActive[0].hoverOut(); // Run callback; close last box
        }
        App.wrapper.hoverActive = false;
    }
});

//This is a base class for all other views that render Raphael objects
//We subclass RaphaelView so we can just call this.get("paper").path("Some path..")
//in other views to render ourselves
App.RaphaelView = Backbone.View.extend({
    //The sprite that was rendered onto the paper
    sprite: null,
    //If the view is getting destroyed we need to remove the rendered sprite
    willDestroyElement: function(){
        if(this.get("sprite")) this.get("sprite").remove();
    },
});
