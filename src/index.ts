import { Debugger, IDebugger } from "./debugger";
import { transpose, random2d, calculateSum, calculateWeights, activate } from "./utils";


export const Network = (opts: IOpts | undefined): INetwork => {

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

	let debug: IDebugger = Debugger(opts.debug);

	debug.info(opts);

	let network: INetwork = {
		_inputWeights: transpose(opts.inputWeights!),
		_hiddenWeights: transpose(opts.hiddenWeights!),
		predict: (data: IPeridictData): Array<number> => {

			debug.info("Start predict...")

			if (data.inputWeights) {
				network._inputWeights = transpose(data.inputWeights);
			}

			if (data.hiddenWeights) {
				network._hiddenWeights = transpose(data.hiddenWeights);
			}

			debug.info("inputWeights", network._inputWeights);
			debug.info("hiddenWeights", network._hiddenWeights);


			network._hiddenLayerSum = calculateSum(data.inputLayer, network._inputWeights);
			network._hiddenLayer = network._hiddenLayerSum.map((neuron: number) => opts!.activation(neuron));

			network._outputLayerSum = calculateSum(network._hiddenLayer, network._hiddenWeights);
			const outputLayer = network._outputLayerSum.map(neuron => opts!.activation(neuron));

			debug.success("End predict");
			debug.info("outputLayer", outputLayer);

			return outputLayer;
		},
		train: (data: ITrainData): ITrainedWeights => {

			debug.info("Start learning...")

			if (data.inputWeights) {
				network._inputWeights = transpose(data.inputWeights);
			}

			if (data.hiddenWeights) {
				network._hiddenWeights = transpose(data.hiddenWeights);
			}

			debug.info("start inputWeights", network._inputWeights)
			debug.info("start hiddenWeights", network._hiddenWeights)


			for (let i = 0; i < data.eras; i++) {

				let outputLayer = network.predict({
					inputLayer: data.inputLayer
				});

				const outputError = data.actualOutputLayer.map((neuron: number, index: number) => neuron - outputLayer[index]);

				const weightsDelta: Array<number> = network._outputLayerSum!.map((sum: number, index: number) => outputError[index] * opts!.activation_dx(sum));

				network._hiddenWeights = calculateWeights(network._hiddenWeights, network._hiddenLayer!, weightsDelta, opts!.learning_rate!);

				network._hiddenLayer = activate(weightsDelta, transpose(network._hiddenWeights), opts!.activation);

				network._inputWeights = calculateWeights(network._inputWeights, data.inputLayer, network._hiddenLayer, opts!.learning_rate!);
			}

			const hiddenWeights = transpose(network._hiddenWeights);
			const inputWeights = transpose(network._inputWeights);

			debug.success("End learning.");

			debug.info("inputWeights", inputWeights);
			debug.info("hiddenWeights", hiddenWeights);

			return {
				inputWeights,
				hiddenWeights,
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