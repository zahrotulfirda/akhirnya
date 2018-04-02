/*
	layout.js
	Define layout for simulation.
	Sparisoma Viridi | dudung@gmail.com
	
	20170215
	Start this library.
*/

function layout() {
	// Create left division
	var ldiv = document.createElement("div");
	document.body.appendChild(ldiv);
	ldiv.style.border = "0px black solid";
	ldiv.style.height = "402px";
	ldiv.style.float = "left";
	ldiv.style.width = "252px";
	
	// Create right division
	var rdiv = document.createElement("div");
	document.body.appendChild(rdiv);
	rdiv.style.border = "0px black solid";
	rdiv.style.height = "402px";
	rdiv.style.float = "left";
	
	// Create text area for input
	var ta = document.createElement("textarea");
	ldiv.appendChild(ta);
	ta.style.color = "black";
	ta.style.background = "white";
	ta.rows = "20";
	ta.cols = "32";
	ta.style.overflowY = "scroll";
	ta.style.display = "block";	
	ta.id = "hout";
	
	// Create canvas for drawing
	var c = document.createElement("canvas");
	rdiv.appendChild(c);
	c.id = "canvas";
	c.style.border = "1px solid #999";
	c.style.background = "white";
	c.width = "500";
	c.height = "500";
	//c.style.float = "left";
	var ctx = c.getContext("2d");
	
	// Prepare canvas
	setCanvasCoordinates("canvas");
	setWorldCoordinates(-20, -20, 20, 20);
	
	// Create start button
	var b1 = document.createElement("button");
	ldiv.appendChild(b1);
	b1.innerHTML = "Start";
	b1.onclick = function() {
		if(b1.innerHTML == "Start") {
			b1.innerHTML = "Stop";
			timer1 = setInterval(run, 1);
		} else {
			b1.innerHTML = "Start";
			clearInterval(timer1);
		}
	}
	
	// Create save Button
	var b2 = document.createElement("button");
	ldiv.appendChild(b2);
	b2.innerHTML = "Save";
	b2.onclick = function() {
		var canvas = document.getElementById("canvas");
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	}
}
