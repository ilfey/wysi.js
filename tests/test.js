const {Network, random, random2d} = require("../dist/index");
const { Debugger } = require("../dist/debugger");

const debug = Debugger(true)

const network = Network({
	// debug: false,
	// learning_rate: 0.1,
	// inputWeights: random2d(6,8),
	// hiddenWeights: random2d(8,1)
})

debug.success(
	network.train({
		eras: 100_000,
		inputLayer: [1,1],
		actualOutputLayer: [1]
	})
);

debug.success(network.predict({
	inputLayer: [1,1],
}));