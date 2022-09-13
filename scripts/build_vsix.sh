#!/bin/bash

# Build react UI
pushd skyline-vscode/react-ui && \
    npm install && \
    npm run build && \
    popd;

# Build plugin
pushd skyline-vscode && \
    npm install && \
    pushd src/protobuf && 
    make && make old && \
    popd && \
    npm install react react-dom && \        # TODO: Replace this with a proper fix in package.json
    vsce package && \
    popd;

