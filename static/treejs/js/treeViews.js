"use strict";

//Models and views related to the tree

App.BranchView = App.RaphaelView.extend({

    initialize: function(parent) {
        this.parent = this.options.parent;
        this.myBranches;
        this.paper = App.paper;
        this.sprite = this.paper.set();
        this.branchSprites = this.paper.set();
        this.model = this.options.model;
        this.render();
    },

    render: function() {
        this.branchSvg = this.model.branchSvg;
        this.draw();
    },

    resetBranches: function() {
        if (this.branchSprites) {
            this.branchSprites.remove();
        }
        this.branchSprites = this.paper.set();
        this.myBranches = [];
    },

    draw: function() {
        this.branchBody = this.paper.path(this.branchSvg.path);
        this.branchBody.attr({
            fill: this.branchSvg.fillColor,
            stroke: this.branchSvg.strokeColor,
            'stroke-width': this.model.get('scale'),
        });

        // So they don't pointlessly interfere with pan and zoom
        this.branchBody.node.setAttribute("pointer-events", "none");

        this.myBranches = [];
        for (var j = 0; j < this.model.myBunches[this.model.activeBunch].bunch.length; j++) {
            var b = new App.BranchView({model: this.model.myBunches[this.model.activeBunch].bunch[j], parent: this});
            this.myBranches.push(b);
            this.branchSprites.push(b.sprite);
        }
        this.sprite.push(this.branchSprites);

        this.sprite.push(this.branchBody);
    },

    doTranslate: function() {
        this.sprite.transform("..."+this.model.get('doTranslate'));
        for (var i = 0; i < this.myBranches.length; i++){
            var b = this.myBranches[i];
            b.doTranslate();
        }
    },

    doRotate: function() {
        this.sprite.transform("..."+this.model.get('doRotate'));
        for (var i = 0; i < this.myBranches.length; i++){
            var b = this.myBranches[i];
            b.doRotate();
        }
    },

    doScale: function() {
        for (var i = 0; i < this.myBranches.length; i++){
            var b = this.myBranches[i];
            b.sprite.transform("..."+b.model.get('doScale'));
            b.doScale();
        }
    },
});

App.RootView = App.BranchView.extend({
    render: function() {
        if (this.model.myBunches.length == 0) {
            this.drawNotFoundBackdrop();
            $('#zoomContainer').remove(); // Can't zoom
            return;
        }
        App.rootView = this;
        this.branchSvg = this.model.branchSvg;
        this.drawMask();
        this.drawBackdrop();
        this.drawTree();
        this.highlightFocus(this.options.focus);
    },

    highlightFocus: function(focus) {
        var branches = new Array();

        branches.push(this);

        while(branches.length > 0){
            var b = branches.pop();

            var projectid = b.model.get('id');
            // If this is the project whose pid is in the url
            if (projectid == focus) {
                // Make it automatically have glow and focus
                b.projectBox.focusTarget.g = b.projectBox.focusTarget.glow({
                    color: App.projectBoxSvg.glowColor,
                    width: 20,
                    opacity: 1
                });
                b.projectBox.focusTarget.toFront();
                b.projectBox.hoverTarget.toFront();
                b.projectBox.boxSprite.push(b.projectBox.focusTarget.g);
                App.wrapper.focused = b.projectBox.focusTarget;

                // Zoom in on it
                App.wrapper.panBox.zoomFixedPoint(b.projectBox.posx, b.projectBox.posy, 1/b.model.get('scale'), 300);

                // Show its info box
                b.projectBox.hoverIn(true);

                // There is only one focus so we're done
                return;
            }

            for (var i = 0; i < b.myBranches.length; i++){
                branches.push(b.myBranches[i]);
            }
        }
    },

    // B is the branch from which to start the drawing (draw all b's children but not b); this allows us to redraw a subtree
    redrawTree: function(startBranch) {
        startBranch.myBranches = [];
        for (var j = 0; j < startBranch.model.myBunches[startBranch.model.activeBunch].bunch.length; j++) {
            var b = new App.BranchView({model: startBranch.model.myBunches[startBranch.model.activeBunch].bunch[j], parent: startBranch});
            startBranch.myBranches.push(b);
            startBranch.branchSprites.push(b.sprite);
        }
        startBranch.sprite.push(startBranch.branchSprites);

        for (var i = 0; i < startBranch.myBranches.length; i++) {
            var b = startBranch.myBranches[i];
            var m = startBranch.myBranches[i].model;

            b.sprite.transform('');
            b.sprite.transform("t"+(startBranch.model.absPositionX())+","+(startBranch.model.absPositionY()));
            b.doTranslate(); // Translate this branch, which recursively translates subbrances
            b.doScale(); // Scale this branch, ...
            b.sprite.transform('...s'+(m.get('scale'))+(m.get('scale'))+' 0 0');
            b.doRotate(); // Rotate this branch, ...

            // Flip the tree over
            b.sprite.transform('r180 0 0...');
            b.sprite.transform("...r"+startBranch.model.absAngle+" 0 0");
            this.sprite.push(b.sprite);

        }

        var boxSprites = App.paper.set();
        for (var i = 0; i < startBranch.myBranches.length; i++) {
            var b = startBranch.myBranches[i];
            this.drawPageturners(b); // Draw page turners
            var newBoxSprites = this.drawProjectBoxes(b); // Create the project boxes
            boxSprites.push(newBoxSprites);
        }
        boxSprites.toFront(); // Bring all project boxes in front of hearts and stars

        // Bring parent branch's project box to front so it is not blocked by child branches
        startBranch.pageturners.sprite.toFront();
        startBranch.projectBox.sprite.toFront();
        if (startBranch.pageturners)
            startBranch.pageturners.update();
    },

    drawTree: function() {
        var b = this;
        b.draw(); // Draw this branch, which recursively draws subbranches

        b.sprite.transform("T0,0");
        b.doTranslate(); // Translate this branch, which recursively ...
        b.doScale(); // Scale this branch, ...
        b.doRotate(); // Rotate this branch, ...
        this.drawPanBox(); // Create the rect that deals with pan and scroll

        // Flip the tree over
        this.sprite.transform('r180 0 0...');
        this.drawPageturners(b); // Draw page turners
        var boxSprites = this.drawProjectBoxes(b); // Create the project boxes
        boxSprites.toFront(); // Bring all project boxes in front of hearts and stars
    },

    drawBackdrop: function() {
        App.wrapper.backdrop = new App.Backdrop();
    },

    drawNotFoundBackdrop: function() {
        App.wrapper.backdrop = new App.NotFoundBackdrop();
    },

    drawPanBox: function() {
        App.wrapper.panBox = new App.PanBox();
    },

    drawMask: function() {
        App.wrapper.mask = new App.Mask();
    },

    drawProjectBoxes: function(startBranch) {
        var branches = new Array();
        var boxSprites = this.paper.set();

        branches.push(startBranch);

        while(branches.length > 0){
            var b = branches.pop();

            for (var i = 0; i < b.myBranches.length; i++){
                branches.push(b.myBranches[i]);
            }

            b.projectBox = new App.ProjectView({branch: b});
            b.sprite.push(b.projectBox.sprite);
            boxSprites.push(b.projectBox.boxSprite);
        }
        return boxSprites;
    },

    drawPageturners: function(startBranch) {
        var leaves = new Array();
        leaves.push(startBranch);
        while(leaves.length > 0){
            var b = leaves.pop();

            for (var i = 0; i < b.myBranches.length; i++){
                leaves.push(b.myBranches[i]);
            }

            if (b.model.myBunches.length > 1) {
                b.pageturners = new App.Pageturner({branch: b});
                b.sprite.push(b.pageturners.sprite);
            }
        }
    }
});

//Basic TreeView
//It is referenced from the html template
App.TreeView = Backbone.View.extend({
    initialize:function() {
        this.render();
    },

    render:function() {
        this.el.id = 'treeView';
        $("#tree").html("");
        $("#tree").append(this.el);
        return this;
    },

});

//Text overlay, so that we don't have to use print in Raphael and have sad loading times
App.TextOverlay = Backbone.View.extend({
    initialize:function() {
        this.render();
    },

    render:function() {
        this.el.id = 'textOverlay';
        $("#tree").append(this.el);
        return this;
    },

});
