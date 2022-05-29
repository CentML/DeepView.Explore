
import React from 'react';
import ProjectInfo from './ProjectInfo'
import { Alert, Button, Card, Container, Image, Stack } from 'react-bootstrap';
import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers';

export default class WelcomeScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.acquireApi = this.acquireApi.bind(this);
        this.onClickBeginAnalysis = this.onClickBeginAnalysis.bind(this);

        this.setState({
            btn_clicked: false
        });
    }

    // https://stackoverflow.com/questions/54135313/webview-extension-in-typescript
    /**
     * Returns the vscode API handle. the acquireVsCodeApi function would not be available when compiling
     * the react project, so we need to dynamically look it up. This function also caches the handle and
     * returns it if previously acquired.
     * @returns The VSCode API handle
     */
    acquireApi() {
        if (typeof this.acquireApi.api == 'undefined') {
            console.log("Calling acquire function");
            if (typeof acquireVsCodeApi == "function") {
                let f = window['acquireVsCodeApi'];
                let a = f();
                this.acquireApi.api = a;
            } else {
                this.acquireApi.api = null;
            }
        } else {
            console.log("Api previously acquired. returning.");
        }

        return this.acquireApi.api;
    }

    onClickBeginAnalysis() {
        this.setState({btn_clicked: true});
        let vscode = this.acquireApi();
        vscode.postMessage({
            command: "begin_analysis_clicked"
        });
    }

    render() {
        let {analysisState} = this.props;
        let clicked = false;
        if (this.state != null) {
            clicked = this.state.btn_clicked;
        }
        return (
            <>
            <Container>
                <Card>
                    <Card.Title></Card.Title>
                    <Card.Body>
                        <Stack gap={3}>
                        <Image src="https://skylineprof.github.io/img/skyline_wordmark.svg" width="400px"></Image>
                        { analysisState &&
                            <>
                                <ProjectInfo
                                    projectRoot={analysisState['project_root']}
                                    entryPoint={analysisState['project_entry_point']}
                                />
                            </>
                        }
                        <Button 
                            variant={ (this.state != null && this.state.btn_clicked) ? "secondary" : "success" }
                            size="lg"
                            onClick={this.onClickBeginAnalysis}>
                                {(this.state != null && this.state.btn_clicked) ? "Analyzing Project ..." : "Begin Analysis" }
                        </Button>
                        </Stack>
                    </Card.Body>
                </Card>
            </Container>
            
            </>
        );
    }
}