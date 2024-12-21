var AnimatedGem = pc.createScript('animatedGem');

AnimatedGem.attributes.add("pathRoot", {type: "entity", title: "Path Root"});

// initialize code called once per entity
AnimatedGem.prototype.initialize = function() {
    this.DURATION = 0.7;
    this.time = 0;
    
    this.createPath();
};

// update code called every frame
AnimatedGem.prototype.update = function(dt) {
    this.time += dt;
    
    // Loop the path flythrough animation indefinitely 
    if (this.time > this.DURATION)
        this.entity.destroy();
    
    // Work out how far we are in time we have progressed along the path
    this.percent = this.time / this.DURATION;
    
    // Get the interpolated values for the position from the curves     
    this.entity.setPosition(this.px.value(this.percent), this.py.value(this.percent), 0);
};

AnimatedGem.prototype.createPath = function () {
    var curveMode = pc.CURVE_CARDINAL;
    
    // Create curves for position
    this.px = new pc.Curve();
    this.px.type = curveMode;
    
    this.py = new pc.Curve();
    this.py.type = curveMode;
    
    var nodes = this.pathRoot.children;
    
    // Get the total linear distance of the path (this isn't correct but gives a decent approximation in length)
    var pathLength = 0;
    
    // Store the distance from the start of the path for each path node
    var nodePathLength = [];
    
    // For use when calculating the distance between two nodes on the path
    var distanceBetween = new pc.Vec3();
    
    // Push 0 as we are starting our loop from 1 for ease
    nodePathLength.push(0);
    
    for (i = 1; i < nodes.length; i++) {
        var prevNode = nodes[i-1];
        var nextNode = nodes[i];
        
        // Work out the distance between the current node and the one before in the path
        distanceBetween.sub2(prevNode.getPosition(), nextNode.getPosition());
        pathLength += distanceBetween.length();
        
        nodePathLength.push(pathLength);
    }
    
    for (i = 0; i < nodes.length; i++) {
        // Calculate the time for the curve key based on the distance of the path to the node
        // and the total path length so the speed of the camera travel stays relatively
        // consistent throughout
        var t = nodePathLength[i] / pathLength;
        
        var node = nodes[i];
        
        var pos = node.getPosition();
        this.px.add(t, pos.x);
        this.py.add(t, pos.y);
    }
};