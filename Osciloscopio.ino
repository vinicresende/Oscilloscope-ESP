//Bibliotecas Necessárias
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <FilaCircular.h>
#include <LITTLEFS.h>

//Configuração Wifi:
const char* ssid = "Baby";
const char* password = "havanagila";

// Criaum Objeto AsyncWebServer na porta 80
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");



/*const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE HTML><html>
<head>
  <title>ESP Web Server</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
<title>ESP Web Server</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:,">
</head>
<body>
  <div class="topnav">
    <h1>ESP WebSocket Server</h1>
  </div>
<script>
  var gateway = `ws://${window.location.hostname}/ws`;
  var websocket;
  window.addEventListener('load', onLoad);
  function initWebSocket() {
    console.log('Trying to open a WebSocket connection...');
    websocket = new WebSocket(gateway);
    websocket.binaryType = "arraybuffer";
    websocket.onopen    = onOpen;
    websocket.onclose   = onClose;
    websocket.onmessage = onMessage; // <-- add this line
  }
  function onOpen(event) {
    console.log('Connection opened');
  }
  function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
  }
  function onMessage(event) {
    
     if (event.data instanceof ArrayBuffer) {
    // binary frame
    const view = new DataView(event.data);
    console.log(view.getInt32(0));console.log(event.data);
    } else {
      // text frame
      console.log(event.data);
    }
  }
  function onLoad(event) {
    initWebSocket();
  }
</script>
</body>
</html>
)rawliteral";
*/



//Botões de Controle do LTC1605CN
#define RC 18
#define CS 19
#define BUSY 21

//Botão de Teste
#define Botao 22

//Entradas digitais dos bits 0~16 provenientes do LTC1505CN
#define D0 36
#define D1 39
#define D2 34
#define D3 35
#define D4 32
#define D5 33
#define D6 25
#define D7 26
#define D8 27
#define D9 14
#define D10 12
#define D11 2
#define D12 4
#define D13 16
#define D14 17
#define D15 5

// Variáveis de Aquisição
byte d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15;

//Variáveis Globais//
unsigned long tempoAtual = 0; //Para contagem do intervalo de aquisião
short contLoop = 0; //contador de loops de aquisição
bool busy = true; //Controle que o LTC1605 está ocupado
short dado; //Junção dos bits de 0~16
unsigned long t1=0,t2=0,dt=0,t1ws=0,t2ws=0,dtws=0; //Contador temporário de tempo de aquisição

const short loops = 1000; //Quantidade de aquisições

//Vetor de Dados deve ter parte baixa primeiro (Little Endian)
uint8_t vetorDado[2*loops]; //Vetor de uint8_t para usar enviar por websocket

bool enviarWs = false;//Sinal de controle de quando enviar o WebSocket

void IRAM_ATTR BusyFunction() {
    dado = 0;
    t1=micros();
    
    digitalWrite(CS,0); //ChipSelect em 0 para ler
    micros(); //intervalo para obedecer o t12 (Bus Access Time) após CS LOW (83nS MAX)
    d0 = digitalRead(D0);
    d1 = digitalRead(D1);
    d2 = digitalRead(D2);
    d3 = digitalRead(D3);
    d4 = digitalRead(D4);
    d5 = digitalRead(D5);
    d6 = digitalRead(D6);
    d7 = digitalRead(D7);
    d8 = digitalRead(D8);
    d9 = digitalRead(D9);
    d10 = digitalRead(D10);
    d11 = digitalRead(D11);
    d12 = digitalRead(D12);
    d13 = digitalRead(D13);
    d14 = digitalRead(D14);
    d15 = digitalRead(D15);
    digitalWrite(CS,1); //ChipSelect em 1 para encerrar
    //Rotação de bits para gerar o dado lido
    dado = d0<<15 | d1<<14 | d2<<13 | d3<<12 | d4<<11 | d5<<10 | d6<<9 | d7<<8 |
           d8<<7  | d9<<6  | d10<<5 | d11<<4 | d12<<3 | d13<<2 | d14<<1 | d15<<0 ;
    
    vetorDado[2*contLoop] =  dado & 0xff;
    vetorDado[2*contLoop+1] = (dado >> 8)& 0xff;
    t2=micros();
    dt += t2 - t1;
    contLoop ++;
    //Serial.printf(" %d",contLoop);
    if (contLoop<loops){
      busy = false;
    } else {
      contLoop=0;
      dt = dt/loops;
      enviarWs = true; //Pode Enviar o WebSocket com os dados
    }    

}

// Initialize LittleFS
void initFS() {
  if (!LITTLEFS.begin()) {
    Serial.println("An error has occurred while mounting LittleFS");
  }
  else{
   Serial.println("LittleFS mounted successfully");
  }
}

// Initialize WiFi
void initWiFi() {
  // Connect to Wi-Fi
  WiFi.disconnect();
  delay(1000);
  WiFi.begin(ssid, password);
  Serial.print("\nConnecting to WiFi..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }

  // Print ESP Local IP Address
  Serial.println(WiFi.localIP());
}


void notifyClients() {
  ws.textAll("oi");
}

void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len) {
  switch (type) {
    case WS_EVT_CONNECT:
      Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
      break;
    case WS_EVT_DISCONNECT:
      Serial.printf("WebSocket client #%u disconnected\n", client->id());
      break;
    case WS_EVT_DATA:
      //handleWebSocketMessage(arg, data, len);
      break;
    case WS_EVT_PONG:
    case WS_EVT_ERROR:
      break;
  }
}

void initWebSocket() {
  ws.onEvent(onEvent);
  server.addHandler(&ws);
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  pinMode(RC,OUTPUT);
  pinMode(CS,OUTPUT);
  attachInterrupt(BUSY, BusyFunction, RISING);
  
  pinMode(D0,INPUT);
  pinMode(D1,INPUT);
  pinMode(D2,INPUT);
  pinMode(D3,INPUT);
  pinMode(D4,INPUT);
  pinMode(D5,INPUT);
  pinMode(D6,INPUT);
  pinMode(D7,INPUT);
  pinMode(D8,INPUT);
  pinMode(D9,INPUT);
  pinMode(D10,INPUT);
  pinMode(D11,INPUT);
  pinMode(D12,INPUT);
  pinMode(D13,INPUT);
  pinMode(D14,INPUT);
  pinMode(D15,INPUT);

  pinMode(Botao,INPUT);

  initFS();
  initWiFi();

  

  initWebSocket();

  // Route for root index.html
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(LITTLEFS, "/index.html", "text/html"); });

  // Route for root index.css
  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(LITTLEFS, "/style.css", "text/css"); });

  // Route for root chart.min.js
  server.on("/chart.min.js", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(LITTLEFS, "/chart.min.js", "text/javascript"); });

  // Route for root index.js
  server.on("/script.js", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(LITTLEFS, "/script.js", "text/javascript"); });

  server.serveStatic("/", LITTLEFS, "/");
  
  // Start server
  server.begin();


  tempoAtual = millis(); //Inicia o contador de tempoAtual
  
  digitalWrite(RC,1);
  digitalWrite(CS,1);
}

void loop() {

  int inicia = digitalRead(Botao) | !busy;
  //PARA LEITURAS USANDO O BOTÃO e apenas uma aquisição a cada 1ms
  if (inicia && millis()-tempoAtual>1){
      digitalWrite(RC,0);
      digitalWrite(CS,0);
      micros(); //t1 (Convert pulse width) tempo de RC e CS em LOW mínimo de 40nS
      micros();
      micros();
      micros();
      digitalWrite(CS,1);
      digitalWrite(RC,1);
      busy = true;
      tempoAtual = millis();

  }

  if (enviarWs){
    t1ws=micros();
    ws.binaryAll(vetorDado,2000);
    t2ws=micros();
    dtws=t2ws-t1ws;
    Serial.print("   dt_WS = ");
    Serial.print(dtws);
    Serial.println("us");
    enviarWs=false;
    
  }

}
