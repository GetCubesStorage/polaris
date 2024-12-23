set -x # print each command as it is executed
set -e # exit if any line ends with a non-zero exit status
set -u # exit script if a variable is uninitialized

# /home/cubes/client3/projects

# yarn

(cd /home/cubes/polaris/polaris-tokens && yarn build)
(cd /home/cubes/polaris/polaris-icons && yarn build)
(cd /home/cubes/polaris/polaris-react && rm build -rf && npx tsc -b && npx rollup -c)

mkdir -p ./polaris-react/
rm -rf ./polaris-react/src/
cp -r /home/cubes/polaris/polaris-react/build/ts/src ./polaris-react
cp -r /home/cubes/polaris/polaris-react/locales ./polaris-react
cp /home/cubes/polaris/polaris-react/build/esm/styles.css ./polaris-react
cat /home/cubes/polaris/polaris-react/build-for-cubes.tsconfig.json > ./polaris-react/tsconfig.json
(cd ./polaris-react && npx tsc)
(cd ./polaris-react && node /home/cubes/polaris/polaris-react/build-for-cubes.js)
