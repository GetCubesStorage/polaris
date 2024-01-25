/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */


const { readFileSync, writeFileSync } = require("fs");
const pkg = require("./package.json");
// "name": "@shopify/polaris",
// "description": "Shopify’s admin product component library",
// "version": "12.6.0",
// "private": false,
// "license": "SEE LICENSE IN LICENSE.md",
// "author": "Shopify <dev@shopify.com>",
// "homepage": "https://polaris.shopify.com/components",
// "repository": "https://github.com/Shopify/polaris",
// "bugs": {
//   "url": "https://github.com/Shopify/polaris/issues"
// },



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
    // "peerDependencies",
  ].includes(k) || delete pkg[k];
});

Object.keys(pkg.dependencies).forEach((n) => {
  if (!n.startsWith("@shopify/")) delete pkg.dependencies[n];
});

writeFileSync("../cubes-admin/polaris-react/package.json", JSON.stringify(pkg, null, 2));