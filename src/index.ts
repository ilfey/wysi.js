
export function transpose(array: Array<number>[]): Array<number>[] {
	return array[0].map((_column: number, index: number) => array.map((row: Array<number>) => row[index]))
}

export function random() {
	return Math.random() * (1 + 1) - 1
}

export function Network(opts: IOpts | undefined): INetwork {

	if (!opts) {
		opts = {
			activation: (x: number): number => 1 / (1 + Math.exp(-x)),
			activation_dx: (x: number): number => opts!.activation(x) * (1 - opts!.activation(x)),
			learn: true,
			learning_rate: 0.1,
			eras: 100000,
			inputLayer: [1, 1],
			outputLayer: [1],
			inputWeights: [ // two input neurons and three hidden neurons
				[random(), random(), random()],
				[random(), random(), random()],
			],
			hiddenWeights: [ // one output neuron and three hidden neurons
				[random()],
				[random()],
				[random()],
			]
		}
	}

	if (!opts.activation || !opts.activation_dx){
			opts.activation = (x: number): number => 1 / (1 + Math.exp(-x));
			opts.activation_dx = (x: number): number => opts!.activation(x) * (1 - opts!.activation(x));
	}

	opts.learning_rate = 'learning_rate' in opts ? opts.learning_rate : 0.1;

	let network: INetwork = {
		_isLearned: false,
		predict: (data: IPeridictData): Array<number> => {
			let inputWeights: Array<number>[] = network._isLearned && !data.inputWeights ? network._inputWeights! : data.inputWeights!;
			let hiddenWeights: Array<number>[] = network._isLearned && !data.hiddenWeights ? network._hiddenWeights! : data.hiddenWeights!;

			network._hiddenLayerSum = transpose(inputWeights).map((neuronWeights: Array<number>) => {
				return neuronWeights.reduce((prev: number, curr: number, index: number) => {
					return prev + curr * data.inputLayer[index];
				}, neuronWeights[0] * data.inputLayer[0]);
			});

			network._hiddenLayer = network._hiddenLayerSum.map((neuron: number) => opts!.activation(neuron));

			network._outputLayerSum = transpose(hiddenWeights).map((neuronWeights: Array<number>) => {
				return neuronWeights.reduce((prev: number, curr: number, index: number) => {
					return prev + curr * network._hiddenLayer![index];
				}, neuronWeights[0] * network._hiddenLayer![0]);
			});

			return network._outputLayerSum.map(neuron => opts!.activation(neuron));
		},
		train: (data: ITrainData): ITrainedWeights => {
			network._isLearned = true;

			for (let i = 0; i < data.eras; i++) {

				let outputLayer = network.predict({
					inputLayer: data.inputLayer,
					inputWeights: data.inputWeights,
					hiddenWeights: data.hiddenWeights
				});

				const outputError = data.actualOutputLayer.map((neuron: number, index: number) => neuron - outputLayer[index]);

				let weightsDelta: Array<number> = network._outputLayerSum!.map((sum: number, index: number) => outputError[index] * opts!.activation_dx(sum));

				network._hiddenWeights = transpose(data.hiddenWeights).map((neuronWeights, neuronWeightsIndex) => {
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

				network._inputWeights = transpose(data.inputWeights).map((neuronWeights, neuronWeightsIndex) => {
					return neuronWeights.map((weight, weightIndex) => {
						return weight - (data.inputLayer[weightIndex] * network._hiddenLayer![neuronWeightsIndex] * opts!.learning_rate!);
					});
				});

				network._hiddenWeights = transpose(network._hiddenWeights);
				network._inputWeights = transpose(network._inputWeights);
			}
			return {
				inputWeights: network._inputWeights!,
				hiddenWeights: network._hiddenWeights!,
			}
		}
	}

	return network
}

export interface IOpts {
	activation: (x: number) => number;
	activation_dx: (x: number) => number;
	learn?: boolean;
	eras?: number;
	learning_rate?: number;
	inputLayer: Array<number>;
	outputLayer: Array<number>;
	inputWeights: Array<number>[];
	hiddenWeights: Array<number>[];
}

export interface IPeridictData {
	inputLayer: Array<number>;
	inputWeights?: Array<number>[];
	hiddenWeights?: Array<number>[];
}

export interface ITrainData {
	eras: number;
	inputLayer: Array<number>;
	inputWeights: Array<number>[];
	hiddenWeights: Array<number>[];
	actualOutputLayer: Array<number>;
}

export interface ITrainedWeights {
	inputWeights: Array<number>[];
	hiddenWeights: Array<number>[];
}

export interface INetwork {
	_isLearned: boolean;
	_inputWeights?: Array<number>[];
	_hiddenWeights?: Array<number>[];
	_hiddenLayer?: Array<number>,
	_hiddenLayerSum?: Array<number>,
	_outputLayer?: Array<number>,
	_outputLayerSum?: Array<number>,
	predict: (data: IPeridictData) => Array<number>;
	train: (data: ITrainData) => {
		inputWeights: Array<number>[];
		hiddenWeights: Array<number>[];
	}
}