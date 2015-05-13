
// Express requires these dependencies
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var quicksort = require('./quicksort.js');

// Configure our application
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

// Configure error handling
app.configure('development', function () {
    app.use(express.errorHandler());
});

// Setup Routes
app.get('/', routes.index);
app.get('/users', user.list);

// Enable Socket.io
var server = http.createServer(app).listen(app.get('port'));
var io = require('socket.io').listen(server);

// A user connects to the server (opens a socket)
io.sockets.on('connection', function (socket) {
    
    // (2): The server recieves a ping event
    // from the browser on this socket
    socket.on('ping', function (data) {
        
        console.log('socket: server recieves ping (2)');
        
        // (3): Emit a pong event all listening browsers
        // with the data from the ping event
        io.sockets.emit('pong', data);
        
        console.log('socket: server sends pong to all (3)');

    });
    
    // Listen for the 'beginSorting' message from the client.
    socket.on('beginSorting', function (session) {
        
        // Log the session identifier.
        console.log("session: " + session);
        
        // Generate random values to be sorted.
        var randomValues = [];
        for (var i = 0; i < 230; ++i) {
            randomValues.push((Math.random() * 500) + 1);
        }
        
        // Send the initial values to the client to draw.
        socket.emit('drawArray', { randomValues: randomValues, yOffset: 300 });
        
        // Start the quicksort.
        quicksort(randomValues, swapCallback, compareCallback);
    });

});

function swapCallback(a, b) {
    console.log("swapping: " + a + "," + b);
    io.sockets.emit('swap', { a: a, b: b });

    sleep(50);
}

function compareCallback(a, b) {
    console.log("comparing: " + a + "," + b);
    io.sockets.emit('compare', { a: a, b: b });
    
    sleep(50);
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}