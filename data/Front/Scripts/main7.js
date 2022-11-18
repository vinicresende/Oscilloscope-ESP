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
	options: {
        responsive: true
      },
    datasets: [{
      label: 'My Dataset',
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

function start(){
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
////////////////////////////////////////////////////////////////////////

function w3_open() {
	document.getElementById("main").style.marginLeft = "25%";
	document.getElementById("mySidebar").style.width = "25%";
	document.getElementById("mySidebar").style.display = "block";
	document.getElementById("openNav").style.display = 'none';
}
function w3_close() {
	document.getElementById("main").style.marginLeft = "0%";
	document.getElementById("mySidebar").style.display = "none";
	document.getElementById("openNav").style.display = "inline-block";
}


var x1 = document.getElementById("CH1");
var x2 = document.getElementById("MTH");
var x4 = document.getElementById("CURS");
var x5 = document.getElementById("TRG");

function myDropCH1() {
	if (x1.className.indexOf("w3-show") == -1) {
		x1.className += " w3-show";
		x2.className = x2.className.replace(" w3-show", "");
		x4.className = x4.className.replace(" w3-show", "");
		x5.className = x5.className.replace(" w3-show", "");
	}
	else {
		x1.className = x1.className.replace(" w3-show", "");
	}
}
function myDropMTH() {
	if (x2.className.indexOf("w3-show") == -1) {
		x2.className += " w3-show";
		x1.className = x1.className.replace(" w3-show", "");
		x4.className = x4.className.replace(" w3-show", "");
		x5.className = x5.className.replace(" w3-show", "");
	}
	else {
		x2.className = x2.className.replace(" w3-show", "");
	}
}
function myDropCURS() {
	if (x4.className.indexOf("w3-show") == -1) {
		x4.className += " w3-show";
		x1.className = x1.className.replace(" w3-show", "");
		x2.className = x2.className.replace(" w3-show", "");
		x5.className = x5.className.replace(" w3-show", "");
	}
	else {
		x4.className = x4.className.replace(" w3-show", "");
	}
}
function myDropTRG() {
	if (x5.className.indexOf("w3-show") == -1) {
		x5.className += " w3-show";
		x1.className = x1.className.replace(" w3-show", "");
		x2.className = x2.className.replace(" w3-show", "");
		x4.className = x4.className.replace(" w3-show", "");
	}
	else {
		x5.className = x5.className.replace(" w3-show", "");
	}
}
	
var numX = document.getElementById("numX");
var numY = document.getElementById("numY");
var numTela = document.getElementById("numTela");
var layoutBar = document.getElementById("layoutBar");
	
numX.innerHTML = barX.value;
numY.innerHTML = barY.value;
numTela.innerHTML = barTela.value;
	
barX.oninput = function(){
	numX.innerHTML = this.value;
}
barY.oninput = function(){
	numY.innerHTML = this.value;
}
barTela.oninput = function(){
	numTela.innerHTML = this.value;
}
layoutBar.style.widht = this.value;