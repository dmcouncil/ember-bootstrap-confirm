"use strict";

const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const babelParser = require("@babel/eslint-parser");
const ember = require("eslint-plugin-ember");
const globals = require("globals");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        parser: babelParser,
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            requireConfigFile: false,

            babelOptions: {
                plugins: [["@babel/plugin-proposal-decorators", {
                    decoratorsBeforeExport: true,
                }]],
            },
        },

        globals: {
            ...globals.browser,
            "$": "readonly",
        },
    },

    plugins: {
        ember,
    },

    extends: compat.extends("eslint:recommended", "plugin:ember/recommended"),

    rules: {
        // DMG overrides (to keep our existing code as intact as possible through Ember upgrades, as long as they are not breaking)
        // These overrides should be removed eventually to conform to latest standards.
        "ember/no-actions-hash": 0,
        "ember/no-classic-classes": 0,
        "ember/no-classic-components": 0,
        "ember/no-component-lifecycle-hooks": 0,
        "ember/no-global-jquery": 0,
        "ember/no-jquery": 0,
        "ember/require-tagless-components": 0,

        // Unlike the above, these are here to stay...
        // Even Ember Model Test generated code uses "run()", but somehow EsLint doesn't allow it.
        // We have no choice but to turn it off.
        "ember/no-runloop": 0,
    },
}, {
    files: [
        "./.eslintrc.js",
        "./.stylelintrc.js",
        "./.template-lintrc.js",
        "./ember-cli-build.js",
        "./index.js",
        "./testem.js",
        "./blueprints/*/index.js",
        "./config/**/*.js",
        "./tests/dummy/config/**/*.js",
    ],

    languageOptions: {
        sourceType: "script",
        parserOptions: {},

        globals: {
            ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, "off"])),
            ...globals.node,
        },
    },

    extends: compat.extends("plugin:n/recommended"),
}, {
    files: ["tests/**/*-test.{js,ts}"],
    extends: compat.extends("plugin:qunit/recommended"),

    rules: {
        "qunit/require-expect": 0,
    },
}, globalIgnores([
    "eslint.config.js",
    "blueprints/*/files/",
    "dist/",
    "coverage/",
    "!**/.*",
    "**/.*/",
    ".node_modules.ember-try/",
])]);
