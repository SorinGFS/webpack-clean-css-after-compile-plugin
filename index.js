'use strict';
const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
/**
 * @class CleanCssAfterCompilePlugin - This is a example of a webpack plugin using `class`. The most common and easy to understand syntax
 */
class CleanCssAfterCompilePlugin {
    /**
     * @description Creates an instance of CleanCssAfterCompilePlugin.
     * @param {object} options - Adds options from your configuration into the plugin for additional functionality
     *
     * @memberOf CleanCssAfterCompilePlugin
     */
    constructor(options) {
        this.cleanCssOptions = {};
        Object.assign(this, options);
    }
    /**
     * @name apply
     * @description This method is invoked by the Compiler on "registration" and an instance of the Compiler is passed in as a parameter.
     * @param {Compiler} compiler - This is the Compiler instance. Calling `compiler.plugin('some-event', (someState) => {})` allows one to "plug into"
     * the compiler and listen to events and update state/add side effects or perform additional functionality through the compiler/compilation life cycle
     *
     * @memberOf CleanCssAfterCompilePlugin
     */
    apply(compiler) {
        compiler.hooks.done.tap('CleanCssAfterCompilePlugin', (stats) => {
            if (this.isProduction) {
                if (fs.existsSync(path.resolve(this.outputDir))) {
                    console.log('[CleanCssAfterCompilePlugin] minifying compilation css assets...');
                    const assets = stats.compilation.getAssets();
                    if (assets.length) {
                        assets.forEach((asset) => {
                            if (/\.css$/.test(asset.name)) {
                                const assetPath = path.resolve(this.outputDir, asset.name);
                                process.stdout.write(`[CleanCssAfterCompilePlugin] minifying ${assetPath}...`);
                                const output = new CleanCSS(this.cleanCssOptions).minify([assetPath]);
                                if (!output.errors.length) {
                                    fs.writeFile(assetPath, output.styles, 'utf8', function (err) {
                                        if (err) return console.log(err);
                                    });
                                    console.log(`[CleanCssAfterCompilePlugin] minifying ${assetPath} done!`);
                                } else {
                                    console.log(output.errors);
                                }
                            }
                        });
                    }
                    console.log('[CleanCssAfterCompilePlugin] minifying compilation css assets done!');
                } else {
                    throw new ReferenceError(`[CleanCssAfterCompilePlugin] invalid outputDir: ${this.outputDir}`);
                }
            }
        });
    }
}

module.exports = CleanCssAfterCompilePlugin;
