#!/usr/bin/env bash

if brew ls --versions giflib > /dev/null; then
    echo "brew already installed"
else
    brew install pkg-config cairo libpng jpeg giflib
fi