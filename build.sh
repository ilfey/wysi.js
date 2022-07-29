#!/bin/bash

PROJECT_PATH=$(dirname $(readlink -f "$0"))
GO_PATH="$PROJECT_PATH/src/go"
BIN_PATH="$PROJECT_PATH/dist/bin"
WIN_PATH="$BIN_PATH/win.exe"
LINUX_PATH="$BIN_PATH/linux"
DARWIN_PATH="$BIN_PATH/darwin"

echo -e "\033[1;44m"[ Paths ]"\033[0;0m" $"\n"\
GO_PATH = $GO_PATH $"\n"\
BIN_PATH = $BIN_PATH $"\n"

cd $GO_PATH

case $1 in
"all")
    echo -e "\x1b[1;44m"[ Build ]"\033[0;0m"  started for Windows
    GOOS=windows GOARCH=amd64 go build -o $WIN_PATH .
    echo -e "\x1b[1;44m"[ Build ]"\033[0;0m"  started for Linux
    GOOS=linux GOARCH=amd64 go build -o $LINUX_PATH .
    echo -e "\x1b[1;44m"[ Build ]"\033[0;0m"  started for Mac OS
    GOOS=darwin GOARCH=amd64 go build -o $DARWIN_PATH .
    ;;
"win")
    echo -e "\x1b[1;44m"[ Build ]"\033[0;0m"  started for Windows
    GOOS=windows GOARCH=amd64 go build -o $WIN_PATH .
    ;;
"linux")
    echo -e "\x1b[1;44m"[ Build ]"\033[0;0m"  started for Linux
    GOOS=linux GOARCH=amd64 go build -o $LINUX_PATH .
    ;;
"mac")
    echo -e "\x1b[1;44m"[ Build ]"\033[0;0m"  started for Mac OS
    GOOS=darwin GOARCH=amd64 go build -o $DARWIN_PATH .
    ;;
*)
    echo -e "\033[1;42m"[ Error ]"\033[0;0m"  You need to specify the platform [ all, win, linux, mac ]
    exit 1
    ;;
esac
echo -e "\033[1;42m"[ Build ]"\033[0;0m"  completed