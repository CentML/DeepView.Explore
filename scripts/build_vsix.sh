#!/bin/bash

# Build react UI
pushd deepview-explore/react-ui && \
    npm install && \
    npm run build && \
    popd;

# Build backend
pushd deepview-explore && \
    npm install && \
    pushd src/protobuf && 
    make && make old && \
    popd && \
    vsce package && \
    popd;
