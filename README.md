# VSCode Plugin for ML Tools

![Demo GIF](https://raw.githubusercontent.com/CentML/mltools-vscode/jun07-usability-improvements/images/demo.gif)

## Installation
Installation consists of two parts: the front-end UI (this repository) and [Skyline](https://github.com/CentML/skyline) (the backend), which needs to be installed separately.

### Frontend Installation
To install, either:
* [Download](http://centml-habitat.s3-website-us-east-1.amazonaws.com/skyline-vscode/) the prebuilt VSCode plugin package
* Build it from source
  1. Prerequisites:
     - node.js v14+
     - [Protobuf Compiler](https://grpc.io/docs/protoc-installation/)
     - npm install -g @vscode/vsce (to build the vscode extension)
  2. Run the following commands    
      ```bash
      git clone https://github.com/CentML/skyline-vscode
      ./scripts/build_vsix.sh
      ```
  3. The vsix file will be generated in the current working directory

Once you have the vsix file, run `code --install-extension vscode*.vsix` to install the extension.
**Note: the file [build_vsix_dev.sh] is only to be used for development**

### Backend Installation
This plugin requires Skyline (the installation instruction for which can be found [here](https://github.com/CentML/skyline)) and (optionally) Habitat (used to extrapolate GPU runtimes, instructions found [here](https://github.com/CentML/habitat)). **Skyline must be launched before running this extension.**

After installation, please make note of the path to the `skyline` binary. To do so, run `which skyline` after ensuring that the `skyline` binary works. This path is different depending on how the backend was installed. Default installation from PyPI will place the binary to `/usr/bin/skyline`, however if you're running the backend in virtual environment it will be in a different location. **You need to launch `skyline` before running this extension.**

## Usage example
1. Open one of the examples DNN project examples, i.e. [Resnet](https://github.com/CentML/skyline/tree/main/examples/resnet) from Skyline in VSCode
2. Press `Ctrl+Shift+P`, then select `Skyline` from the dropdown list.
3. Click on `Begin Analysis`.

## Development Environment Setup

### Dependencies
1. https://github.com/CentML/skyline
   
   - Note: depending on you choose to install the backend you might need to set the backend path.
2. [Node.js](https://nodejs.org/en/) and npm
3. Protobuf
```bash
apt install protobuf-compiler
```

### Setup
1. Clone this repository:
   ```zsh
   git clone https://github.com/CentML/skyline-vscode
   ```
1. Install project dependencies
   ```zsh
   cd skyline-vscode/react-ui && npm install --legacy-peer-deps
   cd ../..
   cd skyline-vscode/skyline-vscode && npm install --legacy-peer-deps
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
Press `F5` to compile and run the extension. When the extension window appears, open of the [example projects](https://github.com/CentML/skyline/tree/main/examples). Then press `Ctrl-Shift-P` then select `Begin Analysis`.

To debug the React UI without extension code, set `const sendMock = true;` in the `react-ui/App.js`, then start the project as any other React.app.

## Release process
In the development environment, run `vsce package` to generate the `.vsix` file.

## Release history
See [Releases](https://github.com/CentML/mltools-vscode/releases).

## Meta
See [Skyline](https://github.com/CentML/skyline).

## Contributing
 - Guidelines on how to contribute to the project
