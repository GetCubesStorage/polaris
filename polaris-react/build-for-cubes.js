/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

const { readFileSync, writeFileSync } = require("fs");
const pkg = require("/home/cubes/polaris/polaris-react/package.json");

Object.keys(pkg).forEach((k) => {
  [
    "name",
    "description",
    "version",
    "private",
    "license",
    "author",
    "homepage",
    "repository",
    "bugs",
    "dependencies",
    "peerDependencies",
  ].includes(k) || delete pkg[k];
});

writeFileSync("package.json", JSON.stringify(pkg, null, 2));
