"use strict";

// Models based on new database format; to replace the ones in tree.js

App.BranchModel = Backbone.Model.extend({
    debug: false,
    angleL: 0,
    angleR: 0,
    childAngleL: 0,
    childAngleR: 0,
    bunchNum: 0, // My parent's index for the bunch I'm in
    activeBunch: 0, // My index for the bunch of children I'm showing
    numChildren: 0, // Num descendants of this node

    //Position this branch's down hinge on its parents up hinge
    positionX: function() {
        return this.get('parentModel').upHingeX();
    },
    positionY: function() {
        return this.get('parentModel').upHingeY();
    },
    absPositionX: function() {
        return this.positionX()+this.get('parentModel').absPositionX();
    },
    absPositionY: function() {
        return this.positionY()+this.get('parentModel').absPositionY();
    },

    upHingeX: function() {
        var a = Raphael.rad(this.absAngle);
        return (this.branchSvg.upHingeX-this.branchSvg.upHingeY*Math.sin(a))*this.get('scale');
    },
    upHingeY: function() {
        var a = Raphael.rad(this.absAngle);
        return this.branchSvg.upHingeY*Math.cos(a)*this.get('scale');
    },
    effectiveHeight: function() {
        return this.branchSvg.upHingeY*this.get('scale');
    },
    effectiveWidth: function() {
        return this.branchSvg.upHingeX*this.get('scale');
    },
    totalChildAngle: function() {
        return this.childAngleL + this.childAngleR;
    },

    addNewBranch: function(content, id, scale) {
        var newbranch = new App.ChildModel({parentModel:this, content:content, id:id, scale:scale});
        // This branch was added before we could determine that it's not necessary to show it (because it's not shown and none of its children are shown.) Thus the branch isn't needed.
        if (!this.isShown(content,id) && newbranch.numChildren == 0) {
            return null;
        }
        return newbranch;
    },

    // Whether the box shows "not available"/is left out of the tree, depending on whether structure depends on that node
    isShown: function(content, id) {
        return content[id]["visibility"] == "visible" && content[id]["is_published"] == true;
    },

    childAngleToAngle: function(childAngle) {
        if (childAngle >= 90){
            return Raphael.deg(Math.atan(App.branchSvg.falloff));
        }

        if (childAngle < 0){
            throw "Angles should be non-negative";
        }

        var childRad = Raphael.rad(childAngle);
        var opp = Math.abs(Math.sin(childRad)); // o/h
        var adj = Math.cos(childRad); // a/h
        opp *= this.effectiveHeight(); // o/h * h = o = O
        adj *= this.effectiveHeight(); // a/h * h = a
        adj += this.effectiveHeight(); // a + a' = A
        var ans = Math.atan(opp/adj); // atan(O/A) = new angle

        return Raphael.deg(ans);
    },

    //For debugging
    circleThisPoint: function(x,y,strokeColor) {
        if(!this.debug)
            return;

        var circ = this.paper.circle(x,y,6);
        circ.attr({
            stroke: strokeColor,
        });
        this.sprite.push(circ);
    },

    //For debugging
    printPosition: function() {
        this.dlog("Position "+this+": "+this.positionX()+","+this.positionY());
    },

    //For debugging
    dlog: function(message) {
        if(!this.debug)
            return;

        console.log(message);
    },

    setup: function(content, id) {
        //children

        this.dlog("vvvvvvvvvvvvvvvv");
        var childL = 0;
        var childR = 0;
        var currChildL = 0;
        var currChildR = 0;
        var myBunches = [];
        var currBunch = [];
        this.myBunches = myBunches;
        this.dlog("content length"+content[id].children.length);
        this.projectsToLeft = [0]; // Num projects to left of each bunch
        for (var i = 0; i < content[id].children.length; i++){

            // Drop end nodes that are not visible from the model. Note that this doesn't include nodes that then become end nodes because their children were all not visible.
            if (content[content[id].children[i]].children.length == 0 && !this.isShown(content,content[id].children[i]) ) {
                continue;
            }

            var b = this.addNewBranch(content, content[id].children[i], this.get('scale')*this.branchSvg.falloff);

            // addNewBranch returns null if a non-leaf node is unnecessary (unshown and all children were unshown)
            if (b == null)
                continue;

            // Don't exceed a certain angle per node per bunch, but require at least one branch per bunch
            if (currBunch.length > 0 && currChildL + b.angleL + currChildR + b.angleR > this.branchSvg.maxChildAngle) {
                myBunches.push({bunch: currBunch, childL: currChildL, childR: currChildR});
                this.projectsToLeft.push(this.numChildren); // Pushes to the n+1th spot when we have numChildren up to nth branch
                currBunch = [];
                if (childL < currChildL)
                    childL = currChildL;
                if (childR < currChildR)
                    childR = currChildR;
                currChildL = currChildR = 0;
            }

            currChildL += b.angleL;
            currChildR += b.angleR;
            b.bunchNum = myBunches.length;
            currBunch.push(b);
            this.numChildren += b.numChildren;
            // Only add things to the child count that are visible.
            if (this.isShown(content,content[id].children[i]))
                this.numChildren += 1;
        }

        myBunches.push({bunch: currBunch, childL: currChildL, childR: currChildR});

        if (childL < currChildL)
            childL = currChildL;
        if (childR < currChildR)
            childR = currChildR;
        currChildR = currChildL = 0;

        //angle
        this.childAngleL = childL;
        this.childAngleR = childR;
        this.angleL = Math.max(this.branchSvg.minAngle/2, this.childAngleToAngle(childL));
        this.angleR = Math.max(this.branchSvg.minAngle/2, this.childAngleToAngle(childR));
        this.dlog('angles:'+this.angleL+" "+this.angleR);
        this.dlog('childangles:'+childL+" "+childR);
        for (var i = 0; i < myBunches.length; i++) {
            var offset = -myBunches[i].childL;
            this.dlog("bunches length "+myBunches.length);
            for (var j = 0; j < myBunches[i].bunch.length; j++){
                var b = myBunches[i].bunch[j];
                offset += b.angleL;
                b.offset = offset;
                offset += b.angleR;
                this.dlog("set offset "+b.offset);
            }
        }
        this.dlog("^^^^^^^^^^^^^^^^");
    },

    calculateAngles: function() {
        for (var i = 0; i < this.myBunches.length; i++){
            for (var j = 0; j < this.myBunches[i].bunch.length; j++){
                var b = this.myBunches[i].bunch[j];
                b.absAngle = this.absAngle+b.offset;
                b.calculateAngles();
            }
        }
    },

    calculateTranslate: function() {
        for (var i = 0; i < this.myBunches.length; i++){
            for (var j = 0; j < this.myBunches[i].bunch.length; j++){
                var b = this.myBunches[i].bunch[j];
                b.calculateTranslate();
            }
        }
        this.set('doTranslate', "t"+this.positionX()+","+this.positionY());
    },

    calculateRotate: function() {
        this.set('doRotate', "r"+this.offset+",0,0");

        for (var i = 0; i < this.myBunches.length; i++){
            for (var j = 0; j < this.myBunches[i].bunch.length; j++){
                var b = this.myBunches[i].bunch[j];
                b.calculateRotate();
            }
        }
    },

    calculateScale: function() {
        for (var i = 0; i < this.myBunches.length; i++){
            for (var j = 0; j < this.myBunches[i].bunch.length; j++){
                var b = this.myBunches[i].bunch[j];
                b.set('doScale', "s"+this.branchSvg.falloff+","+this.branchSvg.falloff+",0,0");
                b.calculateScale();
            }
        }
    },

});

App.ChildModel = App.BranchModel.extend({

    initialize: function() {
        this.branchSvg = App.branchSvg;

        //draw
        this.setup(this.get('content'), this.get('id'));
    },
});

App.RootModel = App.BranchModel.extend({

    //Bounding box properties
    rootX:0,
    rootY:0,

    //position of 0,0 of the root
    positionX: function() {
        return -this.rootX;
    },
    positionY: function() {
        return -this.rootY;
    },
    absPositionX: function() {
        return this.positionX()
    },
    absPositionY: function() {
        return this.positionY()
    },

    initialize: function() {
        this.branchSvg = App.branchSvg

        //setup children
        this.set('scale', 1);
        this.set('id', this.get('content').root_id);
        App.root_id = this.get('id');
        if (!this.get('content').hasOwnProperty(this.get('id')) || !this.get('content')[this.get('id')].hasOwnProperty('visibility')) {
            console.log('no data');

            this.myBunches = [];
            App.wrapper.absWidth = App.wrapper.minWidth;
            App.wrapper.absHeight = App.wrapper.minHeight;
            App.wrapper.render();
            return;
        }
        this.setup(this.get('content'), this.get('id'));

        this.offset=0;
        this.absAngle=0;

        //calculate positions and transformations for children
        this.calculateAngles();
        this.calculateBounds();
        this.calculateTranslate();
        this.calculateScale();
        this.calculateRotate();

        //set active bunches
        this.setActiveBunches(this.get('focus'));
    },

    setActiveBunches: function(projId) {
        for (var i = 0; i < this.myBunches.length; i++){
            for (var j = 0; j < this.myBunches[i].bunch.length; j++){
                var b = this.myBunches[i].bunch[j];
                if (projId == b.get('id')) {
                    // Make this the active bunch so that when you first see the remix tree, the
                    // project you navigated from is visible in the tree.
                    var parent = b.get('parentModel');
                    while (parent != null) {
                        parent.activeBunch = b.bunchNum;
                        b = parent;
                        parent = parent.get('parentModel');
                    }
                    return; //only one focus project, don't need to keep looking
                }
            }
        }
    },

    calculateBounds: function() {
        //Get the bounding box of the tree
        var boundX = 0;
        var boundnX = 0;
        var boundY = 0;
        var leaves = new Array();
        leaves.push(this);
        while(leaves.length>0){
            var b = leaves.pop();
            for (var i = 0; i < b.myBunches.length; i++){
                for (var j = 0; j < b.myBunches[i].bunch.length; j++){
                    leaves.push(b.myBunches[i].bunch[j]);
                }
            }

            if (b.absPositionX()-this.absPositionX()+b.upHingeX()>boundX)
                boundX = b.absPositionX()-this.absPositionX()+b.upHingeX();

            if (b.absPositionX()-this.absPositionX()+b.upHingeX()<boundnX)
                boundnX = b.absPositionX()-this.absPositionX()+b.upHingeX();

            if (b.absPositionY()-this.absPositionY()+b.upHingeY()>boundY)
                boundY = b.absPositionY()-this.absPositionY()+b.upHingeY();

        }

        this.rootX = boundX+App.wrapper.margins;
        this.rootY = boundY+App.wrapper.margins;

        var width = boundX-boundnX+2*App.wrapper.margins;
        var height = boundY+App.wrapper.margins+App.wrapper.bottomMargin;

        this.setCorrectProportions(width,height);
    },

    setCorrectProportions: function(width, height) {
        // Make same proportion as window it is viewed from, so when you zoom all the way
        // out the background covers everything
        if (width/height > App.wrapper.minWidth/App.wrapper.minHeight) {
            // Width is too big so buffer height
            var newHeight = width*App.wrapper.minHeight/App.wrapper.minWidth;
            this.rootY += (newHeight-height); //buffer all on top, so that the tree is still "grounded"
            height = newHeight;
        } else if (width/height < App.wrapper.minWidth/App.wrapper.minHeight) {
            // Width is too small, buffer width
            var newWidth = height*App.wrapper.minWidth/App.wrapper.minHeight;
            this.rootX += (newWidth-width)/2; //buffer half on top, half on bottom
            width = newWidth;
        }

        // Make sure canvas is at least as big as viewing window
        if (width < App.wrapper.minWidth) {
            var newWidth = App.wrapper.minWidth;
            var newHeight = App.wrapper.minHeight;
            this.rootY += (newHeight-height); //buffer all on top
            this.rootX += (newWidth-width)/2; //buffer half on top, half on bottom
            height = newHeight;
            width = newWidth;
        }

        App.wrapper.rootX = this.rootX;
        App.wrapper.rootY = this.rootY;
        App.wrapper.absWidth = Math.ceil(width);
        App.wrapper.absHeight = Math.ceil(height);
        App.wrapper.render();
    }


});
