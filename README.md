## wysi

## How to build it?

for linux or mac os: 
```
npm run build
```

for windows
```shell
npm run build:ts
GOOS=windows GOARCH=amd64 go build -o ./dist/win/ ./src/go/main.go
GOOS=linux GOARCH=amd64 go build -o ./dist/linux/ ./src/go/main.go
GOOS=darwin GOARCH=amd64 go build -o ./dist/macos/ ./src/go/main.go
```

If you want to build a project for one OS use


```shell
# build typescript
npm run build:ts


# and build binary for your os:


# windows 64-bit architecture
GOOS=windows GOARCH=amd64 go build -o ./dist/win/ ./src/go/main.go

# windows 32-bit architecture
GOOS=windows GOARCH=386 go build -o ./dist/win/ ./src/go/main.go


# linux 64-bit architecture
GOOS=linux GOARCH=amd64 go build -o ./dist/linux/ ./src/go/main.go

# linux 32-bit architecture
GOOS=linux GOARCH=386 go build -o ./dist/linux/ ./src/go/main.go


# mac os 64-bit architecture
GOOS=darwin GOARCH=amd64 go build -o ./dist/macos/ ./src/go/main.go

# mac os 32-bit architecture
GOOS=darwin GOARCH=386 go build -o ./dist/macos/ ./src/go/main.go
```
