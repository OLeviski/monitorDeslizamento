require('dotenv').config();
const mqtt = require('mqtt');
const twilio = require('twilio');

// Configuração do Twilio usando variáveis de ambiente
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

// Configuração do broker MQTT usando variáveis de ambiente
const options = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
};

const client = mqtt.connect(options);
const TOPIC = 'datacenter/sensor';
const fromWhatsAppNumber = process.env.TWILIO_FROM_WHATSAPP;
const toWhatsAppNumber = process.env.TWILIO_TO_WHATSAPP;
const contentSid = process.env.TWILIO_CONTENT_SID;

// Limites para alertas
const LIMITE_UMIDADE = parseInt(process.env.LIMITE_UMIDADE, 10);
const LIMITE_VIBRACAO = parseInt(process.env.LIMITE_VIBRACAO, 10);

// Função para enviar alerta via WhatsApp
function enviarAlerta(umidade, vibracao) {
    twilioClient.messages
      .create({
        body: `🚨 *Alerta de Deslizamento de Terra* 🚨 \n\n*Nível de umidade:* ${umidade} \n*Nível de vibração:* ${vibracao} \n\nRecomendação: Evacuar a área e buscar um local seguro.`,
        from: fromWhatsAppNumber,
        to: toWhatsAppNumber,
      })
      .then(message => console.log(`Mensagem enviada com sucesso: ${message.sid}`))
      .catch(error => console.error('Erro ao enviar mensagem WhatsApp:', error));
  }
  

// Conecta ao broker e escuta o tópico
client.on('connect', () => {
  console.log('Conectado ao broker MQTT');
  client.subscribe(TOPIC);
});

client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());
  const { umidade, vibracao } = data;

  console.log(`Dados recebidos - Umidade: ${umidade}, Vibração: ${vibracao}`);

  if (umidade > LIMITE_UMIDADE || vibracao > LIMITE_VIBRACAO) {
    console.log('Alerta de risco! Enviando mensagem WhatsApp...');
    enviarAlerta(umidade, vibracao);
  }
});
