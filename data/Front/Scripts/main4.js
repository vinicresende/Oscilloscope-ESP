			// function start() {
				// var x = document.getElementById("chartContainer");
				// if (x.className.indexOf("w3-show") == -1) {
					// x.className += " w3-show";
				// }
				// else {
					// x.className = x.className.replace(" w3-show", "");
				// }
			// }

window.onload = function () {

var dps = [];
var chart = new CanvasJS.Chart("chartContainer", {
	exportEnabled: true,
	options: {
        responsive: true
      },
	title: {
		display: true,
		text: 'Gráfico'
    },
	data: [{
		type: "spline",
		markerSize: 0,
		dataPoints: dps 
	}]
});

var xVal = 0;
var yVal = 100;
var updateInterval = 1000;
var dataLength = 50; // number of dataPoints visible at any point

var updateChart = function (count) {
	count = count || 1;
	// count is number of times loop runs to generate random dataPoints.
	for (var j = 0; j < count; j++) {	
		yVal = yVal + Math.round(5 + Math.random() *(-5-5));
		dps.push({
			x: xVal,
			y: yVal
		});
		xVal++;
	}
	if (dps.length > dataLength) {
		dps.shift();
	}
	chart.render();
};

updateChart(dataLength); 
setInterval(function(){ updateChart() }, updateInterval); 

}

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
			var x3 = document.getElementById("CH2");
			var x4 = document.getElementById("CURS");
			var x5 = document.getElementById("TRG");
			
			function myDropCH1() {
				if (x1.className.indexOf("w3-show") == -1) {
					x1.className += " w3-show";
					x2.className = x2.className.replace(" w3-show", "");
					x3.className = x3.className.replace(" w3-show", "");
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
					x3.className = x3.className.replace(" w3-show", "");
					x4.className = x4.className.replace(" w3-show", "");
					x5.className = x5.className.replace(" w3-show", "");
				}
				else {
					x2.className = x2.className.replace(" w3-show", "");
				}
			}
			function myDropCH2() {
				if (x3.className.indexOf("w3-show") == -1) {
					x3.className += " w3-show";
					x1.className = x1.className.replace(" w3-show", "");
					x2.className = x2.className.replace(" w3-show", "");
					x4.className = x4.className.replace(" w3-show", "");
					x5.className = x5.className.replace(" w3-show", "");
				}
				else {
					x3.className = x3.className.replace(" w3-show", "");
				}
			}
			function myDropCURS() {
				if (x4.className.indexOf("w3-show") == -1) {
					x4.className += " w3-show";
					x1.className = x1.className.replace(" w3-show", "");
					x2.className = x2.className.replace(" w3-show", "");
					x3.className = x3.className.replace(" w3-show", "");
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
					x3.className = x3.className.replace(" w3-show", "");
					x4.className = x4.className.replace(" w3-show", "");
				}
				else {
					x5.className = x5.className.replace(" w3-show", "");
				}
			}
			
			var numX = document.getElementById("numX");
			var numY = document.getElementById("numY");
			var numX2 = document.getElementById("numX2");
			var numY2 = document.getElementById("numY2");
			var numTela = document.getElementById("numTela");
			var layoutBar = document.getElementById("layoutBar");
			
			numX.innerHTML = barX.value;
			numY.innerHTML = barY.value;
			numX2.innerHTML = barX2.value;
			numY2.innerHTML = barY2.value;
			numTela.innerHTML = barTela.value;
			
			barX.oninput = function(){
				numX.innerHTML = this.value;
			}
			barY.oninput = function(){
				numY.innerHTML = this.value;
			}
			barX2.oninput = function(){
				numX2.innerHTML = this.value;
			}
			barY2.oninput = function(){
				numY2.innerHTML = this.value;
			}
			barTela.oninput = function(){
				numTela.innerHTML = this.value;
			}
			layoutBar.style.widht = this.value;
			
			// function desfoque() {
				// document.getElementById("CH1").className = document.getElementById("CH1").className.replace(" w3-show", "");
				// document.getElementById("MTH").className = document.getElementById("CH1").className.replace(" w3-show", "");
				// document.getElementById("CH2").className = document.getElementById("CH1").className.replace(" w3-show", "");
				// document.getElementById("CURS").className = document.getElementById("CH1").className.replace(" w3-show", "");
				// document.getElementById("TRG").className = document.getElementById("CH1").className.replace(" w3-show", "");
			// }
			
			//document.getElementById("numX").innerHTML = width * 1  + '%';
			//document.getElementById("numY").innerHTML = width * 1  + '%';
			
			// Necessário validar os nomes?????
			// function validateForm() {
			  // var x = document.forms["myForm"]["fname"].value;
			  // if (x == "") {
				// alert("Name must be filled out");
				// return false;
			  // }
			// }