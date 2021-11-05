const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const {
  BundleAnalyzerPlugin
} = require("webpack-bundle-analyzer");

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

const optimization = (() => ({
  splitChunks: {
    chunks: "all"
  },
  runtimeChunk: "single",
  minimizer: isProd ? [
    new CssMinimizerPlugin(),
    new TerserWebpackPlugin(),
  ] : undefined
}))();

const filename = ext => (
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`
);

console.group("process.env.NODE_ENV value : ");
console.log(process.env.NODE_ENV);
console.log("Is Dev: ", isDev);
console.groupEnd();

const cssLoaders = extra => {
  const loaders = [
    MiniCssExtractPlugin.loader,
    "css-loader",
  ];

  if (extra) loaders.push(extra);

  return loaders;
};

const babelOptions = preset => {
  const options = {
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-proposal-class-properties"]
  };

  if (preset) options.presets.push(preset);

  return options;
};

const jsLoaders = babelOption => {
  const loaders = [{
    loader: "babel-loader",
    options: babelOptions(babelOption),
  }];

  if (isDev) loaders.push("eslint-loader");

  return loaders;
};

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      //title: "Webpack Anar Soltanov",
      template: "./index.html",
      minify: {
        collapseWhitespace: isProd
      }
    }),

    new CleanWebpackPlugin(),

    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, "src/favicon.ico"),
        to: path.resolve(__dirname, "dist")
      }]
    }),

    new MiniCssExtractPlugin({
      filename: filename("css")
    }),
  ];

  if (isProd) base.push(new BundleAnalyzerPlugin());

  return base;
}

module.exports = {
  target: isDev ? "web" : "browserslist",
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: ["@babel/polyfill", "./index.jsx"],
    //private: true,
    analytics: "./analytics.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: filename("js"),
  },
  resolve: {
    extensions: [".js", ".json", ".png"],
    alias: {
      Models: path.resolve(__dirname, "src/models/"),
      Assets: path.resolve(__dirname, "src/assets/"),
      Styles: path.resolve(__dirname, "src/styles/"),
      Src: path.resolve(__dirname, "src/"),
    },
  },
  optimization: optimization,
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  devServer: {
    port: 1998,
  },
  //devtool: isDev ? "source-map" : "",
  plugins: plugins(),
  module: {
    rules: [{
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.less$/,
        use: cssLoaders("less-loader")
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders("sass-loader")
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource',
      },
      {
        test: /\.xml$/,
        use: "xml-loader",
      },
      {
        test: /\.csv$/,
        use: "csv-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-typescript"),
        }
      },
      {
        test: /\.[jt]sx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-react"),
        }
      }
    ]
  }
};