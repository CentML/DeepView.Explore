# Installation Guide
## Install dependencies
### Python
```
apt install python3 virtualenv
```
### Nodejs and npm
Using the [nodejs install guide](https://github.com/nodesource/distributions/blob/master/README.md), run the following commands in Ubuntu:
```
curl -fsSL https://deb.nodesource.com/setup_17.x | sudo -E bash -
sudo apt-get install -y nodejs
```
### Protobuf
```
apt install protobuf-compiler
```
## Download and build components
### Python virtualenv
Create a Python virtual environment
```
virtualenv venv -p python3
source venv/bin/activate
```
Make note of the location of the Python binary with the following command:
```
$ which python
/home/ybgao/home/habitat_demo/venv/bin/python
```

### Skyline backend
First clone the skyline source code:
```
git clone https://github.com/geoffxy/skyline
```
Ensure that the virtual environment is activated, then install the habitat backend.
```
cd skyline/cli
pip install --editable .
```
Verify that skyline is installed by running `skyline`. You should get the following:
```
(venv) $ skyline
usage: skyline [-h] [-v] {interactive,memory,time} ...

Skyline: Interactive Neural Network Performance Profiler, Visualizer, and
Debugger for PyTorch

optional arguments:
  -h, --help            show this help message and exit
  -v, --version         Print the version and exit.

Commands:
  {interactive,memory,time}
    interactive         Start a new Skyline interactive profiling session.
    memory              Generate a memory usage report.
    time                Generate an iteration run time breakdown report.
```
### VSCode plugin
Clone the plugin source code:
```
git clone git@github.com:UofT-EcoSystem/skyline-vscode.git
```
Install `node` requirements:
```
cd skyline-vscode/react-test && npm install
cd ../..
cd skyline-vscode/skyline-vscode && npm install
```
Compile protobuf files:
```
cd src/protobuf
make
```
In `src/extension.ts`, update paths to `python` and the react project. 

At around line 59, change the first parameter to path of the python binary:
```ts
skylineProcess = cp.spawn(
    "/home/ybgao/home/habitat_demo/venv/bin/python",
    ["-m", "skyline", "interactive", "--skip-atom", "--debug", "entry_point.py" ],
    { cwd: uri[0].fsPath }
);
```
Next, at around line 39, update the path to the react project:
```ts
const panel = vscode.window.createWebviewPanel(
    'skyline',
    "Skyline",
    vscode.ViewColumn.Beside,
    {
        enableScripts: true,
        localResourceRoots: [
            vscode.Uri.file("/home/ybgao/home/habitat_demo/skyline-vscode/react-test/build")
        ]
    }
);
```
We should also update the path in `src/skyline_session.js`. At around line 213:
```ts
const buildPath = "/home/ybgao/home/habitat_demo/skyline-vscode/react-test";
```
Note that this path does not have the `/build` part. 

## Run extension
Start VSCode in the plugin source directory:
```
cd skyline-vscode/skyline-vscode;
code .
```
Press `F5` to compile and run the extension. When the extension window appears, press `Ctrl-Shift-P` then select `Begin Analysis`.

If the above fails, copy `src/protobuf/innpv_pb.js` to `out/protobuf/innpv_pb.js`.

Otherwise, select the directory with `entry_point.py`, then select `Begin Analysis` again to begin profiling.