var gateway = `ws://${window.location.hostname}/ws`;

//Variáveis Globais:
let myChart;

//PARTE DO WEBSOCKET
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
  const view = new Int16Array(event.data);
  console.log(view);
  let result = new Float64Array(view.length);
  for(let i=0; i<view.length; i++) result[i] = (view[i] *20) / 65536;
  result = Array.from(result);
  console.log(result);
  const dataset = result.map((dado,indice,result) => {
    let objetoDado = {};
    objetoDado.y = dado;
    objetoDado.x = indice;
    return objetoDado;
  });
  console.log(dataset);
  AtualizaGrafico(dataset);

  
  //console.log(view.getInt32(0));console.log(event.data);
  } else {
    // text frame
    //console.log(event.data);
  }
}
function onLoad(event) {
  initWebSocket();
  let y = new Float64Array(100);
  for (i = 0; i<100; i++){
    y[i] = Math.sin(2*Math.PI*0.01*i );
  }
  y = y.map((dado,index,y) => dado*20/2);
  console.log(y);
  GerarGrafico(y,0.001);
}


//PARTE DO GRÁFICO

function GerarGrafico (view, estampaTempo){
  
  view = Array.from(view);
  console.log(" View dentro = ");
  console.log(view);
  const dados = view.map((dado,indice,view) => {
    let objetoDado = {};
    objetoDado.y = dado;
    objetoDado.x = indice*estampaTempo;
    return objetoDado;
  });
  console.log("Dados = ")
  console.log(dados);

  const data = {
    //labels: labels,
    datasets: [{
      label: 'My First dataset',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: dados,
      parsing: {
        xAxisKey: 'x',
        yAxisKey: 'y'
      }
    }]
  };
  
  
  const config = {
    type: 'line',
    data: data,
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        }
      },
      elements: {
        point:{
          radius: 0
        }
      },
      animation: false
    }
  };

  

  myChart = new Chart(
    document.getElementById('chart'),
    config
  );

  console.log(myChart);

}

function botao(){
  console.log(myChart);

  let y = new Float64Array(100);
  const a = Math.random();
  for (i = 0; i<100; i++){
    y[i] = Math.sin(2*Math.PI*a*0.1*i + a*2*Math.PI);
  }
  y = Array.from(y);
  const dataset = y.map((dado,indice,y) => {
    let objetoDado = {};
    objetoDado.y = dado;
    objetoDado.x = indice;
    return objetoDado;
  });

  AtualizaGrafico(dataset);
};

function AtualizaGrafico(dataset){
  myChart.data.datasets[0].data = dataset;
  myChart.update(); 
};



