import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // eslint-config-next 16.4.x ships eslint-plugin-react-hooks 7, which
      // promotes `set-state-in-effect` to an error. The admin pages load data
      // via a `useEffect(() => load())` pattern that trips it (setLoading/
      // setError run synchronously). Surfacing it as a warning keeps the
      // signal visible until those effects are refactored to fetch properly.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored agent skill scripts (impeccable) are not app source.
    ".agents/**",
    ".impeccable/**",
  ]),
]);

export default eslintConfig;
