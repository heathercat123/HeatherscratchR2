"use strict";

// Check status of visibility, changed by el.hide() and el.show()
Raphael.el.isVisible = function() {
    return (this.node.style.display !== "none");
}


// Used like 'hover', but only call hover in and out when you leave the bounds of the object, as opposed
// to mousing over something on the interior of that object. Having some trouble with this being too
// inconsistent with catching the correct hover in/out events.
Raphael.el.hoverInBounds = function(inFunc, outFunc) {
    this.inBounds = false;
    var that = this;

    // Mouseover function. Only execute if `inBounds` is false.
    this.mouseover(function() {
        // Don't activate hover while dragging
        if (App.wrapper.draggingActive == true)
            return;

        console.log('mouseover');
        if (!that.inBounds) {
            console.log('real mouseover');
            that.inBounds = true;
            inFunc.call(this);
        }
    });

    // Mouseout function
    this.mouseout(function(e) {
        // Don't activate hover while dragging
        if (App.wrapper.draggingActive == true)
            return;

        console.log('mouseout');

        // If we're still inside the element's bounds don't run outFunc immediately. isPointInside often returns wrong if mouse is moving quickly.
        var x = e.offsetX || e.clientX,
        y = e.offsetY || e.clientY;

        if (this.isPointInside(x, y)) {
            return false;
        }

        console.log('real mouseout');
        that.inBounds = false;
        outFunc.call(this);
    });

    return this;
}

// Animate the change in view box location and size
Raphael.fn.animateViewBox = function(oldX, oldY, oldWidth, oldHeight, newX, newY, newWidth, newHeight, duration, callback) {
    var differences = {
        x: newX - oldX,
        y: newY - oldY,
        width: newWidth - oldWidth,
        height: newHeight - oldHeight
    },
    // The smaller, the smoother the animation
    delay = 15,
    stepsNum = Math.ceil(duration / delay),
    stepped = {
        x: differences.x / stepsNum,
        y: differences.y / stepsNum,
        width: differences.width / stepsNum,
        height: differences.height / stepsNum
    }, i,
    canvas = this;


    /**
     * Using a lambda to protect a variable with its own scope.
     * Otherwise, the variable would be incremented inside the loop, but its
     * final value would be read at run time in the future.
     */
    function timerFn(iterator) {
        return function() {
            canvas.setViewBox(
                oldX+ (stepped.x * iterator),
                oldY + (stepped.y * iterator),
                oldWidth + (stepped.width * iterator),
                oldHeight + (stepped.height * iterator)
            );

            /*/ Run the callback as soon as possible, in sync with the last step
              if(iterator == stepsNum && callback) {
              callback(viewX, viewY, width, height);
              }*/
        }
    }

    // Schedule each animation step in to the future
    for(i = 1; i <= stepsNum; ++i) {
        setTimeout(timerFn(i), 0/*i * delay : too slow*/);
    }

}