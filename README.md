[![Maintainability](https://api.codeclimate.com/v1/badges/0001287428a20bef03ad/maintainability)](https://codeclimate.com/github/CentML/DeepView.Explore/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0001287428a20bef03ad/test_coverage)](https://codeclimate.com/github/CentML/DeepView.Explore/test_coverage)

# VSCode Plugin for DeepView

![Demo GIF](https://raw.githubusercontent.com/CentML/mltools-vscode/jun07-usability-improvements/images/demo.gif)

## Documentation
https://docs.centml.ai/index.html

## Installation
Installation consists of two parts: the front-end UI (this repository) and [DeepView.Profile](https://github.com/CentML/DeepView.Profile) (the backend), which needs to be installed separately.

### Frontend Installation
To install, either:
* [Download](https://centml-releases.s3.us-east-2.amazonaws.com/deepview-explore/index.html) the prebuilt VSCode plugin package
* Build it from source
  1. Prerequisites:
     - node.js v14+
     - [Protobuf Compiler](https://grpc.io/docs/protoc-installation/)
     - npm install -g @vscode/vsce (to build the vscode extension)
  2. Run the following commands    
      ```bash
      git clone https://github.com/CentML/DeepView.Explore.git
      ./scripts/build_vsix.sh
      ```
  3. The vsix file will be generated in the current working directory

Once you have the vsix file, run `code --install-extension deepview-explore-*.vsix` to install the extension.
**Note: the file [build_vsix_dev.sh] is only to be used for development**

**Adding cloud instances to the Deployment Tab:** You can include information about the instances that you use through the extension settings. There you will find an option named **providers** that accepts a list of urls separated by commas. Each url must be a JSON file that follows the schema specified here : [schema](skyline-vscode/react-ui/src/schema/CloudProvidersSchema.js).<br/>
Additionally, you need to add the necessary access so the extension can read the file.<br/>
You can use an AWS S3 bucket to store your files. Change CORS settings in Permissions tab.

**CORS requirements**:
```
[
    {
        "AllowedHeaders": [],
        "AllowedMethods": [
            "GET"
        ],
        "AllowedOrigins": [
            "http://*",
            "https://*",
            "vscode-webview://*"
        ],
        "ExposeHeaders": []
    }
]
```
and allow public access to the file

This is our [file](https://deepview-explorer-public.s3.amazonaws.com/vscode-cloud-providers/providers.json) that you can use as an example.





### Backend Installation
This plugin requires DeepView.Profile (the installation instruction for which can be found [here](https://github.com/CentML/DeepView.Profile)) and (optionally) DeepView.Predict (used to extrapolate GPU runtimes, instructions found [here](https://github.com/CentML/DeepView.Predict)). **DeepView.Profile must be launched before running this extension.**

After installation, please make note of the path to the `DeepView.Profile` binary. To do so, run `which deepview` after ensuring that the `DeepView.Profile` binary works. This path is different depending on how the backend was installed. Default installation from PyPI will place the binary to `/usr/bin/deepview`, however if you're running the backend in virtual environment it will be in a different location. **You need to launch `DeepView.Profile` before running this extension.**

## Usage example
1. Open one of the examples DNN project examples, i.e. [Resnet](https://github.com/CentML/DeepView.Profile/tree/main/examples/resnet) from DeepView.Profile in VSCode
2. (Optional) You can add other external cloud instances using the **providers** option in the extension
3. Press `Ctrl+Shift+P`, then select `Deepview` from the dropdown list.
3. Click on `Begin Analysis`.

## Disabling telemetry
If you do not want to send usage data to CentML, you can set isTelemetryEnabled setting to "No".

You can set the value by going to File > Preferences > Settings (On macOS: Code > Preferences > Settings), and search for telemetry. Then set the value in Deepview > Is Telemetry Enabled. This will disable all telemetry events.

As well, DeepView respects VSCode's telemetry levels. IF telemetry.telemetryLevel is set to off, then no telemetry events will be sent to CentML, even if deepview.telemetry.enabled is set to true. If telemetry.telemetryLevel is set to error or crash, only events containing an error or errors property will be sent to CentML.

## Development Environment Setup

### Dependencies
1. https://github.com/CentML/DeepView.Profile
   
   - Note: depending on you choose to install the backend you might need to set the backend path.
2. [Node.js](https://nodejs.org/en/) and npm
3. Protobuf
```bash
apt install protobuf-compiler
```

### Setup
1. Clone this repository:
   ```zsh
   git clone https://github.com/CentML/DeepView.Explore
   ```
1. Install project dependencies
   ```zsh
   cd skyline-vscode/react-ui && npm install
   cd ../..
   cd skyline-vscode/skyline-vscode && npm install
   ```
1. Compile protobuf files:
   ```zsh
   cd src/protobuf
   make
   ```
## Run extension
Start VSCode in the plugin source directory:
```
cd skyline-vscode/skyline-vscode;
code .
```
Press `F5` to compile and run the extension. When the extension window appears, open of the [example projects](https://github.com/CentML/DeepView.Profile/tree/main/examples). Then press `Ctrl-Shift-P` then select `Begin Analysis`.

To debug the React UI without extension code use `npm start`

## Release process
1. Make sure you're on main branch and it is clean
2. Run [scripts/prepare-release.sh](tools/prepare-release.sh) which will:
    * Increment the version
    * Create a release branch
    * Create a release PR
1. After the PR is merged, the [build-vsix.yaml](.github/workflows/build-vsix.yaml) GitHub action will:
    * Build the VSIX file
    * GitHub release
    * Upload the VSIX file to S3

## Release history
See [Releases](https://github.com/CentML/DeepView.Explore/releases).

## Meta
See [DeepView.Profile](https://github.com/CentML/DeepView.Profile).

## Contributing
 - Guidelines on how to contribute to the project
