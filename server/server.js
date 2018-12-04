import Express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';

// Initialize the Express App
const app = new Express();

// Set Development modes checks
const isDevMode = process.env.NODE_ENV === 'development' || false;
const isProdMode = process.env.NODE_ENV === 'production' || false;


// Run Webpack dev server in development mode
if (isDevMode) {
    // Webpack Requirements
    // eslint-disable-next-line global-require
    const webpack = require('webpack');
    // eslint-disable-next-line global-require
    const config = require('../webpack.config.dev');
    // eslint-disable-next-line global-require
    const webpackDevMiddleware = require('webpack-dev-middleware');
    // eslint-disable-next-line global-require
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const compiler = webpack(config);
    app.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath,
      watchOptions: {
        poll: 1000,
      },
    }));
    app.use(webpackHotMiddleware(compiler));
  }

  // React And Redux Setup
import { configureStore } from '../client/store';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';
import passport from 'passport';

// Import required modules
//import routes from '../client/routes';
//import { fetchComponentData } from './util/fetchData';
import auth from './routes/api/auth.routes';
import users from './routes/api/users.routes';
//import dummyData from './dummyData';
import serverConfig from './config';

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
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(Express.static(path.resolve(__dirname, '../dist/client')));
var router = Express.Router();
router.use('/user', passport.authenticate('jwt', {session: false}), users);
router.use('/auth', auth);
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
app.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log(`Gray Matter is running on port: ${serverConfig.port}! Build next generation learning app!`); // eslint-disable-line
  }
});

export default app;
