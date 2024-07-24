import stylistic from "@stylistic/eslint-plugin";

export default {
    plugins: {
        "@stylistic": stylistic
    },
    rules: {
        "@stylistic/array-bracket-newline": [ "error", "consistent" ],
        "@stylistic/array-bracket-spacing": [ "error", "always" ],
        "@stylistic/array-element-newline": [ "error", "consistent" ],
        "@stylistic/arrow-parens": [ "error", "as-needed" ],
        "@stylistic/arrow-spacing": [ "error", { before: true, after: true } ],
        "@stylistic/block-spacing": [ "error", "always" ],
        "@stylistic/brace-style": [ "error", "1tbs", { allowSingleLine: true } ],
        "@stylistic/comma-dangle": [ "error", "never" ],
        "@stylistic/comma-spacing": [ "error", { before: false, after: true } ],
        "@stylistic/comma-style": [ "error", "last" ],
        "@stylistic/computed-property-spacing": [ "error", "never" ],
        "@stylistic/dot-location": [ "error", "property" ],
        "@stylistic/eol-last": [ "error", "always" ],
        "@stylistic/function-call-argument-newline": [ "error", "consistent" ],
        "@stylistic/function-call-spacing": [ "error", "never" ],
        "@stylistic/function-paren-newline": [ "error", "consistent" ],
        "@stylistic/generator-star-spacing": [ "error", { before: true, after: false } ],
        "@stylistic/implicit-arrow-linebreak": [ "error", "beside" ],
        "@stylistic/indent": [ "error", 4 ],
        "@stylistic/indent-binary-ops": "off",
        "@stylistic/key-spacing": [ "error", { beforeColon: false, afterColon: true } ],
        "@stylistic/keyword-spacing": [ "error", { before: true, after: true } ],
        "@stylistic/line-comment-position": "off",
        "@stylistic/linebreak-style": [ "error", "unix" ],
        "@stylistic/lines-around-comment": "off",
        "@stylistic/lines-between-class-members": [ "error", {
            enforce: [
                { blankLine: "never", prev: "field", next: "field" },
                { blankLine: "always", prev: "*", next: "method" },
            ]
        } ],
        "@stylistic/max-len": [ "error", {
            code: 120,
            tabWidth: 4,
            ignoreComments: true,
            ignoreStrings: true,
            ignoreRegExpLiterals: true
        } ],
        "@stylistic/max-statements-per-line": "off",
        "@stylistic/member-delimiter-style": [ "error", {
            multiline: { delimiter: "comma", requireLast: false },
            singleline: { delimiter: "comma", requireLast: false }
        } ],
        "@stylistic/multiline-comment-style": "off",
        "@stylistic/multiline-ternary": [ "error", "always-multiline" ],
        "@stylistic/new-parens": [ "error", "never" ],
        "@stylistic/newline-per-chained-call": [ "error", { ignoreChainWithDepth: 2 } ],
        "@stylistic/no-confusing-arrow": [ "error", { allowParens: true } ],
        "@stylistic/no-extra-parens": [ "error", "all", {
            conditionalAssign: false,
            nestedBinaryExpressions: false
        } ],
        "@stylistic/no-extra-semi": "error",
        "@stylistic/no-floating-decimal": "error",
        "@stylistic/no-mixed-operators": "error",
        "@stylistic/no-mixed-spaces-and-tabs": "error",
        "@stylistic/no-multi-spaces": [ "error", { ignoreEOLComments: true } ],
        "@stylistic/no-multiple-empty-lines": [ "error", { max: 2, maxEOF: 1 } ],
        "@stylistic/no-tabs": "error",
        "@stylistic/no-trailing-spaces": "error",
        "@stylistic/no-whitespace-before-property": "error",
        "@stylistic/nonblock-statement-body-position": [ "error", "beside" ],
        "@stylistic/object-curly-newline": [ "error", { multiline: true, consistent: true } ],
        "@stylistic/object-curly-spacing": [ "error", "always" ],
        "@stylistic/object-property-newline": [ "error", { allowAllPropertiesOnSameLine: true } ],
        "@stylistic/one-var-declaration-per-line": [ "error", "initializations" ],
        "@stylistic/operator-linebreak": [ "error", "before" ],
        "@stylistic/padded-blocks": [ "error", "never" ],
        "@stylistic/padding-line-between-statements": "off",
        "@stylistic/quote-props": [ "error", "consistent-as-needed" ],
        "@stylistic/quotes": [ "error", "double" ],
        "@stylistic/rest-spread-spacing": [ "error", "never" ],
        "@stylistic/semi": [ "error", "always" ],
        "@stylistic/semi-spacing": [ "error", { before: false, after: true } ],
        "@stylistic/semi-style": [ "error", "last" ],
        "@stylistic/space-before-blocks": [ "error", "always" ],
        "@stylistic/space-before-function-paren": [ "error", {
            named: "never",
            anonymous: "never",
            asyncArrow: "always"
        } ],
        "@stylistic/space-in-parens": [ "error", "never" ],
        "@stylistic/space-infix-ops": "error",
        "@stylistic/space-unary-ops": [ "error", { words: true, nonwords: false } ],
        "@stylistic/spaced-comment": [ "error", "always" ],
        "@stylistic/switch-colon-spacing": [ "error", { after: true, before: false } ],
        "@stylistic/template-curly-spacing": [ "error", "never" ],
        "@stylistic/template-tag-spacing": [ "error", "never" ],
        "@stylistic/type-annotation-spacing": [ "error", { before: false, after: true } ],
        "@stylistic/type-generic-spacing": "error",
        "@stylistic/type-named-tuple-spacing": "error",
        "@stylistic/wrap-iife": [ "error", "inside", { functionPrototypeMethods: true } ],
        "@stylistic/wrap-regex": "off",
        "@stylistic/yield-star-spacing": [ "error", "before" ],
    }
}
