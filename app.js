
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
    
    socket.on('drawCircle', function (data, session) {
        
        console.log("session " + session + " drew:");
        console.log(data);
        
        var heightValues = [];
        for (var i = 0; i < 200; ++i) {
            heightValues.push((Math.random() * 200) + 1);
        }
        
        socket.emit('drawArray', { heightValues: heightValues, yOffset: 300 });
        quicksort(heightValues, swapCallback);
        //socket.emit('drawArray', { heightValues: heightValues, yOffset: 700 });
    });

});

function swapCallback(items) {
    // This is just inefficient to send the entire list of items
    // and then redraw them all. I just need to work out the grouping
    // and project structure of paperjs to update the visual representation
    // of the swapped values.
    console.log("swapping");
    io.sockets.emit('swap', { heightValues: items, yOffset: 300 });
}