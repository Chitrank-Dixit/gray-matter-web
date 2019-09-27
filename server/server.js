var express = require('express'),
    compression = require('compression'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    path = require('path'),
    cors = require('cors'),
    morgan = require('morgan');

// Initialize the Express App
var app = express();
var sock_server = require('http').Server(app);
var io = require('socket.io')(sock_server);
// models
require('./models/User');

require('dotenv').config();
// Set Development modes checks
var isDevMode = process.env.NODE_ENV === 'development' || false;
var isProdMode = process.env.NODE_ENV === 'production' || false;

//require('./passport')(passport);
// Run Webpack dev server in development mode
// if (isDevMode) {
//     // Webpack Requirements
//     // eslint-disable-next-line global-require
//     const webpack = require('webpack');
//     // eslint-disable-next-line global-require
//     const config = require('../webpack.config.dev');
//     // eslint-disable-next-line global-require
//     const webpackDevMiddleware = require('webpack-dev-middleware');
//     // eslint-disable-next-line global-require
//     const webpackHotMiddleware = require('webpack-hot-middleware');
//     const compiler = webpack(config);
//     app.use(webpackDevMiddleware(compiler, {
//       noInfo: true,
//       publicPath: config.output.publicPath,
//       watchOptions: {
//         poll: 1000,
//       },
//     }));
//     app.use(webpackHotMiddleware(compiler));
//   }

  // React And Redux Setup
var configureStore = require('../client/store'),
    Provider = require('react-redux'),
    React = require('react'),
    renderToString = require('react-dom/server'),
    match, RouterContext = require('react-router'),
    Helmet = require('react-helmet'),
    passport = require('passport');

// Import required modules
//import routes from '../client/routes';
//import { fetchComponentData } from './util/fetchData';
var auth = require('./routes/api/auth.routes');
var users = require('./routes/api/users.routes');
var question = require('./routes/api/questions.routes');
var test = require('./routes/api/test.socket');

//import dummyData from './dummyData';
var serverConfig = require('./config');

// require('./passport');

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(serverConfig.mongoURL, { useNewUrlParser: true } ,(error) => {
    if (error) {
      console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
      throw error;
    }

    // feed some dummy data in DB.
    //dummyData();
  });
}

// Apply body Parser and server public assets and routes

app.use(compression());
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(express.static(path.resolve(__dirname, '../dist/client')));
app.use(morgan('combined'));
//app.use(passport.initialize());
//app.use(passport.session());

require('./controllers/passport');
//require('./controllers/passport')(passport);
var router = express.Router();
router.use('/user', passport.authenticate('jwt', {session: false}), users);
router.use('/auth', auth);
router.use('/question', question);
//router.use('/t', test);
app.use('/api/v1', router);


// require('./models/User');
// app.use(require('./routes'));




// const renderError = err => {
//   const softTab = '&#32;&#32;&#32;&#32;';
//   const errTrace = isProdMode ?
//     `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';
//   return renderFullPage(`Server Error${errTrace}`, {});
// };

// Server Side Rendering based on routes matched by React-router.
// app.use((req, res, next) => {
//   match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
//     if (err) {
//       return res.status(500).end(renderError(err));
//     }

//     if (redirectLocation) {
//       return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
//     }

//     if (!renderProps) {
//       return next();
//     }

//     const store = configureStore();

//     return fetchComponentData(store, renderProps.components, renderProps.params)
//       .then(() => {
//         const initialView = renderToString(
//           <Provider store={store}>
//             <IntlWrapper>
//               <RouterContext {...renderProps} />
//             </IntlWrapper>
//           </Provider>
//         );
//         const finalState = store.getState();

//         res
//           .set('Content-Type', 'text/html')
//           .status(200)
//           .end(renderFullPage(initialView, finalState));
//       })
//       .catch((error) => next(error));
//   });
// });

// start app
sock_server.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log(`Gray Matter is running on port: ${serverConfig.port}! Build next generation learning app!`); // eslint-disable-line
  }
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// https://stackoverflow.com/questions/50438542/how-to-setup-socket-io-for-listen-separate-pages-with-express-nodejs
// https://socket.io/docs/#Using-with-Express
// https://github.com/AnushanLingam/OpenTrivia/blob/master/src/app.js
//export default app;
