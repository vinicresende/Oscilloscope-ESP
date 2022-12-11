var gateway = `ws://${window.location.hostname}/ws`;
//var gateway = `ws://192.168.0.92/ws`;

//Variáveis Globais:
let myChart;
//var dados;
let iniciarParar = "ON";

var result;
var operacao = "+";
var A = 1;

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
  //console.log(view);
  //let result = new Float64Array(view.length);
  result = new Float64Array(view.length);
  for(let i=0; i<view.length; i++) result[i] = (view[i] *20) / 65536;
  result = Array.from(result);
  //console.log(result);
  const dataset = result.map((dado,indice,result) => {
    let objetoDado = {};
    objetoDado.y = dado;
    objetoDado.x = indice;
    return objetoDado;
  });
  //console.log(dataset);
  AtualizaGrafico(dataset);

  websocket.send("CONT");
  //console.log(view.getInt32(0));console.log(event.data);
  } else {
    // text frame
    //console.log(event.data);
  }
}
function onLoad(event) {
  initWebSocket();
  result = new Float64Array(1000);
  for (i = 0; i<1000; i++){
    result[i] = Math.sin(2*Math.PI*0.01*i );
  }
  result = Array.from(result);
  result = result.map((dado,index,result) => dado*20/2);
  //console.log(y);
  GerarGrafico(result,0.001);
}


//PARTE DO GRÁFICO

function GerarGrafico (view, estampaTempo){
  
  view = Array.from(view);
  //console.log(" View dentro = ");
  //console.log(view);
  const dados = view.map((dado,indice,view) => {
    let objetoDado = {};
    objetoDado.y = dado;
    objetoDado.x = indice*estampaTempo;
    return objetoDado;
  });
  //console.log("Dados = ")
  //console.log(dados);

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
        y: {
          type: 'linear',
          max: 10,
          min: -10
        },
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

  //console.log(myChart);

}

function start(){
  console.log("Sending: " + iniciarParar)
  websocket.send(iniciarParar);

  //console.log(myChart);
  /*
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
  */
  iniciarParar = (iniciarParar == "OFF" ? "ON" : "OFF");
};

function AtualizaGrafico(dataset){
  myChart.data.datasets[0].data = dataset;
  //myChart.config.options.scales.y.max = 10;
  //myChart.config.options.scales.y.min = -10;
  myChart.update('none'); 
};

function MudarEixoY(value){
  //console.log('Eixo y: '+value);
  myChart.config.options.scales.y.max = Math.round(value);
  myChart.config.options.scales.y.min = Math.round(-value);
  myChart.update(); 
}
function MudarEixoX(value){
  //console.log('Eixo x: '+value);
  myChart.config.options.scales.x.max = Math.round(value);
  myChart.update(); 
}
function MudarTrgValue(value){
  console.log('Trg Value y: '+value);
  
}

function Renomear(){
  console.log(document.getElementById("nomeCanal").value);
  myChart.data.datasets[0].label = document.getElementById("nomeCanal").value;
    myChart.update('none');
}
////////////////////////////////////////////////////////////////////////
//FUNÇÕES DO CSS
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


var ch1 = document.getElementById("CH1");
var mth = document.getElementById("MTH");
var curs = document.getElementById("CURS");
var trg = document.getElementById("TRG");

function myDropCH1() {
	if (ch1.className.indexOf("w3-show") == -1) {
		ch1.className += " w3-show";
		mth.className = mth.className.replace(" w3-show", "");
		curs.className = curs.className.replace(" w3-show", "");
		trg.className = trg.className.replace(" w3-show", "");
	}
	else {
		ch1.className = ch1.className.replace(" w3-show", "");
	}
}
function myDropMTH() {
	if (mth.className.indexOf("w3-show") == -1) {
		mth.className += " w3-show";
		ch1.className = ch1.className.replace(" w3-show", "");
		curs.className = curs.className.replace(" w3-show", "");
		trg.className = trg.className.replace(" w3-show", "");
	}
	else {
		mth.className = mth.className.replace(" w3-show", "");
	}
}
function myDropCURS() {
	if (curs.className.indexOf("w3-show") == -1) {
		curs.className += " w3-show";
		ch1.className = ch1.className.replace(" w3-show", "");
		mth.className = mth.className.replace(" w3-show", "");
		trg.className = trg.className.replace(" w3-show", "");
	}
	else {
		curs.className = curs.className.replace(" w3-show", "");
	}
}
function myDropTRG() {
	if (trg.className.indexOf("w3-show") == -1) {
		trg.className += " w3-show";
		ch1.className = ch1.className.replace(" w3-show", "");
		mth.className = mth.className.replace(" w3-show", "");
		curs.className = curs.className.replace(" w3-show", "");
	}
	else {
		trg.className = trg.className.replace(" w3-show", "");
	}
}

function Exportar() {
  var image = myChart.toBase64Image();
  //console.log(image);
  var a = document.createElement('a');
  a.href = image;
  a.download = 'my_file_name.png';
  a.click();
  //var test_array = [["name1", 2, 3], ["name2", 4, 5], ["name3", 6, 7], ["name4", 8, 9], ["name5", 10, 11]];

  var test_array = [];
  for (i = 0; i<1000; i++){
    test_array[i] = [[i], [result[i]]];
  };

    //console.log(test_array)

  const csv = test_array.map(row => row.map(item => (typeof item === 'string' && item.indexOf(',') >= 0) ? `"${item}"`: String(item)).join(',')).join('\n');


  // Format the CSV string
  const data = encodeURI('data:text/csv;charset=utf-8,' + csv);

  // Create a virtual Anchor tag
  const link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', 'export.csv');

  // Append the Anchor tag in the actual web page or application
  document.body.appendChild(link);

  // Trigger the click event of the Anchor link
  link.click();

  // Remove the Anchor link form the web page or application
  document.body.removeChild(link);
  
}

function MthOperacao(value){
  operacao = value;
  //console.log(operacao);
  Mth();
}
function Mth (){
  let resultMth
  //console.log(operacao);
  switch (operacao){
    case 'a':
      resultMth = result.map(function(item, index) {
          return item + A*result[index];
        })
      break;
    case 'b':
      resultMth = result.map(function(item, index) {
        return item - A*result[index];
      })
      break; 
    case 'c':
      resultMth = result.map(function(item, index) {
        return item * A*result[index];
      })
      break;
    case 'd':
      resultMth = result.map(function(item, index) {
        return item / A*result[index];
      })
      break;
  }
  //console.log(resultMth);
  const dataset1 = resultMth.map((dado,indice) => {
    let objetoDado = {};
    objetoDado.y = dado;
    objetoDado.x = indice;
    return objetoDado;
  });
  //console.log(result);
  //console.log(resultMth);
  //console.log(dataset1);
  AtualizaGrafico(dataset1);


}

function MthA(value){
  
  A = value;
  //console.log(A);
}
	
var numX = document.getElementById("numX");
var numY = document.getElementById("numY");
var numTela = document.getElementById("numTela");
var layoutBar = document.getElementById("layoutBar");
var numTrg = document.getElementById("numTrg");
	
numX.innerHTML = barX.value;
numY.innerHTML = barY.value;
numTela.innerHTML = barTela.value;
numTrg.innerHTML = barTrg.value;
	
barX.oninput = function(){
	numX.innerHTML = this.value;
}
barY.oninput = function(){
	numY.innerHTML = this.value;
}
barTela.oninput = function(){
	numTela.innerHTML = this.value;
}
barTrg.oninput = function(){
	numTrg.innerHTML = this.value;
}
layoutBar.style.widht = this.value;