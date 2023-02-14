#!/bin/bash

# This script is used to release a new version of the Skyline VSCode Extension.
# Release steps:
# 1. Create release branch
# 2. Increment package version in package.json
# 3. Prepare change log since the last version
# 4. Commit the change log
# 5. Create draft Github release

set -e

echo $0
RELEASE_SCRIPT_PATH=$(cd $(dirname $0) && pwd -P)
cd $RELEASE_SCRIPT_PATH
echo $RELEASE_SCRIPT_PATH
source common.sh

echo ""
echo_blue "Skyline VSCode Extension Release Preparation Tool"
echo_blue "================================================="

echo ""
check_repo

echo ""
check_tools

# Move to skyline-vscode source code dir
cd ../skyline-vscode
echo -en "${COLOR_YELLOW}Release increment: [patch], minor, major ${COLOR_NC}"
read -r
case $REPLY in
major)
  npm version major;;
minor)
  npm version minor;;
*)
  npm version patch;;
esac
NEXT_CLI_VERSION=$(node -p "require('./package.json').version")
VERSION_TAG="v$NEXT_CLI_VERSION"

echo ""
echo_yellow "> The next CLI version will be '$VERSION_TAG'."
prompt_yn "> Is this correct? (y/N) "
git checkout -b "release-$VERSION_TAG"
git commit -am "Bump version to $VERSION_TAG"
git push origin "release-$VERSION_TAG"
REPO_HASH=$(get_repo_hash)
RELEASE_NOTES=$(git log $(git describe --abbrev=0 --tags).. --merges --pretty=format:"%s %b" | cut -f 4,7- -d ' ')
echo ""
echo "Release Notes:"
echo "$RELEASE_NOTES"
gh pr create --title "Release $VERSION_TAG" --body "$RELEASE_NOTES"

echo_green "✓ Done!"

