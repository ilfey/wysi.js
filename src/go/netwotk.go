package main

import "math"

func activate(x float64) float64 {
	return 1 / (1 + math.Exp(-x))
}

func activate_dx(x float64) float64 {
	return activate(x) * (1 - activate(x))
}

func (network *Network) predict(data PredictData) {

	// info("Start predict...")

	network.hiddenLayerSum = nil
	for _, weights := range Transpose(network.inputWeights) {
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
	for _, weights := range Transpose(network.hiddenWeights) {
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

	Debugger.info("outputLayer", network.outputLayer)
}

func (network *Network) train(data TrainData) {

	Debugger.info("Start learning...")

	for e := 0; e < data.eras; e++ {

		layer := data.layers[e%len(data.layers)]

		// info("era ", e, "with layer:", layer)

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
		for index, weights := range Transpose(network.hiddenWeights) {
			var newWeights []float64
			for weightIndex, weight := range weights {
				newWeights = append(newWeights, weight-(network.hiddenLayer[weightIndex]*hiddenGradient[index]*data.learning_rate))
			}
			newHiddenWeights = append(newHiddenWeights, newWeights)
		}
		network.hiddenWeights = Transpose(newHiddenWeights)

		var inputGradient []float64
		for _, weights := range Transpose(network.inputWeights) {
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
		network.inputWeights = Transpose(newInputWeights)
	}

	Debugger.success("End learning...")
}
