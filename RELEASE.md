# How to release a new version of DeepView.Explore
- Go to Github repo and run the action `build-vsix`. You will be prompted to specify the version number.

- This runs a GitHub Action that will take the following steps:
   1. Fetches the repo and its dependencies
   2. Creates a release branch
   3. Updates the version number to the user-specified version by updating the package.json
   4. Commits the changes and tag the commit with the version number
   5. Builds the VSIX
   6. Publishes the VSIX to VSCode Marketplace
   7. Publishes a release to Github
   8. Create a PR to merge back into main
- The action `build-vsix` is defined under `.github/workflows/build-vsix.yaml`

- This release process follows the release process outlined in [OneFlow](https://www.endoflineblog.com/oneflow-a-git-branching-model-and-workflow).