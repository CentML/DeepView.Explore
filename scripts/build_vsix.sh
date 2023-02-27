#!/bin/bash

# Build react UI
pushd skyline-vscode/react-ui && \
    npm install && \
    npm run build && \
    popd;

# Build backend
pushd skyline-vscode && \
    npm install && \
    pushd src/protobuf && 
    make && make old && \
    popd && \
    vsce package && \
    popd;
