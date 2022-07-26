#!/bin/bash

case $1 in 
    "all")
        echo "Build started for Windows";
        GOOS=windows GOARCH=amd64 go build -o ./dist/win/ ./src/go/main.go;
        echo "Build started for Linux";
        GOOS=linux GOARCH=amd64 go build -o ./dist/linux/ ./src/go/main.go;
        echo "Build started for Mac OS";
        GOOS=darwin GOARCH=amd64 go build -o ./dist/macos/ ./src/go/main.go;;
    "win")
        echo "Build started for Windows";
        GOOS=windows GOARCH=amd64 go build -o ./dist/win/ ./src/go/main.go;;
    "linux")
        echo "Build started for Linux";
        GOOS=linux GOARCH=amd64 go build -o ./dist/linux/ ./src/go/main.go;;
    "mac")
        echo "Build started for Mac OS";
        GOOS=darwin GOARCH=amd64 go build -o ./dist/macos/ ./src/go/main.go;;
    *)
        echo "You need to specify the platform [ all, win, linux, mac ]"; exit 1;;
esac