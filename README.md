# wysi

## How to build it?

for linux or mac os:

```shell
npm run build
```

for windows

```shell
npm run build:ts
cd ./wysi.js/src/go
GOOS=windows GOARCH=amd64 go build -o ./dist/bin/win.exe .
GOOS=linux GOARCH=amd64 go build -o ./dist/bin/linux .
GOOS=darwin GOARCH=amd64 go build -o ./dist/bin/darwin .
```

If you want to build a project for one OS use

```shell
# build typescript
npm run build:ts

# change directory
cd ./wysi.js/src/go

# and build binary for your os:


# windows 64-bit architecture
GOOS=windows GOARCH=amd64 go build -o ./dist/bin/win.exe .

# windows 32-bit architecture
GOOS=windows GOARCH=386 go build -o ./dist/bin/win.exe .


# linux 64-bit architecture
GOOS=linux GOARCH=amd64 go build -o ./dist/bin/linux .

# linux 32-bit architecture
GOOS=linux GOARCH=386 go build -o ./dist/bin/linux .


# mac os 64-bit architecture
GOOS=darwin GOARCH=amd64 go build -o ./dist/bin/darwin .

# mac os 32-bit architecture
GOOS=darwin GOARCH=386 go build -o ./dist/bin/darwin .
```
