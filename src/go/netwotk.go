package main

import "math"

func activate(x float64) float64 {
	return 1 / (1 + math.Exp(-x))
}

func (network *Network) predict(data PredictData) {

	network.outputLayer = nil
	for _, weights := range Transpose(network.inputWeights) {
		var result float64
		for index, weight := range weights {
			result += weight * data.inputLayer[index]
		}
		network.outputLayer = append(network.outputLayer, activate(result))
	}
}

func (network *Network) train(data TrainData) {

	Debugger.info("Start training...")

	for e := 0; e < data.eras; e++ {

		layer := data.layers[e%len(data.layers)]

		network.predict(PredictData{
			inputLayer: layer.inputLayer,
		})

		var newInputWeights [][]float64
		for index := 0; index < len(network.inputWeights); index++ {
			weights := network.inputWeights[index]
			var newWeights []float64
			for i := 0; i < len(weights); i++ {
				newWeights = []float64{weights[i] + (layer.inputLayer[i] * ((layer.outputLayer[0] - network.outputLayer[0]) * (network.outputLayer[0] * (1 - network.outputLayer[0]))) * data.learning_rate)}
			}
			newInputWeights = append(newInputWeights, newWeights)
		}
		network.inputWeights = newInputWeights
	}

	Debugger.success("Training completed.")
}
