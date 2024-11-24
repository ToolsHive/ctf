import eslint from "eslint-plugin-prettier";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": typescriptPlugin,
            prettier: eslint,
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["warn"],
            '@typescript-eslint/explicit-function-return-type': ['warn', { 
                allowExpressions: true, 
                allowTypedFunctionExpressions: true 
            }],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
            "prettier/prettier": "warn",
        },
        ignores: [
            "node_modules/",
            "dist/",
            "tsconfig.json",
            "tsup.config.ts",
            "package.json",
            "package-lock.json",
            "LICENSE",
            "eslint.config.mjs",
            ".prettierrc",
            ".prettierignore",
        ],
    },
];
