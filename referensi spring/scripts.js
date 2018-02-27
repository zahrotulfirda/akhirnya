/*
	scripts.js
	JavaScript examples
	
	Sparisoma Viridi | dudung@gmail.com
	
	20180116
	Create some examples.
	20180120
	Add an example
	20180121
	Add some examples and doi:10.5281/zenodo.1156150 for all
	versions.
	20180129
	Add examples how to use vect3.js library.
	20180130
	Example of circular motion due to gravitational force.
	20180131
	Create Object and introduction to JSON and also
	sharing data using localStorage.
*/

// Execute a test function
test_define_rectangle();

// 20180213.0751-1512 ok
function test_define_rectangle() {
	// Define a box coordinates
	/*
	    z
	    |
			
	    H           G
	     .---------.
      /         /|
	 E /       F / |
	  .---------.  |
	  |  .      |  .
	  | D       | / C
	  |         |/
	  .---------.    -- x
	 A           B
	*/
	var s = 1;
	var rA = new Vect3(0, 0, 0);
	var rB = new Vect3(s, 0, 0);
	var rC = new Vect3(s, s, 0);
	var rD = new Vect3(0, s, 0);
	var rE = new Vect3(0, 0, s);
	var rF = new Vect3(s, 0, s);
	var rG = new Vect3(s, s, s);
	var rH = new Vect3(0, s, s);
	
	// Define box sides
	var surf = new Grid4();
	var sides = [];
	surf = new Grid4(rE, rF, rB, rA);
	sides.push(surf);
	surf = new Grid4(rF, rG, rC, rB);
	sides.push(surf);
	surf = new Grid4(rG, rH, rD, rC);
	sides.push(surf);
	surf = new Grid4(rH, rE, rA, rD);
	sides.push(surf);
	surf = new Grid4(rE, rH, rG, rF);
	sides.push(surf);
	
	// Defina spherical particles
	var p = new Sphere();
	var pars = [];
	p = new Sphere();
	p.m = 4;
	p.d = 0.2;
	p.r = new Vect3(0.25, 0.25, 0.25);
	p.v = new Vect3(0.1, 0.05, 0);
	pars.push(p);
	p = new Sphere();
	p.m = 6;
	p.d = 0.3;
	p.r = new Vect3(0.25, 0.5, 0.25);
	p.v = new Vect3(0.0, 0.05, 0);
	pars.push(p);
	p = new Sphere();
	p.m = 2;
	p.d = 0.1;
	p.r = new Vect3(0.8, 0.8, 0.25);
	p.v = new Vect3(-0.02, 0.05, 0);
	pars.push(p);
	
	// Define world coordinate
	var xmin = -0.1;
	var ymin = -0.1;
	var xmax = 1.1;
	var ymax = 1.1;
	
	// Define canvas size
	var canvasWidth = 200;
	var canvasHeight = 200;
	
	// Define canvas coordinate
	var XMIN = 0;
	var YMIN = canvasHeight;
	var XMAX = canvasWidth;
	var YMAX = 0;
	
	// Create a canvas
	var c = document.createElement("canvas");
	c.id = "drawingboard";
	c.width = canvasWidth;
	c.height = canvasHeight;
	c.style.border = "1px solid #ccc";
	document.body.appendChild(c);
	
	// Create some divs
	var d;
	d	= document.createElement("div");
	d.id = "ekin";
	document.body.appendChild(d);
	d	= document.createElement("div");
	d.id = "hidtext";
	document.body.appendChild(d);
	
	// Draw a circle
	function drawSphere(id, s, color) {
		var cx = document.getElementById(id).getContext("2d");
		cx.strokeStyle = color;
		cx.beginPath();
		var rr = transform({x: s.r.x, y: s.r.y});
		var rr2 = transform({x: s.r.x + s.d, y: s.r.y});
		var DD = rr2.x - rr.x;
		cx.arc(rr.x, rr.y, 0.5 * DD, 0, 2 * Math.PI);
		cx.stroke();
	}
	
	// Draw sides of rectangle
	function drawRectangles(id, surfs, color) {
		var cx = document.getElementById(id).getContext("2d");
		cx.strokeStyle = color;
		var N = surfs.length;
		for(var i = 0; i < N; i++) {
			var M = surfs[i].p.length;
			cx.beginPath();
			for(var j = 0; j < M; j++) {
				var s = surfs[i];
				var rr = transform({x: s.p[j].x, y: s.p[j].y});
				if(j == 0) {
					cx.moveTo(rr.x, rr.y);
				} else {
					cx.lineTo(rr.x, rr.y);
				}
			}
			cx.stroke();
		}
	}
	
	// Clear canvas with color
	function clearCanvas() {
		var id = arguments[0];
		var el = document.getElementById(id);
		var color = arguments[1];
		var cx = el.getContext("2d");
		cx.fillStyle = color;
		cx.fillRect(0, 0, c.width, c.height);
	}
	
	// Transform (x, y) to (X, Y)
	function transform(r) {
		var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
		X += XMIN;
		var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
		Y += YMIN;
		return {x: X, y: Y};
	}
	
	// Collide particle and a rectangle surface
	function collide(p, surf) {
		// Declare force variable
		var F = new Vect3();
		
		// Define constants
		var kN = 100;
		var gN = 0.1; //0.1
		
		if(arguments[1] instanceof Grid4) {
			// Get colliding objects
			var p = arguments[0];
			var surf = arguments[1];
			
			// Calculate normal vector
			var r10 = Vect3.sub(surf.p[1], surf.p[0]);
			var r21 = Vect3.sub(surf.p[2], surf.p[1]);
			var n = Vect3.cross(r10, r21);
			
			// Calculate distance from surface
			var r = p.r;
			var dr = Vect3.sub(r, surf.p[0]);
			var h = Math.abs(Vect3.dot(dr, n));
			
			// Calculate overlap
			var xi = Math.max(0, 0.5 * p.d - h);
			var xidot = Vect3.dot(p.v, n);
			
			// Calculate force
			var f = (xi > 0) ? kN * xi - gN * xidot : 0;
			F = Vect3.mul(f, n);
		} else {
			// Get colliding objects
			var p0 = arguments[0];
			var p1 = arguments[1];
			
			// Calculate overlap
			var r10 = Vect3.sub(p1.r, p0.r);
			var l10 = r10.len();
			var n = r10.unit();
			var v10 = Vect3.sub(p1.v, p0.v);
			var xi = Math.max(0, 0.5 * (p1.d + p0.d) - l10);
			var xidot = Vect3.dot(v10, n);
			
			// Calculate force
			var f = (xi > 0) ? kN * xi - gN * xidot : 0;
			var m0 = p0.m;
			var m1 = p1.m;
			var mu = (m1 * m0) / (m0 + m1);
			f /= mu;
			F = Vect3.mul(f, n);
		}
		
		// Return force value
		return F;
	}
	
	var TBEG = new Date().getTime()
	console.log("BEG: " + TBEG);
	var tbeg = 0;
	var tend = 1000;
	var dt = 5E-2;
	var t = tbeg;
	var NT = 100;
	var iT = 0;
	var NT2 = 10;
	var iT2 = 0;
	var iter = setInterval(simulate, 1);
	
	function calculate() {
		var M = pars.length;
		
		for(var j = 0; j < M; j++) {
			var p = pars[j];
			
			// Calculate force with wall
			var SF = new Vect3();
			var N = sides.length;
			for(var i = 0; i < N; i++) {
				var F = collide(p, sides[i]);
				SF = Vect3.add(SF, F);
			}
			
			// Calculate force with other particles
			for(var i = 0; i < M; i++) {
				if(i != j) {
					var F = collide(pars[i], pars[j]);
					SF = Vect3.add(SF, F);
				}
			}
			
			// Calculate acceleration
			p.a = Vect3.div(SF, p.m);
			
			// Perform Euler numerical integration
			p.v = Vect3.add(p.v, Vect3.mul(p.a, dt));
			p.r = Vect3.add(p.r, Vect3.mul(p.v, dt));
		}
		
		// Increase time
		t += dt;
		
		// Stop simulation
		if(t > tend) {
			clearInterval(iter);
			var TEND = new Date().getTime();
			console.log("END: " + TEND);
			var TDUR = TEND - TBEG;
			console.log("DUR: " + TDUR);
		}
	}
	
	function simulate() {
		calculate();
		
		iT++;
		iT2++;
		
		if(iT2 >= NT2) {
			// Clear and draw
			clearCanvas("drawingboard", "#fff");
			drawRectangles("drawingboard", sides, "#f00");
			var M = pars.length;
			for(var j = 0; j < M; j++) {
				drawSphere("drawingboard", pars[j], "#00f");
			}
			iT2 = 0;
		}
		if(iT >= NT) {
			// Calculate total kenetic energy
			var K = 0;
			var M = pars.length;
			for(var j = 0; j < M; j++) {
				var v = pars[j].v.len();
				var m = pars[j].m;
				K += (0.5 * m * v * v);
				console.log(K,t);
			var sK = K.toExponential(2)
			}
			var aa = sK.split("e")[0];
			var bb = sK.split("e")[1];
			var textEkin = "$K$ = " + aa
				+ "$\\times 10^{" + bb + "}$ J";
		
			var ekin = document.getElementById("ekin");
			UpdateMath("ekin", textEkin);
			iT = 0;
		}
	}
}

// 20180201.1916 ok
function test_storage_master_slave() {
	var dv = document.createElement("div");
	dv.style.width = "200px";
	document.body.appendChild(dv);
	
	var ta = document.createElement("textarea");
	ta.style.overflowY = "scroll";
	ta.style.height = "200px";
	ta.addEventListener("keypress", enterKey);
	dv.appendChild(ta);
	
	var b1 = document.createElement("button");
	b1.style.width = "54px";
	b1.innerHTML = "Reg";
	b1.id = "regButton"
	b1.addEventListener("click", registerWindow);
	dv.appendChild(b1);
	
	/*
	var b2 = document.createElement("button");
	b2.style.width = "54px";
	b2.innerHTML = "Send";
	b2.addEventListener("click", sendLastLine);
	dv.appendChild(b2);
	*/
	
	clearStorage();
	var id;
	var checkContent;
	
	function clearStorage() {
		document.title = "";
		localStorage.clear();
	}
	
	function registerWindow() {
		var btnId = event.target.id;
		var btn = document.getElementById(btnId);
		
		if(id == undefined) {
			var master = localStorage.getItem("master");
			if(master == null) {
				localStorage.setItem("master", "master");
				id = "master";
			} else {
				localStorage.setItem("slave", "slave");
				id = "slave";
			}
			btn.innerHTML = "Unreg";
			document.title = id;
			checkContent = setInterval(getLastLine, 100);
		} else {
			btn.innerHTML = "Reg";
			document.title = "";
			clearInterval(checkContent);
			localStorage.removeItem(id);
			id = undefined;
		}
	}
	
	function enterKey() {
		if(event.keyCode == 13) {
			sendLastLine();
		}
	}
	
	function sendLastLine() {
		var lines = ta.value.split("\n");
		var N = lines.length;
		var lline = lines[N - 1];
		localStorage.setItem("lastline", lline);
		localStorage.setItem("senderId", id);
	}
	
	function getLastLine() {
		var senderId = localStorage.getItem("senderId");
		if(senderId != id) {
			var lline = localStorage.getItem("lastline");
			if(lline != null) {
				ta.value = ta.value + "\n> " + lline + "\n";
				localStorage.removeItem("lastline");
			}
			localStorage.removeItem("senderId");
		}
	}
	
}

// 20180201.1241 ok
function test_storage_two_windows() {
	var ta = document.createElement("textarea");
	ta.style.overflowY = "scroll";
	ta.style.height = "100px";
	document.body.appendChild(ta);
	
	var b1 = document.createElement("button");
	b1.style.width = "50px";
	b1.innerHTML = "Write";
	document.body.appendChild(b1);
	
	var b2 = document.createElement("button");
	b2.style.width = "50px";
	b2.innerHTML = "Read";
	document.body.appendChild(b2);
	
	b1.addEventListener("click", storageWrite);
	b2.addEventListener("click", storageRead);
	
	function storageWrite() {
		localStorage.setItem("xmin", 0.2);
	}
	
	function storageRead() {
		var xmin = localStorage.getItem("xmin");
		localStorage.removeItem("xmin");
		console.log(xmin);
	}
}

// 20180131.1452 ok
function test_storage() {
	var r1 = new Vect2();
	r1.x = 3.5;
	r1.y = -8.1;
	var s1 = JSON.stringify(r1);
	sessionStorage.setItem("r1", s1);
	
	var r2 = new Vect2();
	console.log(r2);
	var s2 = sessionStorage.getItem("r1");
	r2 = JSON.parse(s2);
	console.log(r2);
	
	console.log(r1 == r2);
	console.log(r1.toString() == r2.toString());
	console.log(JSON.stringify(r1) == JSON.stringify(r2));
	
	var r3 = {x: 3.5, z: -8.1};
	console.log(r1 == r3);
	console.log(r1.toString() == r3.toString());
	console.log(JSON.stringify(r1) == JSON.stringify(r3));
	
	// Create a two dimensional vector
	function Vect2() {
		this.x = 0;
		this.y = 0;
	}
}

// 20180131.1434 ok
function test_comparing_object() {
	// Declare two two-dimensional vectors
	var r1 = new Vect2();
	var r2 = new Vect2();
	
	// Test object
	console.log(r1);
	console.log(r2);
	console.log("r1 == r2 --> " + (r1 == r2));
	console.log("r1 === r2 --> " + (r1 === r2));
	console.log("r1.toString() == r1.toString() --> "
		+ (r1.toString() == r2.toString())
	);
	console.log(
		"JSON.stringify(r1) == JSON.stringify(r2)"
		+ " --> "
		+ (JSON.stringify(r1) == JSON.stringify(r2))
	);
	
	// Test object after modification
	r1.x = 2;
	console.log(r1);
	console.log(r2);
	console.log("r1 == r2 --> " + (r1 == r2));
	console.log("r1 === r2 --> " + (r1 === r2));
	console.log("r1.toString() == r1.toString() --> "
		+ (r1.toString() == r2.toString())
	);
	console.log(
		"JSON.stringify(r1) == JSON.stringify(r2)"
		+ " --> "
		+ (JSON.stringify(r1) == JSON.stringify(r2))
	);
	
	// Create a two dimensional vector
	function Vect2() {
		this.x = 0;
		this.y = 0;
	}
}

// 20180131.1422 ok
function test_instance_object() {
	// Declare two two-dimensional vectors
	var r1 = new Vect2();
	console.log(r1);
	var r2 = new Vect2();
	console.log(r2);
	
	// Test object
	console.log(r1 instanceof Vect2);
	console.log(r2 instanceof Vect2);
	console.log(r1 instanceof Object);
	console.log(r2 instanceof Object);
	console.log(r1 instanceof String);
	console.log(r2 instanceof Number);
	console.log(typeof(r2));
	console.log(typeof(r2.x));
	
	// Create a two dimensional vector
	function Vect2() {
		this.x = 0;
		this.y = 0;
	}
}

// 20180131.1355 ok
function test_new_object() {
	// Declare a two-dimensional vector
	var r = new Vect2();
	console.log(r);
	
	// Create a two dimensional vector
	function Vect2() {
		this.x = 0;
		this.y = 0;
	}
}

// 20180130.0555 ok
function test_gravitation_two_body() {
	// Define world coordinate
	var xmin = -2.0;
	var ymin = -2.0;
	var xmax = 2.0;
	var ymax = 2.0;
	
	// Define canvas size
	var canvasWidth = 200;
	var canvasHeight = 200;
	
	// Define canvas coordinate
	var XMIN = 0;
	var YMIN = canvasHeight;
	var XMAX = canvasWidth;
	var YMAX = 0;
	
	// Create a canvas
	var c = document.createElement("canvas");
	c.id = "drawingboard";
	c.width = canvasWidth;
	c.height = canvasHeight;
	c.style.border = "1px solid #ccc";
	document.body.appendChild(c);
	
	// Draw a circle
	function drawCircle(id, r, color) {
		var cx = document.getElementById(id).getContext("2d");
		cx.strokeStyle = color;
		cx.beginPath();
		cx.arc(r.x, r.y, 1, 0, 2 * Math.PI);
		cx.stroke();
	}
	
	// Transform (x, y) to (X, Y)
	function transform(r) {
		var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
		X += XMIN;
		var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
		Y += YMIN;
		return {x: X, y: Y};
	}
	
	// Define gravitational constant
	var G = 1E-3; //
	
	// Define particle 1
	var o1 = new Particle();
	o1.m = 1000;
	o1.q = 0;
	console.log(o1);
	
	// Define particle 2
	var o2 = new Particle();
	o2.m = 1;
	o2.q = 0;
	o2.r = new Vect3(1, 0, 0);
	o2.v = new Vect3(0, 1, 0);
	console.log(o2);
	
	// Define iteration parameters
	var tbeg = 0;
	var tend = 10 * Math.PI;
	var dt = 1E-3;
	var Tshow = 0.1;
	var tshow = 0;
	
	// Display results header
	console.log("# t\tx1\ty1\tx2\ty2");
	
	// Perform iteration
	var t = tbeg;
	while(t <= tend) {
		// Get particle 1 values
		var r1 = o1.r;
		var v1 = o1.v;
		var m1 = o1.m;
		
		// Get particle 2 values
		var r2 = o2.r;
		var v2 = o2.v;
		var m2 = o2.m;
		
		// Calculate force on particle 1
		var r12 = Vect3.sub(r1, r2);
		var d12 = r12.len();
		var u12 = r12.unit();
		var F12 = Vect3.mul(
			-G * m1 * m2 / d12 * d12, u12
		);
		var F1 = new Vect3();
		var F1 = Vect3.add(F1, F12);
		var a1 = Vect3.div(F1, m1);
		
		// Calculate force on particle 2
		var r21 = Vect3.sub(r2, r1);
		var d21 = r21.len();
		var u21 = r21.unit();
		var F21 = Vect3.mul(
			-G * m2 * m1 / d21 * d21, u21
		);
		var F2 = new Vect3();
		var F2 = Vect3.add(F2, F21);
		var a2 = Vect3.div(F2, m2);
		
		// Perform numerical integration
		v1 = Vect3.add(v1, Vect3.mul(a1, dt));
		r1 = Vect3.add(r1, Vect3.mul(v1, dt));
		v2 = Vect3.add(v2, Vect3.mul(a2, dt));
		r2 = Vect3.add(r2, Vect3.mul(v2, dt));
		
		// Copy back value to particle
		o1.r = r1;
		o1.v = v1;
		o2.r = r2;
		o2.v = v2;
		
		// Display results
		if(tshow >= Tshow) {
			console.log(
				t.toFixed(5) + "\t" +
				o1.r.x.toExponential(5) + "\t" +
				o1.r.y.toExponential(5) + "\t" +
				o2.r.x.toExponential(5) + "\t" +
				o2.r.y.toExponential(5)
			);
			
			var rr1 = transform({x: r1.x, y: r1.y});
			var rr2 = transform({x: r2.x, y: r2.y});
			drawCircle("drawingboard", rr1, "#00f");
			drawCircle("drawingboard", rr2, "#f00");
			tshow = 0;
		}
		
		// Increase time
		t += dt;
		tshow += dt;
	}	
}

// 20180129.0527 ok
function test_vector_unit() {
	// Define vector
	var r = new Vect3(3, 0, 4);
	
	// Get unit vector
	var l = r.len();
	var ur = r.unit();
	console.log(
		"\hat{r} = " +
		r.strval() + " / " +
		l + " = " + ur.strval()
	);
}

// 20180129.0524 ok
function test_vector_length() {
	// Define vector
	var r = new Vect3(3, 0, 4);
	
	// Get vector length
	var l = r.len();
	console.log(
		"|" +	r.strval() + "| = " +
		l
	);
}

// 20180129.0520 ok
function test_vector_cross() {
	// Define vector and scalar
	var r1 = new Vect3(1, 2, 0);
	var r2 = new Vect3(-2, 1, 0);
	
	// Cross two vectors
	var rcross = Vect3.cross(r1, r2);
	console.log(
		r1.strval() + " . " +
		r2.strval() + " = " +
		rcross.strval()
	);
}

// 20180129.0518 ok
function test_vector_dot() {
	// Define vectors
	var r1 = new Vect3(1, 2, 0);
	var r2 = new Vect3(-2, 1, 0);
	
	// Dot two vectors
	var dot = Vect3.dot(r1, r2);
	console.log(
		r1.strval() + " . " +
		r2.strval() + " = " +
		dot
	);
}

// 20180129.0512 ok
function test_vector_div() {
	// Define vector and scalar
	var r = new Vect3(10, 20, 30);
	var a = 5;
	
	// Divide vector with scalar
	var rdiv = Vect3.div(r, a);
	console.log(
		r.strval() + " / " +
		a + " = " +
		rdiv.strval()
	);
}

// 20180129.0511 ok
function test_vector_mul() {
	// Define vector and scalar
	var r = new Vect3(1, 2, 3);
	var a = 2.5;
	
	// Multiply vector with scalar
	var rmul = Vect3.mul(r, a);
	console.log(
		r.strval() + " x " +
		a + " = " +
		rmul.strval()
	);
}

// 20180129.0507 ok
function test_vector_sub() {
	// Define some vectors
	var r1 = new Vect3(1, 2, 3);
	var r2 = new Vect3(-1, -2, 3);
	
	// Sub vectors and show result
	var rsub = Vect3.sub(r1, r2);
	console.log(
		r1.strval() + " - " +
		r2.strval() + " = " +
		rsub.strval()
	);
}

// 20180129.0506 ok
function test_vector_add() {
	// Define some vectors
	var r1 = new Vect3(1, 2, 3);
	var r2 = new Vect3(-1, -2, 3);
	var r3 = new Vect3(2, 2, -4);
	
	// Add vectors and show result
	var radd = Vect3.add(r1, r2, r3);
	console.log(
		r1.strval() + " + " +
		r2.strval() + " + " +
		r3.strval() + " = " +
		radd.strval()
	);
}

// 20180123.0943 ok
function test_uniform_circular_motion() {
	// Create a div container
	var d = document.createElement("div");
	d.style.width = "200px";
	d.style.height = "200px";
	d.style.border = "1px solid #ccc";
	d.style.float = "left";
	document.body.appendChild(d);
	
	// Create text area
	var t = document.createElement("textarea");
	t.id = "writingboard";
	t.style.width = "194px";
	t.style.height = "170px";
	t.style.overflowY = "scroll";
	d.appendChild(t);
	
	// Create buttons
	var b1 = document.createElement("button");
	b1.innerHTML = "Load";
	b1.style.width = "50px";
	b1.addEventListener("click", loadData);
	d.appendChild(b1);
	var b2 = document.createElement("button");
	b2.innerHTML = "Read";
	b2.style.width = "50px";
	b2.addEventListener("click", readData);
	d.appendChild(b2);
	var b3 = document.createElement("button");
	b3.innerHTML = "Start";
	b3.style.width = "50px";
	b3.addEventListener("click", toggle);
	d.appendChild(b3);
	var b4 = document.createElement("button");
	b4.innerHTML = "Clear";
	b4.style.width = "50px";
	b4.addEventListener("click", clearAll);
	d.appendChild(b4);	
	
	// Define world coordinate
	var xmin = -1.0;
	var ymin = -1.0;
	var xmax = 1.0;
	var ymax = 1.0;
	
	// Define canvas size
	var canvasWidth = 200;
	var canvasHeight = 200;
	
	// Define canvas coordinate
	var XMIN = 0;
	var YMIN = canvasHeight;
	var XMAX = canvasWidth;
	var YMAX = 0;
	
	// Create a canvas
	var c = document.createElement("canvas");
	c.id = "drawingboard";
	c.width = canvasWidth;
	c.height = canvasHeight;
	c.style.border = "1px solid #ccc";
	document.body.appendChild(c);
	
	// Load data
	function loadData() {
		t.value = "period\t1\n";
		t.value += "theta\t0\n"
		t.value += "radius\t0.8\n"
	}
	
	// Define physical parameters
	var R = 0.8;
	var theta = 0;
	var dtheta = 0.1;
	var T = 1;
	
	// Start simulasion
	function readData() {
		theta = parseFloat(getValue("writingboard", "theta"));
		T = getValue("writingboard", "period");
		R = getValue("writingboard", "radius");
		clear("drawingboard", "#fff");
		var x = R * Math.cos(theta);
		var y = R * Math.sin(theta);
		var r = transform({x: x, y: y});
		drawCircle("drawingboard", r, "#f00");
	}
	
	// Define variable for setInterval
	var cf;
	var SIMULATING = false;
	
	// Start and stop simulation
	function toggle() {
		if(!SIMULATING) {
			b3.innerHTML = "Stop";
			cf = setInterval(simulate, 10 * T);
		} else {
			b3.innerHTML = "Start";
			clearInterval(cf);
		}
		SIMULATING = !SIMULATING;
	}
	
	// Perform simulation
	function simulate() {
		clear("drawingboard", "#fff");
		theta += parseFloat(dtheta);
		var x = R * Math.cos(theta);
		var y = R * Math.sin(theta);
		var r = transform({x: x, y: y});
		drawCircle("drawingboard", r, "#f00");
	}
	
	// Draw a circle
	function drawCircle(id, r, color) {
		var cx = document.getElementById(id).getContext("2d");
		cx.strokeStyle = color;
		cx.beginPath();
		cx.arc(r.x, r.y, 2, 0, 2 * Math.PI);
		cx.stroke();
	}
	
	// Clear textarea and canvas
	function clearAll() {
		clear("writingboard");
		clear("drawingboard", "#fff");
	}
	
	// Clear textarea or canvas with color
	function clear() {
		var id = arguments[0];
		var el = document.getElementById(id);
		if(arguments.length == 1) {
			el.value = "";
		} else if(arguments.length == 2) {
			var color = arguments[1];
			var cx = el.getContext("2d");
			cx.fillStyle = color;
			cx.fillRect(0, 0, c.width, c.height);
		}
	}
	
	// Get lines from textarea
	function getValue(id, name) {
		var ta = document.getElementById(id);
		var lines = ta.value.split("\n");
		var M = lines.length;
		var x = "";
		for(var i = 0; i < M; i++) {
			var columns = lines[i].split("\t");
			if(columns[0] == name) {
				x = columns[1];
			}
		}
		return x;
	}
	
	// Transform (x, y) to (X, Y)
	function transform(r) {
		var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
		X += XMIN;
		var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
		Y += YMIN;
		return {x: X, y: Y};
	}
}

// 20180123.0551 ok 
function test_moving_button() {
	// Get window size
	var xmin = 0;
	var ymin = 0;
	var xmax = window.innerWidth;
	var ymax = window.innerHeight;
	
	// Define triangle character
	var au_0 = "&#x25b3;";
	var ar_0 = "&#x25b7;";
	var ad_0 = "&#x25bd;";
	var al_0 = "&#x25c1;";
	var au_1 = "&#x25b2;";
	var ar_1 = "&#x25b6;";
	var ad_1 = "&#x25bc;";
	var al_1 = "&#x25c0;";
	
	// Define button status and direction
	var MOVING = false;
	var DIR = {x: 1, y: 0};
	
	// Define variabel for setInterval and period
	var calledFunction;
	var period = 100;
	
	// Create a button
	var btn = document.createElement("button");
	btn.innerHTML = ar_0;
	btn.style.width = "30px";
	btn.style.height = "30px";
	btn.style.position = "relative";
	btn.style.left = "0px";
	btn.style.top = "0px";
	btn.addEventListener("click", buttonClick);
	document.body.appendChild(btn);
	
	// Move button
	function buttonClick() {
		// Change button state
		MOVING = !MOVING;
		
		// Move or stop button
		if(MOVING) {
			calledFunction = setInterval(moveButton, period)
			changeIcon();
		} else {
			clearInterval(calledFunction);
			calledFunction--;
			changeIcon();
		}
		
		// Move button
		function moveButton() {
			changeIcon();
			
			// Change button position
			var bx = parseInt(btn.style.left);
			var by = parseInt(btn.style.top);
			bx += DIR.x * 10;
			by += DIR.y * 10;
			btn.style.left = bx + "px";
			btn.style.top = by + "px";
			
			// Change x direction
			if(bx > xmax - parseInt(btn.style.width) - 15) {
				bx = xmax - parseInt(btn.style.width) - 15;
				btn.style.left = bx + "px";
				DIR.x = 0;
				DIR.y = 1;
			}
			if(bx < xmin) {
				bx = xmin;
				btn.style.left = bx + "px";
				DIR.x = 0;
				DIR.y = -1;
			}
			
			// Change y direction
			if(by > ymax - parseInt(btn.style.height) - 15) {
				by = ymax - parseInt(btn.style.height) - 15;
				btn.style.top = by + "px";
				DIR.x = -1;
				DIR.y = 0;
			}
			if(by < ymin) {
				by = ymin;
				btn.style.top = by + "px";
				DIR.x = 1;
				DIR.y = 0;
			}
		}
		
		// Change button icon
		function changeIcon() {
			// Change button icon
			if(DIR.x == 1 && DIR.y == 0 && !MOVING) {
				btn.innerHTML = ar_0;
			}
			if(DIR.x == 1 && DIR.y == 0 && MOVING) {
				btn.innerHTML = ar_1;
			}
			if(DIR.x == 0 && DIR.y == 1 && !MOVING) {
				btn.innerHTML = ad_0;
			}
			if(DIR.x == 0 && DIR.y == 1 && MOVING) {
				btn.innerHTML = ad_1;
			}
			if(DIR.x == -1 && DIR.y == 0 && !MOVING) {
				btn.innerHTML = al_0;
			}
			if(DIR.x == -1 && DIR.y == 0 && MOVING) {
				btn.innerHTML = al_1;
			}
			if(DIR.x == 0 && DIR.y == -1 && !MOVING) {
				btn.innerHTML = au_0;
			}
			if(DIR.x == 0 && DIR.y == -1 && MOVING) {
				btn.innerHTML = au_1;
			}
		}
	}
}

// 20180123.0411 ok
function test_set_stop_interval() {
	// Define a counter
	var i = 0;
	
	// Set period
	var period = 100; // ms
	
	// Define variable for setInterval();
	var calledFunction;
	
	// Define start button
	var btnStart = document.createElement("button");
	btnStart.innerHTML = "Start";
	btnStart.addEventListener("click", startCounting)
	document.body.appendChild(btnStart);
	
	// Define stop button
	var btnStop = document.createElement("button");
	btnStop.innerHTML = "Stop";
	btnStop.addEventListener("click", stopCounting)
	document.body.appendChild(btnStop);
	
	// Start counting
	function startCounting() {
		calledFunction = setInterval(inc, period);
		console.log("START");
		console.log(calledFunction);
	}
	
	// Stop counting
	function stopCounting() {
		clearInterval(calledFunction);
		calledFunction--;
		console.log("STOP");
	}
	
	// Increment j by 1
	function inc() {
		i++;
		console.log(i);
	}
}

// 20180123.0401 ok
function test_set_interval() {
	var i = 0;
	var period = 100; // ms
	
	var calledFunction = setInterval(inc, period);
	
	// Increment j by 1
	function inc() {
		i++;
		console.log(i);
	}
}

// 20180121.1936 ok
function test_get_parameters_from_textarea() {
	// Create object of type textarea
	var ta = document.createElement("textarea");
	ta.style.width = "100px";
	ta.style.height = "100px";
	ta.value = "Npoly\t6\nColor\t#000";
	document.body.appendChild(ta);
	
	// Define world coordinate
	var xmin = -1.0;
	var ymin = -1.0;
	var xmax = 1.0;
	var ymax = 1.0;
	
	// Define canvas size
	var canvasWidth = 100;
	var canvasHeight = 104;
	
	// Define canvas coordinate
	var XMIN = 0;
	var YMIN = canvasHeight;
	var XMAX = canvasWidth;
	var YMAX = 0;
	
	// Create canvas
	var c = document.createElement("canvas");
	c.width = canvasWidth;
	c.height = canvasHeight;
	c.id = "canvas1";
	c.style.background = "#eef";
	c.style.border = "1px solid #aaa";
	document.body.appendChild(c);
	
	// Get context of canvas
	var cx = c.getContext("2d");
	
	// Create button
	var btn = document.createElement("button");
	btn.innerHTML = "Get lines";
	document.body.appendChild(btn);
	btn.addEventListener("click", buttonClick);
	
	function buttonClick() {
		var N = getValue("Npoly");
		var color = getValue("Color");
		cx.clearRect(0, 0, canvasWidth, canvasHeight);
		drawPoly(0, 0, 1, N, color);
	}
	
	// Get lines from textarea
	function getValue(name) {
		var lines = ta.value.split("\n");
		var M = lines.length;
		var x = "";
		for(var i = 0; i < M; i++) {
			var columns = lines[i].split("\t");
			if(columns[0] == name) {
				x = columns[1];
			}
		}
		return x;
	}
	
	// Draw a polygon
	function drawPoly(xc, yc, R, N, color) {
		// Set stroke style and begin path
		cx.strokeStyle = color;
		cx.beginPath();
		
		for(var i = 0; i < N; i++) {
			// Get (x, y) from parametric function
			var r = circularPath(i, 0, N, R, xc, yc);
			
			// Transform coordinates
			var RR = transform(r);
			
			// Draw a pixel
			if(i == 0) {
				cx.moveTo(RR.x, RR.y);
			} else {
				cx.lineTo(RR.x, RR.y);
			}
		}
		
		// Close the path
		cx.closePath();

		// Stroke the polygon curve (circular path)
		cx.stroke();
	}
	
	// Transform (x, y) to (X, Y)
	function transform(r) {
		var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
		X += XMIN;
		var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
		Y += YMIN;
		return {x: X, y: Y};
	}
	
	// Create a parametric function for a circular path
	function circularPath(c, cmin, cmax, R, xc, yc) {
		var cc = (c - cmin) / (cmax - cmin) * 2 * Math.PI;
		var x = xc + R * Math.cos(cc);
		var y = yc + R * Math.sin(cc);
		var r = {x: x, y: y};
		return r;
	}
}

// 20180121.1927 ok
function test_get_parameter_from_textarea() {
	// Create object of type textarea
	var ta = document.createElement("textarea");
	ta.style.width = "100px";
	ta.style.height = "100px";
	ta.value = "Npoly\t6";
	document.body.appendChild(ta);
	
	// Define world coordinate
	var xmin = -1.0;
	var ymin = -1.0;
	var xmax = 1.0;
	var ymax = 1.0;
	
	// Define canvas size
	var canvasWidth = 100;
	var canvasHeight = 104;
	
	// Define canvas coordinate
	var XMIN = 0;
	var YMIN = canvasHeight;
	var XMAX = canvasWidth;
	var YMAX = 0;
	
	// Create canvas
	var c = document.createElement("canvas");
	c.width = canvasWidth;
	c.height = canvasHeight;
	c.id = "canvas1";
	c.style.background = "#eef";
	c.style.border = "1px solid #aaa";
	document.body.appendChild(c);
	
	// Get context of canvas
	var cx = c.getContext("2d");
	
	// Create button
	var btn = document.createElement("button");
	btn.innerHTML = "Get lines";
	document.body.appendChild(btn);
	btn.addEventListener("click", buttonClick);
	
	function buttonClick() {
		var N = getValue("Npoly");
		cx.clearRect(0, 0, canvasWidth, canvasHeight);
		drawPoly(0, 0, 1, N, "#00f");
	}
	
	// Get lines from textarea
	function getValue(name) {
		var lines = ta.value.split("\n");
		var M = lines.length;
		var x = 0;
		for(var i = 0; i < M; i++) {
			var columns = lines[i].split("\t");
			if(columns[0] == name) {
				x = parseInt(columns[1]);
			}
		}
		return x;
	}
	
	// Draw a polygon
	function drawPoly(xc, yc, R, N, color) {
		// Set stroke style and begin path
		cx.strokeStyle = color;
		cx.beginPath();
		
		for(var i = 0; i < N; i++) {
			// Get (x, y) from parametric function
			var r = circularPath(i, 0, N, R, xc, yc);
			
			// Transform coordinates
			var RR = transform(r);
			
			// Draw a pixel
			if(i == 0) {
				cx.moveTo(RR.x, RR.y);
			} else {
				cx.lineTo(RR.x, RR.y);
			}
		}
		
		// Close the path
		cx.closePath();

		// Stroke the polygon curve (circular path)
		cx.stroke();
	}
	
	// Transform (x, y) to (X, Y)
	function transform(r) {
		var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
		X += XMIN;
		var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
		Y += YMIN;
		return {x: X, y: Y};
	}
	
	// Create a parametric function for a circular path
	function circularPath(c, cmin, cmax, R, xc, yc) {
		var cc = (c - cmin) / (cmax - cmin) * 2 * Math.PI;
		var x = xc + R * Math.cos(cc);
		var y = yc + R * Math.sin(cc);
		var r = {x: x, y: y};
		return r;
	}
}

// 20180121.1909 ok
function test_get_textarea_lines_with_button() {
	// Create object of type textarea
	var ta = document.createElement("textarea");
	ta.style.width = "200px";
	ta.style.height = "100px";
	ta.value = "xmin\t0\nxmax\t100\nymin\t2\nymax\t10";
	document.body.appendChild(ta);
	
	// Create button
	var btn = document.createElement("button");
	btn.innerHTML = "Get lines";
	document.body.appendChild(btn);
	btn.addEventListener("click", getLinesFromTextarea);
	
	// Get lines from textarea
	function getLinesFromTextarea() {
		console.clear();
		var lines = ta.value.split("\n");
		var N = lines.length;
		for(var i = 0; i < N; i++) {
			console.log(lines[i] + "\n");
		}
	}
}

// 20180121.1900 ok
function test_get_textarea_lines() {
	// Create object of type textarea
	var ta = document.createElement("textarea");
	ta.style.width = "200px";
	ta.style.height = "100px";
	ta.value = "xmin\t0\nxmax\t100\nymin\t2\nymax\t10";
	document.body.appendChild(ta);
	
	// Get lines from textarea
	var lines = ta.value.split("\n");
	var N = lines.length;
	for(var i = 0; i < N; i++) {
		console.log(lines[i] + "\n");
	}
}

// 20180121.1852 ok
function test_textarea() {
	// Create object of type textarea and set it style
	var ta = document.createElement("textarea");
	ta.style.width = "380px";
	ta.style.height = "200px";
	ta.style.background = "#fdd";
	ta.style.fontcolor = "#f00";
	document.body.appendChild(ta);
	
	// Add some texts to the textarea
	ta.value = "Ini adalah baris pertama \n";
	ta.value += "Ini adalah baris kedua ";
	ta.value += "dan ini juga  baris kedua \n";
	ta.value += "Ini adalah baris ketiga";
}

// 20180121.1704 ok
function test_draw_polygon() {
	// Define world coordinate
	var xmin = -1.0;
	var ymin = -1.0;
	var xmax = 1.0;
	var ymax = 1.0;
	
	// Define canvas size
	var canvasWidth = 100;
	var canvasHeight = 100;
	
	// Define canvas coordinate
	var XMIN = 0;
	var YMIN = canvasHeight;
	var XMAX = canvasWidth;
	var YMAX = 0;
	
	// Create canvas
	var c = document.createElement("canvas");
	c.width = canvasWidth;
	c.height = canvasHeight;
	c.id = "canvas1";
	c.style.background = "#fee";
	c.style.border = "1px dashed #faa";
	document.body.appendChild(c);
	
	// Get context of canvas
	var cx = c.getContext("2d");
	
	// Draw a polygon
	drawPoly(0, 0, 1, 5, "#f0f");
	
	// Draw a polygon
	function drawPoly(xc, yc, R, N, color) {
		// Set stroke style and begin path
		cx.strokeStyle = color;
		cx.beginPath();
		
		for(var i = 0; i < N; i++) {
			// Get (x, y) from parametric function
			var r = circularPath(i, 0, N, R, xc, yc);
			
			// Transform coordinates
			var RR = transform(r);
			
			// Draw a pixel
			if(i == 0) {
				cx.moveTo(RR.x, RR.y);
			} else {
				cx.lineTo(RR.x, RR.y);
			}
		}
		
		// Close the path
		cx.closePath();

		// Stroke the polygon curve (circular path)
		cx.stroke();
	}
	
	// Transform (x, y) to (X, Y)
	function transform(r) {
		var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
		X += XMIN;
		var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
		Y += YMIN;
		return {x: X, y: Y};
	}
	
	// Create a parametric function for a circular path
	function circularPath(c, cmin, cmax, R, xc, yc) {
		var cc = (c - cmin) / (cmax - cmin) * 2 * Math.PI;
		var x = xc + R * Math.cos(cc);
		var y = yc + R * Math.sin(cc);
		var r = {x: x, y: y};
		return r;
	}
}

// 20180121.1658 ok
function test_coordinate_transformation() {
	// Define world coordinate
	var xmin = -1.0;
	var ymin = -1.0;
	var xmax = 1.0;
	var ymax = 1.0;
	
	// Define canvas size
	var canvasWidth = 100;
	var canvasHeight = 100;
	
	// Define canvas coordinate
	var XMIN = 0;
	var YMIN = canvasHeight;
	var XMAX = canvasWidth;
	var YMAX = 0;
	
	// Create canvas
	var c = document.createElement("canvas");
	c.width = canvasWidth;
	c.height = canvasHeight;
	c.id = "canvas1";
	c.style.background = "#fee";
	c.style.border = "1px dashed #faa";
	document.body.appendChild(c);
	
	// Get context of canvas
	var cx = c.getContext("2d");
	
	// Create data using parametric function
	var N = 100;
	
	// Set stroke style and begin path
	cx.strokeStyle = "#00f";
	cx.beginPath();
	for(var i = 0; i < N; i++) {
		// Get (x, y) from parametric function
		var r = circularPath(i, 0, N, 0.5, 0.5, 0.25);
		
		// Transform coordinates
		var RR = transform(r);
		
		// Draw a pixel
		if(i == 0) {
			cx.moveTo(RR.x, RR.y);
		} else {
			cx.lineTo(RR.x, RR.y);
		}
	}
	
	// Close the path
	cx.closePath();

	// Stroke the polygon curve (circular path)
	cx.stroke();
	
	// Transform (x, y) to (X, Y)
	function transform(r) {
		var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
		X += XMIN;
		var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
		Y += YMIN;
		return {x: X, y: Y};
	}
	
	// Create a parametric function for a circular path
	function circularPath(c, cmin, cmax, R, xc, yc) {
		var cc = (c - cmin) / (cmax - cmin) * 2 * Math.PI;
		var x = xc + R * Math.cos(cc);
		var y = yc + R * Math.sin(cc);
		var r = {x: x, y: y};
		return r;
	}
}

// 20180120.1919 ok
function test_temperature_conversion() {
	// Define some temperature references in oC and oF
	var THC = 100;
	var TCC = 0;
	var THF = 212;
	var TCF = 32;
	
	// Convert oC to oF and then back to oC
	var TC = 20;
	var TF = C2F(TC);
	console.log("T = " + TF + " oF");
	var TC2 = F2C(TF);
	console.log("T = " + TC2 + " oC");
	
	// Convert from oC to oF
	function C2F(TC) {
		var TF = (TC - TCC) / (THC - TCC) * (THF - TCF) + TCF;
		return TF;
	}
	
	// Convert from oF to oC
	function F2C(TF) {
		var TC = (TF - TCF) / (THF - TCF) * (THC - TCC) + TCC;
		return TC;
	}
}

// 20180116.0950 ok
function test_table() {
	var table = document.createElement("table");
	table.border = "1";
	document.body.appendChild(table);
	
	var row1 = document.createElement("tr");
	table.appendChild(row1);
	
	var col11 = document.createElement("td");
	row1.appendChild(col11);
	col11.innerHTML = "(1,1) A";

	var col12 = document.createElement("td");
	row1.appendChild(col12);
	col12.innerHTML = "(1,2) B";
	
	var row2 = document.createElement("tr");
	table.appendChild(row2);
	
	var col21 = document.createElement("td");
	row2.appendChild(col21);
	col21.innerHTML = "(2,1) C";

	var col22 = document.createElement("td");
	row2.appendChild(col22);
	col22.innerHTML = "(2,2) D";
}

// 20180116.0941 ok
function test_canvas_circles() {
	var c = document.createElement("canvas");
	c.width = 300;
	c.height = 200;
	c.style.background = "#eee";
	var cx = c.getContext("2d");
	for(var x = 50; x < 300; x += 50) {
		for(var y = 50; y < 200; y += 50) {
			var R = parseInt(Math.random() * 256);
			var G = parseInt(Math.random() * 256);
			var B = parseInt(Math.random() * 256);
			var colorRGB = "rgb(" + R + "," + G + "," + B + ")";
			cx.strokeStyle = colorRGB;
			cx.beginPath();
			cx.arc(x, y, 20, 0, 2 * Math.PI);
			cx.stroke()
		}
	}
	document.body.appendChild(c);
}


// 20180116.0936 ok
function test_canvas() {
	var c = document.createElement("canvas");
	c.width = 300;
	c.height = 200;
	c.style.background = "#eee";
	var cx = c.getContext("2d");
	cx.strokeStyle = "#f00";
	cx.beginPath();
	cx.arc(150, 100, 50, 0, 2 * Math.PI);
	cx.stroke()
	document.body.appendChild(c);
}

// 20180116.0927 !ok
function test_bilangan_acak() {
	var N = 10;
	for(var i = 0; i < N; i++) {
		var x = Math.random();
		var y = parseInt(x * 10);
		console.log(i + "\t"  + x + "\t" + y);
	}
}

// 20180116.0918
function test_create_button_from_parent() {
	// Define first id
	var id = "10";
	
	// Create first button
	var btn = document.createElement("button");
	btn.id = 10 + parseInt(Math.random() * 90);
	btn.innerHTML = btn.id;
	document.body.appendChild(btn);
	
	// Add event
	btn.addEventListener("click", createButton);
	
	// Create a button
	function createButton() {
		var btn = document.createElement("button");
		var id = 10 + parseInt(Math.random() * 90);
		var parentId = event.target.id;
		while(id == parentId) {
			id = 10 + parseInt(Math.random() * 90);
		}
		btn.id = id;
		btn.innerHTML = btn.id + " [" + parentId + "]";
		document.body.appendChild(btn);
		btn.addEventListener("click", createButton);
	}
}

// 20180116.0850 ok
function test_button_create_button() {
	// Define button number
	var buttonNumber = 1;
	// Create first visible button
	var btn = document.createElement("button");
	btn.innerHTML = "Create another";
	document.body.appendChild(btn);
	
	// Add an event only to to first button
	btn.addEventListener("click", createAnotherButton);
	
	// Create another button
	function createAnotherButton() {
		var btn = document.createElement("button");
		btn.innerHTML = "Another button " + buttonNumber;
		document.body.appendChild(btn);
		buttonNumber++;
	}
}

// 20180116.0842 ok
function test_hello_button() {
	// Create element of type button, which is <button></button>
	// in a HTML page
	var b = document.createElement("button");
	b.innerHTML = "Hello, World!";
	document.body.appendChild(b);
}

// 20180116.0840
function test_hello_paragraph() {
	// Create element of type paragraph, which is <p></p>
	// in a HTML page
	var p = document.createElement("p");
	p.innerHTML = "Hello, World!";
	document.body.appendChild(p);
}

// 20180116.0824 ok
function test_hello_title() {
	// Tags <title></title> inside section <head></head> should
	// already be defined
	var title = document.getElementsByTagName("title");
	title[0].text = "Hello, Wordl!";
}

// 20180116.0818 ok
function test_hello_console() {
	// Open concole in internet browser
	// Google Chrome: Ctrl+Shift+I, Ctrl+Shift+J
	// Mozilla Firefox: Ctrl+Shift+I
	// Internet Explorer: F12 then Ctrl+2
	console.log("Hello, World!");
}