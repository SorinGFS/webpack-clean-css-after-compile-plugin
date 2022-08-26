### Clean CSS After Compile Plugin

For some reason `webpack.optimization` with [CssMinimizerPlugin.cleanCssMinify](https://webpack.js.org/plugins/css-minimizer-webpack-plugin/#function) does not work as expected. This plugin aims to solve the same thing but after compilation is done. The `css` assets are modified in place without altering the references already set by `webpack`.

#### Installation

```shell
npm i -D webpack-clean-css-after-compile-plugin
```

#### Configuration

The plugin takes a single argument as object having:

```js
{
    isProduction: boolean, // if true will run minification, else not
    outputDir: string, // must match the webpack output path
    cleanCssOptions: object, // optional, default is empty object
}
```

For detailed `cleanCssOptions` see [clean-css documentation](https://github.com/clean-css/clean-css#constructor-options).

#### Usage

The following example shows a minimal scenario
```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanCssAfterCompilePlugin = require('webpack-clean-css-after-compile-plugin');

// see clean-css docs for options, the following is default and is not required
const cleanCssOptions = {};

const isProduction = process.env.NODE_ENV === 'production';
const sourceDir = path.resolve(__dirname, 'src');
const outputDir = path.resolve(__dirname, 'web');

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: { index: path.resolve(sourceDir, 'index.js') },
    output: {
        path: outputDir,
        // other options
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                // options.publicPath is required for asset imports in CSS, such as url()
                use: [{ loader: MiniCssExtractPlugin.loader, options: { publicPath: '' } }, 'css-loader' ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({/* options */}),
        new CleanCssAfterCompilePlugin({ isProduction, outputDir, cleanCssOptions }),
    ],
    devtool: isProduction ? false : 'source-map',
};
```
