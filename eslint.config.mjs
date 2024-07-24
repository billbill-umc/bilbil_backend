import globals from "globals";
import pluginJs from "@eslint/js";
import parser from "@babel/eslint-parser";
import style from "./eslint.style.mjs";
import jest from "eslint-plugin-jest";

export default [
    {
        ignores: [ "node_modules", "dist" ]
    },
    {
        languageOptions: {
            globals: globals.node,
            parser
        }
    },
    pluginJs.configs.recommended,
    style,
    jest.configs["flat/recommended"]
];
