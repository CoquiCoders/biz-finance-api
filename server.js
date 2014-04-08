
'use strict';

/**
 * Preflight-checks
 */

if ( !process.env.NODE_ENV ) {
  process.env.NODE_ENV = 'development';
}

/**
 * Module dependencies.
 */

global.nconf = require('nconf');

var path    = require('path');
var restify = require('restify');
var bunyan  = require('bunyan');
var mongoose = require('mongoose');

/**
 * Config
 */

nconf.argv()
  .env()
  .file({
    file : path.join( __dirname, 'config', 'global.json' )
  });

/**
 * Logging
 */

var LogglyStream = require( path.join(__dirname, 'helpers', 'logglyStream.js') );
var Logger = bunyan.createLogger({
  name: nconf.get('Logging:Name'),
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res
  },
  streams: [
    { path: path.join(nconf.get('Logging:Dir'),process.env.NODE_ENV+'-'+nconf.get('Server:Name')+'.log') },
    { type: 'raw', stream: new LogglyStream() }
  ]
});

/**
 * Server
 */

var server = restify.createServer({
  name       : nconf.get('Server:Name'),
  version    : nconf.get('Server:DefaultVersion'),
  acceptable : nconf.get('Server:Acceptable'),
  log        : Logger
});

/**
 * Server plugins
 */

var throttleOptions = {
  rate: nconf.get('Server:ThrottleRate'),
  burst: nconf.get('Server:ThrottleBurst'),
  ip: false,
  username: true
};

var plugins = [
  restify.acceptParser( server.acceptable ),
  restify.throttle( throttleOptions ),
  restify.dateParser(),
  restify.queryParser(),
  restify.fullResponse()
];

if ( process.env.NODE_ENV === 'production' ) {
  plugins.push( require( path.join(__dirname, 'plugins', 'customAuthorizationParser') )( restify.InvalidHeaderError, restify.NotAuthorizedError ) );
}

plugins.push(restify.bodyParser());
plugins.push(restify.gzipResponse());


server.use(plugins);

/**
 * CORS
 */
var corsOptions = {
  origins: nconf.get('CORS:Origins'),
  credentials: nconf.get('CORS:Credentials'),
  headers: nconf.get('CORS:Headers'),
};

server.pre( restify.CORS(corsOptions) );

if ( corsOptions.headers.length ) {
  server.on('MethodNotAllowed', require( path.join(__dirname, 'helpers', 'corsHelper.js') )() );
}

/**
 * Request / Response Logging
 */

server.on('after', restify.auditLogger({
  log: Logger
}));

/**
 * Database
 */
mongoose.connect(nconf.get('MONGODB'));
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});
/**
 * Controllers
 */
// Load Them First.
var incentivesController = require('./controllers/incentiveController.js');

// Paths.
server.get({ path : '/', version : '1.0.0' }, incentivesController.v100.getIncentive);

/**
 * Listen
 */
server.listen(nconf.get('Server:Port'), function() {
  console.log();
  console.log( '%s now listening on %s', nconf.get('App:Name'), server.url );
  console.log();
});
