/*
	vect3.js
	Library of Vect3 class in JavaScript
	Sparisoma Viridi | dudung@gmail.com
	
	20170214
	Create this library with following functions defined for
	Vect3 class
	add()	add two Vect3,
	sub() subtract two Vect3,
	dot()	dot product of two Vect3,
	crs()	cross product of two Vect3,
	mul()	multiplication of Vect3 with scalar,
	div() division of Vect3 with scalar,
	len() length of a Vect3,
	uni()	unit vector of a Vect3,
	neg()	negative of a Vect3.
	All are tested and works.
*/

// Class of Vect3
function Vect3() {
	// Define some constructor types
	if(arguments.length == 3) {
		this.x = arguments[0];
		this.y = arguments[1];
		this.z = arguments[2];
	} else if(arguments.length == 1){
		this.x = arguments[0].x;
		this.y = arguments[0].y;
		this.z = arguments[0].z;
	} else {
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
	this.strval = function() {
		var str = "(";
		str += this.x + ", ";
		str += this.y + ", ";
		str += this.z + ")";
		return str;
	}
}

// Define addition of Vect3
Vect3.add = function(r1, r2) {
	var r = new Vect3;
	r.x = r1.x + r2.x;
	r.y = r1.y + r2.y;
	r.z = r1.z + r2.z;
	return r;
}

// Define substraction of Vect3
Vect3.sub = function(r1, r2) {
	var r = new Vect3;
	r.x = r1.x - r2.x;
	r.y = r1.y - r2.y;
	r.z = r1.z - r2.z;
	return r;
}

// Define dot product of Vect3
Vect3.dot = function(r1, r2) {
	var l = r1.x * r2.x;
	l += r1.y * r2.y;
	l += r1.z * r2.z;
	return l;
}

// Define cross product of Vect3
Vect3.crs = function(r1, r2) {
	var r = new Vect3;
	r.x = r1.y * r2.z - r1.z * r2.y;
	r.y = r1.z * r2.x - r1.x * r2.z;
	r.z = r1.x * r2.y - r1.y * r2.x;
	return r;
}

// Define multiplication with scalar
Vect3.mul = function(a, b) {
	var r = new Vect3;
	if(a instanceof Vect3) {
		r.x = a.x * b;
		r.y = a.y * b;
		r.z = a.z * b;
	} else if(b instanceof Vect3) {
		r.x = a * b.x;
		r.y = a * b.y;
		r.z = a * b.z;
	}
	return r;
}

// Define division with scalar
Vect3.div = function(a, b) {
	var r = new Vect3;
	r.x = a.x / b;
	r.y = a.y / b;
	r.z = a.z / b;
	return r;
}

// Define length of Vect3
Vect3.len = function(r) {
	var l2 = Vect3.dot(r, r);
	var l = Math.sqrt(l2);
	return l;
}

// Define unit vector
Vect3.uni = function(a) {
	var l = Vect3.len(a);
	var r = Vect3.div(a, l);
	return r;
}

// Define negative of a vector
Vect3.neg = function(a) {
	var r = Vect3;
	r.x = -a.x;
	r.y = -a.y;
	r.z = -a.z;
	return r;
}
