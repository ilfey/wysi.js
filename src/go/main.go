package main

import (
	"fmt"
	"math"
	"math/rand"
)

/**
 * this function traspose array
 * example: [[1,2],[3,4]] => [[1,3],[2,4]]
 */
func transpose(transposeArray [][]float64) [][]float64 {

	var array [][]float64

	for index := range transposeArray[0] {
		var row []float64

		for _, transposeRow := range transposeArray {
			row = append(row, transposeRow[index])
		}
		array = append(array, row)
	}

	return array
}

/**
 * generates a random float64 from -1 to 1
 */
func random() float64 {
	return rand.Float64()*2 - 1
}

/**
 * generates a random float64 2d array from -1 to 1
 */
func random2d(rows, columns int) [][]float64 {

	array := make([][]float64, rows)

	for i := 0; i < rows; i++ {
		row := make([]float64, columns)
		for j := 0; j < columns; j++ {
			row[j] = random()
		}
		array[i] = row
	}

	return array
}

type Network struct {
	inputLayer     []float64
	inputWeights   [][]float64
	hiddenLayerSum []float64
	hiddenLayer    []float64
	hiddenWeights  [][]float64
	outputLayerSum []float64
	outputLayer    []float64
}

func activate(x float64) float64 {
	return 1 / (1 + math.Exp(-x))
}

func activate_dx(x float64) float64 {
	return activate(x) * (1 - activate(x))
}

func (network *Network) predict() {

	for _, weights := range transpose(network.inputWeights) {
		var result float64
		for index, weight := range weights {
			result += weight * network.inputLayer[index]
		}
		network.hiddenLayerSum = append(network.hiddenLayerSum, result)
	}

	for _, sum := range network.hiddenLayerSum {
		network.hiddenLayer = append(network.hiddenLayer, activate(sum))
	}

	for _, weights := range transpose(network.hiddenWeights) {
		var result float64
		for index, weight := range weights {
			result += weight * network.hiddenLayer[index]
		}
		network.outputLayerSum = append(network.outputLayerSum, result)
	}

	for _, sum := range network.outputLayerSum {
		network.outputLayer = append(network.outputLayer, activate(sum))
	}

}

func main() {

	var network Network = Network{
		inputLayer:    []float64{1, 1},
		inputWeights:  random2d(2, 3),
		hiddenWeights: random2d(3, 1),
	}

	fmt.Printf("%+v\n", network)

	network.predict()

	fmt.Printf("%+v\n", network)

}
