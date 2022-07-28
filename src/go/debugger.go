package main

import "fmt"

type debugger struct {
	error   func(...any)
	info    func(...any)
	success func(...any)
}

var Debugger = debugger{
	error: func(args ...any) {
		fmt.Println(append([]any{"\x1b[41m[ INFO ]\x1b[0m  "}, args...)...)
	},
	info: func(args ...any) {
		fmt.Println(append([]any{"\x1b[44m[ INFO ]\x1b[0m  "}, args...)...)
	},
	success: func(args ...any) {
		fmt.Println(append([]any{"\x1b[42m[ INFO ]\x1b[0m  "}, args...)...)
	},
}
