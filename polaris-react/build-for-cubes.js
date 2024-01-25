/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

const { readFileSync, writeFileSync } = require("fs");
const pkg = require("./package.json");

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

writeFileSync("../cubes-admin/polaris-react/package.json", JSON.stringify(pkg, null, 2));
