
function drawRectangle(x, y, width, height, color) {
    var rectangle = new Rectangle(new Point(x, y), new Point(x + width, y + height));
    var path = new Path.Rectangle(rectangle);
    
    path.fillColor = color;
    
    return path;
}

// Draws a visual representation of a list of values.
function drawArray(values) {
    
    // Remove the previously drawn items.
    project.activeLayer.removeChildren();

    var x = 100;
    var y = 100;
    var width = 5;
    
    for (var i = 0; i < values.length; ++i) {
        var color;

        if (i == compA || i == compB) {
            color = {
                red: 0,
                green: 1,
                blue: 0,
                alpha: 1
            };
        } else if (i == currA || i == currB) {
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
    
    console.log("compares: " + compareCount + ", swapCount: " + swapCount);
    
    // Refresh the view, so we always get an update, even if the tab is not in focus
    view.draw();
}

// Listen for 'drawArray' events.
var items = [];
io.on('drawArray', function (data) {
    
    console.log('drawArray event recieved:', data);
    
    // Store the array of items locally.
    items = data.randomValues;
    
    // Draw the sorted items.
    drawArray(items);
});

var currA = 0;
var currB = 0;
function swap(items, a, b) {
    var temp = items[a];
    items[a] = items[b];
    items[b] = temp;
    
    currA = a;
    currB = b;
}

var swapCount = 0;
var compareCount = 0;

io.on('swap', function (data) {
    
    // Log the swap event.
    console.log('swap event recieved');
    
    // Swap our local copy of the items so they match the server.
    swap(items, data.a, data.b);
    swapCount++;

    // Draw the sorted items.
    drawArray(items);
});

var compA = 0;
var compB = 0;
io.on('compare', function (data) {
    
    // Log the swap event.
    console.log('compare event recieved');
    
    // Update the values being compared.
    compA = data.a;
    compB = data.b;
    compareCount++;
});
