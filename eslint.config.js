import pluginVue from "eslint-plugin-vue";
import pluginPrettier from "eslint-plugin-prettier";
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    files: ["**/*.{js,ts,vue}"],
    plugins: {
      vue: pluginVue,
      "@typescript-eslint": tseslint,
      prettier: pluginPrettier,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslintParser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        OptionType: "readonly",
        browser: "readonly",
        node: "readonly",
      },
    },
    rules: {
      ...pluginVue.configs["vue3-recommended"].rules,
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.html"],
    processor: pluginVue.processors[".vue"],
    plugins: {
      vue: pluginVue,
      prettier: pluginPrettier,
    },
    rules: {
      ...pluginVue.configs["vue3-recommended"].rules,
      ...prettierConfig.rules,
    },
  },
];
