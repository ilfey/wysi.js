package main

type Network struct {
	inputWeights   [][]float64
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
