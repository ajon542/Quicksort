
// The faster the user moves their mouse
// the larger the circle will be
// We dont want it to be larger than this
tool.maxDistance = 50;


// Returns an object specifying a semi-random color
// The color will always have a red value of 0
// and will be semi-transparent (the alpha value)
function randomColor() {
    
    return {
        red: 0,
        green: Math.random(),
        blue: Math.random(),
        alpha: (Math.random() * 0.25) + 0.05
    };

}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}


// every time the user drags their mouse
// this function will be executed
function onMouseDown(event) {
    
    // Take the click/touch position as the centre of our circle
    var x = event.point.x;
    var y = event.point.y;
    
    //var path = drawRectangle(x, y, 20, 200);
    //var secondPath = drawRectangle(x + 40, y, 20, 100);
    //var group = new Group([path, secondPath]);
    //group.style = {
    //    fillColor: 'red',
    //    strokeColor: 'black'
    //};
    
    // Swapping the chilren changes the order they are rendered in.
    // We could have a group for all of our items in the array.
    // We can't just simply swap the items, this just moves the items position
    // in the array. A swap might have to involve updating the correct positions
    // or it might end up just being easier to delete the item and recreate it
    // at the expected height.
    //var temp = group.children[0];
    //group.children[0] = group.children[1];
    //group.children[1] = temp;
    //group.children[1].remove();
    //group.remove();
    
    
    // Draw the circle.
    //var heightValues = [];
    //for (var i = 0; i < 200; ++i) {
    //    heightValues.push((Math.random() * 400) + 1);
    //}
    
    //console.log("heights: " + heightValues);
    //drawArray(group, heightValues);
    
    // Pass the data for this circle
    // to a special function for later
    emitCircle(x, y, 5, randomColor());
}

function drawCircle(x, y, radius, color) {
    
    // Render the circle with Paper.js
    var circle = new Path.Circle(new Point(x, y), radius);
    circle.fillColor = new RgbColor(color.red, color.green, color.blue, color.alpha);
    
    // Refresh the view, so we always get an update, even if the tab is not in focus
    view.draw();
}

function drawRectangle(x, y, width, height) {
    var rectangle = new Rectangle(new Point(x, y), new Point(x + width, y + height));
    var path = new Path.Rectangle(rectangle);
    path.fillColor = {
        red: 0,
        green: 0.5,
        blue: 1,
        alpha: 1
    };
    
    return path;
}

// Draws a visual representation of a list of values.
function drawArray(group, values, yOffset) {
    
    var x = 100;
    // Draw the rectangles up the right way.
    var y = yOffset;
    var width = 5;
    
    for (var i = 0; i < values.length; ++i) {
        group.addChild(drawRectangle(x, y - values[i], width, values[i]));
        x += width + 2;
    }

    // Refresh the view, so we always get an update, even if the tab is not in focus
    view.draw();
}

// This function sends the data for a circle to the server
// so that the server can broadcast it to every other user
function emitCircle(x, y, radius, color) {
    
    // Each Socket.IO connection has a unique session id
    var sessionId = io.socket.sessionid;
    
    // An object to describe the circle's draw data
    var data = {
        x: x,
        y: y,
        radius: radius,
        color: color
    };
    
    // send a 'drawCircle' event with data and sessionId to the server
    io.emit('drawCircle', data, sessionId);
    
    // Lets have a look at the data we're sending
    console.log(data);

}


// Listen for 'drawCircle' events
// created by other users
io.on('drawCircle', function(data) {

    console.log('drawCircle event recieved:', data);

    // Draw the circle using the data sent
    // from another user
    drawCircle(data.x, data.y, data.radius, data.color);

});

// Listen for 'drawCircle' events
// created by other users
var group = new Group();
io.on('drawArray', function(data) {

    console.log('drawArray event recieved:', data);

    //group.remove();
    group = new Group();

    // Draw the circle using the data sent
    // from another user
    drawArray(group, data.heightValues, data.yOffset);

});
