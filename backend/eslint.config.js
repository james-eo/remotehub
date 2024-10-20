import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Browser globals
        ...globals.node, // Node.js globals (includes 'process')
      },
      ecmaVersion: 2021, // ECMAScript version
      sourceType: "module", // For using ES modules
    },
  },
  pluginJs.configs.recommended,
];
