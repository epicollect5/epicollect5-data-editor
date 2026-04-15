// eslint-disable-next-line one-var,prefer-const
let webpack = require('webpack'),
    // eslint-disable-next-line prefer-const
     express = require('express'),
    // eslint-disable-next-line prefer-const
     open = require('open');

// eslint-disable-next-line react/require-extension
const webpackConfig = require('./webpack.config.js');

// eslint-disable-next-line one-var,prefer-const
let compiler = webpack(webpackConfig),
    // eslint-disable-next-line prefer-const
     app = express();

app.use(require('webpack-dev-middleware')(compiler, {
    contentBase: '/src',
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        cached: false
    }
}));

app.use(require('webpack-hot-middleware')(compiler));

// eslint-disable-next-line no-path-concat
app.use(express.static(__dirname + '/src'));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', (request, response) => {
    // eslint-disable-next-line no-path-concat
    response.sendFile(__dirname + '/src/index.html');
});

const server = app.listen(3001, () => {
    // eslint-disable-next-line no-unused-expressions
    server.address().address;
    const port = server.address().port;

    console.log('Server listening at http://localhost:%s', port);
    open('http://localhost:' + port + '/project/ec5-demo-project/add-entry');
});
