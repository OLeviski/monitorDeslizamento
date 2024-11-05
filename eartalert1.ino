// Definindo os pinos de conexão
const int piezoPin = A1;           // Entrada analógica do piezo
const int umidadePin = A0;          // Entrada analógica do sensor de umidade
const int umidadeVccPin = 7;        // Pino de alimentação do sensor de umidade

// Definindo limites para detecção
const int limiteVibracao = 500;     // Limite de vibração do piezo (ajuste conforme necessário)
const int limiteUmidade = 600;      // Limite de umidade do solo (ajuste conforme necessário)

void setup() {
  Serial.begin(9600);

  // Configuração do pino de alimentação do sensor de umidade
  pinMode(umidadeVccPin, OUTPUT);
  digitalWrite(umidadeVccPin, LOW);  // Desligado inicialmente

  // Configurando a leitura das entradas
  pinMode(piezoPin, INPUT);
  pinMode(umidadePin, INPUT);
}

void loop() {
  // Ativar o sensor de umidade e aguardar estabilização
  digitalWrite(umidadeVccPin, HIGH);
  delay(10);  // Pequeno atraso para estabilizar a leitura

  // Ler os valores dos sensores
  int leituraUmidade = analogRead(umidadePin);
  int leituraVibracao = analogRead(piezoPin);

  // Desligar o sensor de umidade para economizar energia
  digitalWrite(umidadeVccPin, LOW);

  // Verificar se os valores ultrapassam os limites
  if (leituraUmidade > limiteUmidade) {
    Serial.println("Alerta: Umidade elevada detectada!");
  }

  if (leituraVibracao > limiteVibracao) {
    Serial.println("Alerta: Vibração detectada!");
  }

  // Exibir leituras para monitoramento
  Serial.print("Umidade: ");
  Serial.print(leituraUmidade);
  Serial.print(" | Vibração: ");
  Serial.println(leituraVibracao);

  // Pequeno atraso para evitar leituras muito frequentes
  delay(1000);  // Aguardar 1 segundo para a próxima leitura
}
