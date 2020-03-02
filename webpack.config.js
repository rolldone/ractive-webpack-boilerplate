const autoprefixer = require('autoprefixer');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
var pkg = {
  version : (new Date()).getTime()
}
module.exports = {
  mode: "production",
  optimization : {
    splitChunks :  {
      chunks : 'async',
      cacheGroups: {
        heavy: {
            chunks: 'initial',
            filename: `[name].bundle.js?v=${pkg.version}`,
            minChunks: 2,
            name: 'heavy',
            reuseExistingChunk: true,
            test: (module, chunks) =>
                chunks.length === 2 &&
                /^(editor|player)$/.test(chunks[0].name) &&
                /^(editor|player)$/.test(chunks[1].name)
        },
        common: {
            chunks: 'initial',
            filename: `[name].bundle.js?v=${pkg.version}`,
            minChunks: 2,
            name: 'common',
            reuseExistingChunk: true,
            test: (module, chunks) =>
                !(
                    chunks.length === 2 &&
                    /^(editor|player)$/.test(chunks[0].name) &&
                    /^(editor|player)$/.test(chunks[1].name)
                )
        }
      }
    }
  },
  entry: {
    auth : [path.resolve(__dirname, './src/v1/auth')],
    main : [path.resolve(__dirname, './src/v1/main')],
    examplev2 : [path.resolve(__dirname, './src/v2/example')],
    partnerv2 : [path.resolve(__dirname, './src/v2/partner')],
    vendor: ['babel-polyfill'],
  },
  output: {
    // path: path.resolve(__dirname, './public'),
    // filename: 'bundle.js',
    // publicPath : '/'
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: '[name].js'

  },
  module: {
    strictExportPresence: true,
		rules: [
      {
        test: /\.(ico|jpg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          name: '[path][name].[ext]',
        },
      },
      { test: /\.css/, loader: 'style-loader!css-loader!postcss-loader' },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      { test: /\.jade$/, loader: 'ractive-loader!jade-html-loader' },
      { test: /\.html/, loader: 'ractive-loader' },
      {
        test: /\.svg$/,
        use: [{
            loader: 'file-loader'
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [{
                  removeTitle: true
                }, {
                  removeDoctype: true
                }, {
                  convertColors: {
                    shorthex: false,
                  },
                },
                {
                  convertPathData: false,
                },
              ]
            },
          },
        ],
      }
    ]
  },
  plugins: [
    /* Ini artinya membuatkan folder tujuan pada saat di compile */
    new CopyPlugin([
      { from: 'src/assets/v1/img', to: 'public/img' },
      { from: 'src/assets/v2/img', to: 'public/v2/img' },
    ]),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      moment: 'moment',
      Swal : path.resolve(path.join(__dirname,'src','assets/sweetalert2/dist/sweetalert2.min.js')),
      // jQuery: path.resolve(path.join(__dirname, 'lib', 'own_jquery.js')),
      // 'window.jQuery': path.resolve(path.join(__dirname, 'lib', 'own_jquery.js')),
      'gettext' : path.join(__dirname, 'src/base', 'Ttag.js'),
      'Arg' : path.join(__dirname,'src/assets','arg/dist/arg.min.js'),
      'asyncjs' : 'async',
      'NProgress' : "nprogress",
      'Pusher' : path.join(__dirname,'src/assets','pusher-js-master/dist/web/pusher.min.js'),
      '_' : path.join(__dirname,'src/assets','lodash/dist/lodash.min.js'),
      'Validator' : path.join(__dirname,'src/assets','validatorjs/validator.js'),
    })
  ],
  resolve: {
    alias: {
      pubsub: 'aurelia-event-aggregator',
      Ractive: 'ractive',
      BaseRactive : path.resolve(path.join(__dirname,'src','lib/ractive/BaseRactive.js')),
      '@base' : path.resolve(__dirname,'base'),
      '@app' : path.resolve(__dirname,'src'),
      '@v1' : path.resolve(__dirname,'src/v1'),
      '@v2' : path.resolve(__dirname,'src/v2'),
      '@config' : path.resolve(
				__dirname+'/config/client',
				(function() {
					switch (process.env.NODE_ENV) {
						case 'production':
							return 'production.js';
						case 'devserver':
							return 'devserver.js';
						default:
							return 'coding.js';
					}
				})(),
			),
    }
  }
};
