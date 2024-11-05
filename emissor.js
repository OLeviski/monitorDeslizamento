// Emissor de dados MQTT - Emissor.js

const mqtt = require('mqtt');

// Configurações do broker MQTT com autenticação
const options = {
    host: 'localhost',
    port: 1883,
    username: 'root',
    password: 'root'
};

const client = mqtt.connect(options);
const TOPIC = 'datacenter/sensor';

// Conecta ao broker MQTT
client.on('connect', () => {
  console.log('Conectado ao broker MQTT');

  setInterval(() => {
    // Simula valores de umidade e vibração aleatórios
    const umidade = Math.floor(Math.random() * 1000); // Simulação de umidade (0-1000)
    const vibracao = Math.floor(Math.random() * 1000); // Simulação de vibração (0-1000)

    // Cria um objeto de dados para o MQTT
    const data = JSON.stringify({ umidade, vibracao });

    // Publica no tópico
    client.publish(TOPIC, data);
    console.log(`Dados publicados - Umidade: ${umidade}, Vibração: ${vibracao}`);
  }, 10000); // Publica a cada 10 segundo
});
