package main

import "fmt"

func main() {

	var network Network = Network{
		inputWeights:  Random2d(2, 3),
		hiddenWeights: Random2d(3, 1),
	}

	fmt.Printf("%+v\n", network)

	network.train(TrainData{
		eras:          1,
		learning_rate: 0.1,
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
		inputLayer: []float64{1, 1},
	})
}
