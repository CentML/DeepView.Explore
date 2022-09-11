# VSCode Plugin for ML Tools

![Demo GIF](https://raw.githubusercontent.com/CentML/mltools-vscode/jun07-usability-improvements/images/demo.gif)

## Installation
Installation consists of two parts: the front-end UI, this repository, and the backend https://github.com/CentML/skyline, which needs to be installed separately.

### Frontend Installation
To install, either:
* **TODO**: Download the prebuilt VSCode plugin package from the [Releases](https://github.com/CentML/mltools-vscode/releases) page, then run `code --install-extension vscode*.vsix` to install the extension.
* Clone the repository and run the actions as defined in `package.json` using VSCode. This usually involves pressing `F5` while having the project open in VSCode.

### Backend Installation
This plugin requires both the skyline profiling backend (the installation instruction for which can be found [here](https://github.com/CentML/skyline)) and Habitat (used to extrapolate GPU runtimes, instructions found [here](https://github.com/CentML/habitat)).

After installation, please make note of the path to the `skyline` binary. To do so, run `which skyline` after ensuring that the `skyline` binary works. This path is different depending on how the backend was installed. Default installation from PyPI will place the binary to `/usr/bin/skyline`, however if you're running the backend in virtual environment you'll have to update the path at `Settings -> Extensions -> Skyline -> Skyline_bin_location`.

## Usage example
1. Open one of the examples DNN project examples, i.e. [Resnet](https://github.com/CentML/skyline/tree/main/examples/resnet) from Skyline in VSCode
2. Press `Ctrl+Shift+P`, then select `Skyline` from the dropdown list.
3. Click on `Begin Analysis`.

## Development Environment Setup
Clone this repository then run `npm install` to install all the prerequisites. The `package.json` file defines actions to both build and run the extension using VSCode.

## Release process
In the development environment, run `vsce package` to generate the `.vsix` file.

## Release history
See [Releases](https://github.com/CentML/mltools-vscode/releases).

## Meta
See [Skyline](https://github.com/CentML/skyline).

## Contributing
 - Guidelines on how to contribute to the project
