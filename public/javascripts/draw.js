
// The faster the user moves their mouse
// the larger the circle will be
// We dont want it to be larger than this
tool.maxDistance = 50;

var items = [];


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


// every time the user drags their mouse
// this function will be executed
function onMouseDown(event) {
    
    // TODO: Probably shouldn't do this any time the mouse is clicked.
    beginSorting();
}

function drawRectangle(x, y, width, height, color) {
    var rectangle = new Rectangle(new Point(x, y), new Point(x + width, y + height));
    var path = new Path.Rectangle(rectangle);

    path.fillColor = color;
    
    return path;
}

// Draws a visual representation of a list of values.
function drawArray(values) {
    
    var x = 100;
    var y = 100;
    var width = 5;
    
    for (var i = 0; i < values.length; ++i) {
        var color;
        if (i == currA || i == currB) {
            color = {
                red: 1,
                green: 0,
                blue: 0,
                alpha: 1
            };
        } else {
            color = {
                red: 0,
                green: 0.5,
                blue: 1,
                alpha: 1
            };
        }


        drawRectangle(x, y, width, values[i], color);
        x += width + 2;
    }

    // Refresh the view, so we always get an update, even if the tab is not in focus
    view.draw();
}

// This function sends the data for a circle to the server
// so that the server can broadcast it to every other user
function beginSorting() {
    
    // Each Socket.IO connection has a unique session id.
    var sessionId = io.socket.sessionid;
    
    // Send a 'beginSorting' event and sessionId to the server.
    io.emit('beginSorting', sessionId);
}

// Listen for 'drawArray' events.
io.on('drawArray', function(data) {

    console.log('drawArray event recieved:', data);
    
    // Store the array of items locally.
    items = data.randomValues;

    // Draw the sorted items.
    drawArray(items);
});

// TODO: We probably want to do a swap and comparison visual display.
var currA = 0;
var currB = 0;
function swap(items, a, b) {
    var temp = items[a];
    items[a] = items[b];
    items[b] = temp;

    currA = a;
    currB = b;
}

io.on('swap', function (data) {
    
    // Log the swap event.
    console.log('swap event recieved');
    
    // Remove the previously drawn items.
    project.activeLayer.removeChildren();
    
    // Swap our local copy of the items so they match the server.
    swap(items, data.a, data.b);
    
    // Draw the sorted items.
    drawArray(items);
});
