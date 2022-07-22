import { Debugger, IDebugger } from "./debugger";

export function transpose(array: Array<number>[]): Array<number>[] {
	return array[0].map((_column: number, index: number) => array.map((row: Array<number>) => row[index]))
}

export function random() {
	return Math.random() * (1 + 1) - 1
}

export function random2d(columns: number, rows: number): Array<number>[] {
	let arr: Array<number>[] = [];
	for (let i = 0; i < columns; i++) {
		arr[i] = [];
		for (let j = 0; j < rows; j++) {
			arr[i][j] = random();
		}
	}
	return arr;
}

export const Network = (opts: IOpts | undefined): INetwork => {

	let debug: IDebugger = Debugger(opts!.debug)

	if (!opts) {
		opts = {
			activation: (x: number): number => 1 / (1 + Math.exp(-x)),
			activation_dx: (x: number): number => opts!.activation(x) * (1 - opts!.activation(x)),
			learn: true,
			eras: 100_000,
			inputLayer: [1, 1],
			outputLayer: [1],
		}
	}

	if (!opts.activation || !opts.activation_dx) {
		opts.activation = (x: number): number => 1 / (1 + Math.exp(-x));
		opts.activation_dx = (x: number): number => opts!.activation(x) * (1 - opts!.activation(x));
	}

	if (!opts.inputWeights || !opts.hiddenWeights) {
		opts.inputWeights = random2d(2, 3); // two input neurons and three hidden neurons;
		opts.hiddenWeights = random2d(3, 1); // three hidden neurons and one output neuron
	}

	opts.learning_rate = opts.learning_rate ? opts.learning_rate : 0.1;

	debug.info(opts)

	let network: INetwork = {
		_inputWeights: opts.inputWeights!,
		_hiddenWeights: opts.hiddenWeights!,
		predict: (data: IPeridictData): Array<number> => {

			debug.info("Start predict...")

			network._inputWeights = data.inputWeights ? data.inputWeights! : network._inputWeights;
			network._hiddenWeights = data.hiddenWeights ? data.hiddenWeights! : network._hiddenWeights;

			debug.info("inputWeights", network._inputWeights)
			debug.info("hiddenWeights", network._hiddenWeights)


			network._hiddenLayerSum = transpose(network._inputWeights).map((neuronWeights: Array<number>) => {
				return neuronWeights.reduce((prev: number, curr: number, index: number) => {
					return prev + curr * data.inputLayer[index];
				}, neuronWeights[0] * data.inputLayer[0]);
			});

			network._hiddenLayer = network._hiddenLayerSum.map((neuron: number) => opts!.activation(neuron));

			network._outputLayerSum = transpose(network._hiddenWeights).map((neuronWeights: Array<number>) => {
				return neuronWeights.reduce((prev: number, curr: number, index: number) => {
					return prev + curr * network._hiddenLayer![index];
				}, neuronWeights[0] * network._hiddenLayer![0]);
			});

			return network._outputLayerSum.map(neuron => opts!.activation(neuron));
		},
		train: (data: ITrainData): ITrainedWeights => {

			debug.info("Start learning...")

			network._inputWeights = data.inputWeights ? data.inputWeights : network._inputWeights
			network._hiddenWeights = data.hiddenWeights ? data.hiddenWeights : network._hiddenWeights

			debug.info("start inputWeights", network._inputWeights)
			debug.info("start hiddenWeights", network._hiddenWeights)


			for (let i = 0; i < data.eras; i++) {

				let outputLayer = network.predict({
					inputLayer: data.inputLayer,
					inputWeights: network._inputWeights,
					hiddenWeights: network._hiddenWeights
				});

				const outputError = data.actualOutputLayer.map((neuron: number, index: number) => neuron - outputLayer[index]);

				let weightsDelta: Array<number> = network._outputLayerSum!.map((sum: number, index: number) => outputError[index] * opts!.activation_dx(sum));

				network._hiddenWeights = transpose(network._hiddenWeights).map((neuronWeights, neuronWeightsIndex) => {
					return neuronWeights.map((weight, weightIndex) => {
						return weight - (network._hiddenLayer![weightIndex] * weightsDelta[neuronWeightsIndex] * opts!.learning_rate!);
					});
				});

				network._hiddenLayerSum = transpose(network._hiddenWeights).map((neuronWeights: Array<number>) => {
					return neuronWeights.reduce((prev: number, curr: number, index: number) => {
						return prev + curr * weightsDelta[index]
					}, neuronWeights[0] * weightsDelta[0]);
				});

				network._hiddenLayer = network._hiddenLayerSum.map((neuron => opts!.activation(neuron)));

				network._inputWeights = transpose(network._inputWeights).map((neuronWeights, neuronWeightsIndex) => {
					return neuronWeights.map((weight, weightIndex) => {
						return weight - (data.inputLayer[weightIndex] * network._hiddenLayer![neuronWeightsIndex] * opts!.learning_rate!);
					});
				});

				network._hiddenWeights = transpose(network._hiddenWeights);
				network._inputWeights = transpose(network._inputWeights);
			}
			debug.success("End learning.")

			debug.info("inputWeights", network._inputWeights)
			debug.info("hiddenWeights", network._hiddenWeights)

			return {
				inputWeights: network._inputWeights,
				hiddenWeights: network._hiddenWeights,
			}
		}
	}

	return network
}

export interface IOpts {
	debug?: boolean;
	activation: (x: number) => number;
	activation_dx: (x: number) => number;
	learn?: boolean;
	eras?: number;
	learning_rate?: number;
	inputLayer: Array<number>;
	outputLayer: Array<number>;
	inputWeights?: Array<number>[];
	hiddenWeights?: Array<number>[];
}

export interface IPeridictData {
	inputLayer: Array<number>;
	inputWeights?: Array<number>[];
	hiddenWeights?: Array<number>[];
}

export interface ITrainData {
	eras: number;
	inputLayer: Array<number>;
	inputWeights?: Array<number>[];
	hiddenWeights?: Array<number>[];
	actualOutputLayer: Array<number>;
}

export interface ITrainedWeights {
	inputWeights: Array<number>[];
	hiddenWeights: Array<number>[];
}

export interface INetwork {
	_inputWeights: Array<number>[];
	_hiddenWeights: Array<number>[];
	_hiddenLayer?: Array<number>,
	_hiddenLayerSum?: Array<number>,
	_outputLayer?: Array<number>,
	_outputLayerSum?: Array<number>,
	predict: (data: IPeridictData) => Array<number>;
	train: (data: ITrainData) => ITrainedWeights;
}