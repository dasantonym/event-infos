'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs-extra'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    assetManager = require('connect-assetmanager'),
    busboy = require('connect-busboy'),
    routes = require('./routes/index'),
    snippets = require('./routes/partials'),
    events = require('./routes/api/events'),
    artists = require('./routes/api/artists'),
    assets = require('./routes/api/assets'),
    locations = require('./routes/api/locations'),
    app = express(),
    root = __dirname + '/public',
    dburl = 'mongodb://localhost:27017/event-infos',
    assetManagerGroups = {
        'js-deps': {
            'route': /\/static\/deps\.js/,
            'path': './bower_components/',
            'dataType': 'javascript',
            'files': [
                'bluebird/js/browser/bluebird.min.js',
                'ng-file-upload-shim/ng-file-upload-shim.min.js',
                'angular/angular.min.js',
                'angular-route/angular-route.min.js',
                'angular-animate/angular-animate.min.js',
                'angular-bootstrap/ui-bootstrap.min.js',
                'angular-bootstrap/ui-bootstrap-tpls.min.js',
                'angular-busy/dist/angular-busy.min.js',
                'angular-sanitize/angular-sanitize.min.js',
                'showdown/compressed/Showdown.min.js',
                'angular-markdown-directive/markdown.js',
                'ng-file-upload/ng-file-upload.min.js'
            ]
        },
        'js-app': {
            'route': /\/static\/app\.js/,
            'path': './public/js/',
            'dataType': 'javascript',
            'files': [
                'services/api.js',
                'controllers/site.js',
                'controllers/events.js',
                'controllers/locations.js',
                'controllers/artists.js',
                'app.js'
            ]
        }
    },
    assetsManagerMiddleware = assetManager(assetManagerGroups);

mongoose.connect(dburl);
mongoose.model('Event', require('./models/event').Event);
mongoose.model('Artist', require('./models/artist').Artist);
mongoose.model('Asset', require('./models/asset').Asset);
mongoose.model('Location', require('./models/location').Location);

fs.mkdirp(path.resolve('./assets'));
fs.mkdirp(path.resolve('./tmp'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(busboy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/fonts', express.static(path.join(__dirname, 'bower_components/bootstrap/fonts')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/', assetsManagerMiddleware);

app.use('/', routes);
app.use('/partials', snippets);

app.use('/api/events', events);
app.use('/api/artists', artists);
app.use('/api/locations', locations);
app.use('/api/assets', assets);

app.use(function(req, res, next) {
    res.render('index');
    next();
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
