package main

import (
	"fmt"
	"math"
	"math/rand"
)

func error(args ...any) {
	fmt.Println(append([]any{"\x1b[41m[ INFO ]\x1b[0m  "}, args...)...)
}

func info(args ...any) {
	fmt.Println(append([]any{"\x1b[44m[ INFO ]\x1b[0m  "}, args...)...)
}

func success(args ...any) {
	fmt.Println(append([]any{"\x1b[42m[ INFO ]\x1b[0m  "}, args...)...)
}

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

type PredictData struct {
	inputLayer []float64
}

type TrainLayers struct {
	inputLayer  []float64
	outputLayer []float64
}

type TrainData struct {
	eras          int
	learning_rate float64
	layers        []TrainLayers
}

func activate(x float64) float64 {
	return 1 / (1 + math.Exp(-x))
}

func activate_dx(x float64) float64 {
	return activate(x) * (1 - activate(x))
}

func (network *Network) predict(data PredictData) {

	info("Start predict...")

	network.hiddenLayerSum = nil
	for _, weights := range transpose(network.inputWeights) {
		var result float64

		for index, weight := range weights {
			result += weight * data.inputLayer[index]
		}
		network.hiddenLayerSum = append(network.hiddenLayerSum, result)
	}

	network.hiddenLayer = nil
	for _, sum := range network.hiddenLayerSum {
		network.hiddenLayer = append(network.hiddenLayer, activate(sum))
	}

	network.outputLayerSum = nil
	for _, weights := range transpose(network.hiddenWeights) {
		var result float64
		for index, weight := range weights {
			result += weight * network.hiddenLayer[index]
		}
		network.outputLayerSum = append(network.outputLayerSum, result)
	}

	network.outputLayer = nil
	for _, sum := range network.outputLayerSum {
		network.outputLayer = append(network.outputLayer, activate(sum))
	}

	info("outputLayer", network.outputLayer)
}

func (network *Network) train(data TrainData) {

	info("Start learning...")

	for e := 0; e < data.eras; e++ {

		layer := data.layers[e%len(data.layers)]

		info("era ", e, "with layer:", layer)

		network.predict(PredictData{
			inputLayer: layer.inputLayer,
		})

		var errors []float64
		for index, neuron := range layer.outputLayer {
			errors = append(errors, neuron-network.outputLayer[index])
		}

		var hiddenGradient []float64
		for index, sum := range network.outputLayerSum {
			hiddenGradient = append(hiddenGradient, errors[index]*activate_dx(sum))
		}

		var newHiddenWeights [][]float64
		for index, weights := range transpose(network.hiddenWeights) {
			var newWeights []float64
			for weightIndex, weight := range weights {
				newWeights = append(newWeights, weight-(network.hiddenLayer[weightIndex]*hiddenGradient[index]*data.learning_rate))
			}
			newHiddenWeights = append(newHiddenWeights, newWeights)
		}
		network.hiddenWeights = transpose(newHiddenWeights)

		var inputGradient []float64
		for _, weights := range transpose(network.inputWeights) {
			var result float64
			for index, weight := range weights {
				result += weight * layer.inputLayer[index]
			}
			inputGradient = append(inputGradient, activate(result))
		}

		var newInputWeights [][]float64
		for index, weights := range network.hiddenWeights {
			var newWeights []float64
			for weightIndex, weight := range weights {
				newWeights = append(newWeights, weight-(layer.inputLayer[weightIndex]*inputGradient[index]*data.learning_rate))
			}
			newInputWeights = append(newInputWeights, newWeights)
		}
		network.inputWeights = transpose(newInputWeights)
	}

	success("End learning...")
}

func main() {

	var network Network = Network{
		inputWeights:  random2d(2, 3),
		hiddenWeights: random2d(3, 1),
	}

	fmt.Printf("%+v\n", network)

	network.train(TrainData{
		eras:          1000,
		learning_rate: 0.001,
		layers: []TrainLayers{
			{
				inputLayer:  []float64{1, 1},
				outputLayer: []float64{1},
			},
			{
				inputLayer:  []float64{0, 0},
				outputLayer: []float64{1},
			},
			{
				inputLayer:  []float64{1, 0},
				outputLayer: []float64{0},
			},
			{
				inputLayer:  []float64{0, 1},
				outputLayer: []float64{0},
			},
		},
	})

	fmt.Printf("%+v\n", network)

	network.predict(PredictData{
		inputLayer: []float64{100, 1},
	})
}
