# DeepView Explore
![DeepView](https://raw.githubusercontent.com/CentML/DeepView.Explore/main/deepview-explore/react-ui/public/resources/deepview.png)

DeepView provides an integrated experience which allows ML practioners to
- Visually identify model bottlenecks
- Perform rapid iterative profiling
- Understand energy consumption and environmental impacts of training jobs
- Predict deployment time and cost to cloud hardware

![DeepView](https://docs.centml.ai/_images/deepview.gif)

### Backend Installation
This plugin requires DeepView.Profile to be installed for which can be found [here](https://github.com/CentML/DeepView.Profile) **You need to launch `DeepView.Profile` before running this extension.**

## Usage example
1. Run DeepView.Profile
2. Open one of the examples DNN project examples, i.e. [Resnet](https://github.com/CentML/DeepView.Profile/tree/main/examples/resnet) from DeepView.Profile in VSCode
3. (Optional) You can add other external cloud instances using the **providers** option in the extension
4. Press `Ctrl+Shift+P`, then select `DeepView` from the dropdown list.
5. Click on `Begin Analysis`.

## Disabling telemetry
If you do not want to send usage data to CentML, you can set isTelemetryEnabled setting to "No".

You can set the value by going to File > Preferences > Settings (On macOS: Code > Preferences > Settings), and search for telemetry. Then set the value in DeepView > Is Telemetry Enabled. This will disable all telemetry events.

As well, DeepView respects VSCode's telemetry levels. IF telemetry.telemetryLevel is set to off, then no telemetry events will be sent to CentML, even if deepview.telemetry.enabled is set to true. If telemetry.telemetryLevel is set to error or crash, only events containing an error or errors property will be sent to CentML.

**Adding cloud instances to the Deployment Tab:** You can include information about the instances that you use through the extension settings. There you will find an option named **providers** that accepts a list of urls separated by commas. Each url must be a JSON file that follows the schema specified here: [schema](deepview-explore/react-ui/src/schema/CloudProvidersSchema.js).<br/>
Additionally, you need to add the necessary access so the extension can read the file.<br/>
You can use an AWS S3 bucket to store your files. Note that you need to update the CORS settings in Permissions tab to enable the extension to read your file.

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

This is our [file](https://deepview-explorer-public.s3.amazonaws.com/vscode-cloud-providers/providers.json) that you can use as an example.

## Additional Documentation
Documentation can be found at https://docs.centml.ai/index.html
