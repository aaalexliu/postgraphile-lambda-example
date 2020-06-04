const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { options: postgraphileOptions } = require('./src/postgraphileOptions.js');const CopyPlugin = require('copy-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');


console.log("i'm loaded");
module.exports = {
  // output: {
  //   path: path.resolve(__dirname, 'dist'),
  //   filename: 'index.js',
  //   library: '',
  //   libraryTarget: 'commonjs',
  // },
  mode: 'production',
  target: 'node',
  plugins: [
    // Prevent loading pg-native (in a weird, backwards kind of way!)

    // pg-native resolving is throwing errors
    ...[
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
        'process.env.POSTGRAPHILE_ENV': '"production"',
        'process.env.NODE_PG_FORCE_NATIVE': JSON.stringify('1'),
        ...(postgraphileOptions.graphiql
          ? null
          : {
              'process.env.POSTGRAPHILE_OMIT_ASSETS': '"1"',
            }),
      }),
      new webpack.NormalModuleReplacementPlugin(/pg\/lib\/native\/index\.js$/, '../client.js'),
    ],
    
    // Omit websocket functionality from postgraphile:
    new webpack.NormalModuleReplacementPlugin(
      /postgraphile\/build\/postgraphile\/http\/subscriptions\.js$/,
      `${__dirname}/src/postgraphile-http-subscriptions.js`
    ),

    // Just in case you install express:
    new webpack.NormalModuleReplacementPlugin(
      /express\/lib\/view\.js$/,
      `${__dirname}/src/express-lib-view.js`
    ),

    new CopyPlugin({
      patterns: [
        { from: 'dist/postgraphile.cache', to: 'src/'},
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
  node: {
    __dirname: false, // just output `__dirname`
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // Without this, you may get errors such as
          // `Error: GraphQL conflict for 'e' detected! Multiple versions of graphql exist in your node_modules?`
          mangle: false,
        },
      }),
    ],
  },

  // buffer util, utf validate errors
  // https://github.com/websockets/ws/issues/1220
  externals: ['bufferutil', 'utf-8-validate'],

  // rules: [
  //   {
  //     test: /\.cache$/,
  //     use: {
  //       loader: 'file-loader',
  //       options: {
  //         name: "./src/postgraphile.cache"
  //       }
  //     }
  //   }
  // ]
};
