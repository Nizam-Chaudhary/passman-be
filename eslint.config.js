import pluginJs from "eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    {
        extends: [
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
        ],
    },
    { parser: "@typescript-eslint/parser" },
    { plugins: ["@typescript-eslint"] },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^(req|res|next|_)$",
                },
            ],
            "no-undef": "error",
        },
    },
];
