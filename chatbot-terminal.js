const brain = require('brain.js');
const fs = require('fs');
const readline = require('readline');

const modelData = fs.readFileSync('./data/neuralnet.json');
const net = new brain.NeuralNetwork().fromJSON(JSON.parse(modelData));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Digite sua pergunta:');

let lastDoctor = null;
let isWaitingForConfirmation = false;

rl.on('line', (input) => {
    const processedInput = input.toLowerCase();

    if (isWaitingForConfirmation) {
        if (processedInput.includes("não") || processedInput.includes("nao")) {
            console.log("Chatbot: Obrigado! Tenha um bom dia.");
            rl.close();
        } else {
            console.log("Chatbot: Ótimo! Como posso te ajudar mais?");
        }
        return;
    }

    if (processedInput.includes("dra maria") || processedInput.includes("dra.maria")) {
        lastDoctor = "Dra. Maria";
        console.log("Chatbot: Dra. Maria está disponível de segunda a sexta, das 7h às 13h.");
    } else if (processedInput.includes("dr joão") || processedInput.includes("dr. joão")) {
        lastDoctor = "Dr. João";
        console.log("Chatbot: Dr. João está disponível de segunda a sexta, das 7h às 13h.");
    } else if (lastDoctor) {
        if (lastDoctor === "Dra. Maria") {
            console.log(`Chatbot: Vou agendar com a ${lastDoctor} às ${processedInput}.`);
        } else if (lastDoctor === "Dr. João") {
            console.log(`Chatbot: Vou agendar com o ${lastDoctor} às ${processedInput}.`);
        }
        
        console.log("Chatbot: Precisa de mais alguma ajuda?");
        isWaitingForConfirmation = true;
    } else {
        const result = net.run({ [processedInput]: 1 });
        let highestValue = 0;
        let response = "Desculpa, não entendi sua pergunta.";
        for (let key in result) {
            if (result[key] > highestValue) {
                highestValue = result[key];
                response = key;
            }
        }
        console.log(`Chatbot: ${response}`);
    }

    console.log('Digite sua pergunta:');
});
