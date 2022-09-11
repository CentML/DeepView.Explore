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

### Dependencies
1. https://github.com/CentML/skyline. Note: depending on you choose to install the backend you might need to set the backend path.
1. [Node.js](https://nodejs.org/en/) and npm
1. Protobuf
```zsh
apt install protobuf-compiler
```

### Setup
1. Clone this repository:
   ```zsh
   git clone https://github.com/CentML/mltools-vscode
   ```
1. Install project dependencies
   ```zsh
   cd mltools-vscode/react-ui && npm install
   cd ../..
   cd mltools-vscode/skyline-vscode && npm install
   ```
1. Compile protobuf files:
   ```zsh
   cd src/protobuf
   make
   ```
## Run extension
Start VSCode in the plugin source directory:
```
cd mltools-vscode/skyline-vscode;
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
