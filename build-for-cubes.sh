set -x # print each command as it is executed
set -e # exit if any line ends with a non-zero exit status
set -u # exit script if a variable is uninitialized

# yarn

(cd polaris-tokens && yarn build)
(cd polaris-icons && yarn build)
(cd polaris-react && yarn build:react)
