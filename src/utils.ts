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

export function calculateSum(layer: Array<number>, weights: Array<number>[]): Array<number> {
	return weights.map((neuronWeights: Array<number>) => {
		return neuronWeights.reduce((prev: number, curr: number, index: number) => {
			return prev + curr * layer[index];
		}, neuronWeights[0] * layer[0]);
	});
}

export function activate(layer: Array<number>, weights: Array<number>[], activation: (x: number) => number): Array<number> {
	return weights.map((neuronWeights: Array<number>) => {
		return activation(neuronWeights.reduce((prev: number, curr: number, index: number) => {
			return prev + curr * layer[index];
		}, neuronWeights[0] * layer[0]));
	});
}

export function calculateWeights(weights: Array<number>[], layerOfWeights: Array<number>, gradient: Array<number>, learningRate: number): Array<number>[]{
	return weights.map((neuronWeights, neuronWeightsIndex) => {
		return neuronWeights.map((weight, weightIndex) => {
			return weight - (layerOfWeights[weightIndex] * gradient[neuronWeightsIndex] * learningRate);
		});
	});
}