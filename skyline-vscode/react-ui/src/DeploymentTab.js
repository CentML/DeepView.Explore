
import Subheader from './Subheader';
import ProviderPanel from './ProviderPanel';
import TrainingPanel from './TrainingPanel';
import { Alert, Accordion, Button, Card, Col, Tab, Tabs, Row, Container } from 'react-bootstrap';
import React from 'react';
import { useState } from 'react';

export default class DeploymentTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = { activeTab: "0", btnDeployVariant: 'secondary', btnDeployLabel: 'Deploy and Run Model'}; 
        this.deployOnClick = this.deployOnClick.bind(this);
    }


    deployOnClick() {
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }

        setTimeout(async () => {
            this.setState({ btnDeployVariant: 'secondary', btnDeployLabel: 'Deploying Model....'});
            await sleep(1000);

            this.setState({ activeTab: "1" });
        }, 100);
    }

    render() {
        return (
            <>
                <Accordion defaultActiveKey="0" activeKey={this.state.activeTab}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Deployment Target</Accordion.Header>
                        <Accordion.Body>
                            <ProviderPanel setParentState={this.setState.bind(this)} />
                            <Row>
                                <Col><Button variant={this.state.btnDeployVariant} disabled={true || this.state.btnDeployVariant=='secondary'} onClick={this.deployOnClick}>{this.state.btnDeployLabel}</Button></Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Training</Accordion.Header>
                        <Accordion.Body>
                            <TrainingPanel></TrainingPanel>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </>
        );
    }
}