import coreWebVitals from "eslint-config-next/core-web-vitals";

/* eslint-config-next 16 ships flat config directly, so it is spread rather than
   pulled through FlatCompat. */
const config = [
  ...coreWebVitals,
  { ignores: [".next/**", "out/**", "node_modules/**"] },
];

export default config;
