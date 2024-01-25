set -x # print each command as it is executed
set -e # exit if any line ends with a non-zero exit status
set -u # exit script if a variable is uninitialized

# yarn

cd /home/cubes/polaris

(cd polaris-tokens && yarn build)
(cd polaris-icons && yarn build)
(cd polaris-react && rm build -rf && yarn build:react)

mkdir -p ../cubes-admin/polaris-react/
rm -rf ../cubes-admin/polaris-react/src/
cp -r polaris-react/build/ts/src ../cubes-admin/polaris-react
cp -r polaris-react/locales ../cubes-admin/polaris-react
cp polaris-react/build/esm/styles.css ../cubes-admin/polaris-react
node ./build-for-cubes.js