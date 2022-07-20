const {Network, random} = require("../dist/index");

const network = Network({
	learning_rate: 0.1
})
console.log(
	network.train({
		eras: 1_000_000,
		inputLayer: [1, 1],
		inputWeights: [ // two input neurons and three hidden neurons
			[random(), random(), random()],
			[random(), random(), random()],
		],
		hiddenWeights: [ // one output neuron and three hidden neurons
			[random()],
			[random()],
			[random()],
		],
		actualOutputLayer: [1]
	})
);


console.log(network.predict({
	inputLayer: [1, 1]
}));