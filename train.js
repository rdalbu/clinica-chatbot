const brain = require('brain.js');
const fs = require('fs');

const rawData = fs.readFileSync('./treinamento-Data.json');
const conversationData = JSON.parse(rawData);

const trainingData = conversationData.map(entry => {
  return {
    input: { [entry.input.toLowerCase()]: 1 }, 
    output: { [entry.output]: 1 }
  };
});

const net = new brain.NeuralNetwork({
  hiddenLayers: [20, 20],
  activation: 'sigmoid'
});


const stats = net.train(trainingData, {
  iterations: 50000,
  log: true,
  logPeriod: 1000,
  learningRate: 0.1
});

fs.writeFileSync('./data/neuralnet.json', JSON.stringify(net.toJSON()));
console.log('Rede neural treinada e salva!');
