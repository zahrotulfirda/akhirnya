/*
	force.js
	Library of some types of physical force.
	Sparisoma Viridi | dudung@gmail.com
	
	20170214
	Create this library and define some constants,
	e.g. kG, kR, kV, kE and some functions
	grav()	gravitation force,
	norm()	normal force,
	coul()	Coulomb force.
	These two are tested for value only and not yet in
	simulation.
	20170215
	Test the grav() and norm() in a simulation. They worked.
*/

// Define some constants
kG = 5E0;
kR = 1E5;
kV = 1.0;
kE = 1.0;
kV2 = 40.0;
ks=1.0;

// Class of Force
function Force() {
	
}

// Define gravitation force
Force.grav = function(p1, p2) {
	var m1 = p1.m;
	var m2 = p2.m;
	var r1 = p1.r;
	var r2 = p2.r;
	var r = Vect3.sub(r1, r2);
	var u = Vect3.uni(r);
	var f = Vect3.mul(-kG * m1 * m2 / Vect3.dot(r, r), u);
	return f;
}

// Define normal force
Force.norm = function(p1, p2) {
	var R1 = 0.5 * p1.D;
	var R2 = 0.5 * p2.D;
	var r1 = p1.r;
	var r2 = p2.r;
	var r = Vect3.sub(r1, r2);
	var u = Vect3.uni(r);
	var v1 = p1.v;
	var v2 = p2.v;
	var v = Vect3.sub(v1, v2);
	var xi = Math.max(0, R1 + R2 - Vect3.len(r));
	var xidot = Vect3.len(v);
	var f = Vect3.mul(kR * xi - kV * xidot, u);
	if(xi == 0) {
		f = new Vect3;
	}
	return f;
}

// Define Coulomb force
Force.coul = function(p1, p2) {
	var q1 = p1.q;
	var q2 = p2.q;
	var r1 = p1.r;
	var r2 = p2.r;
	var r = Vect3.sub(r1, r2);
	var u = Vect3.uni(r);
	var f = Vect3.mul(kE * q1 * q2 / Vect3.dot(r, r), u);
	return f;
}

// Define viscous force
Force.visc = function(p) {
	var v = p.v;
	var f = Vect3.mul(-kV2, v);
	return f;
}

//Define spring force
Force.spring= function(p1, p2){
	var r1 = p1.r;
	var r2 = p2.r;
	var a = Vect3.sub(r1, r2);
	//var l = Vect3.len(r1, r2);
	var dx = Math.sqrt(Vect3.dot(a,a));
	var r = Vect3.sub(r1, r2);
	var u = Vect3.uni(r);
	var f = Vect3.mul(-ks * (dx-(2.5)), u);
	
	
	return f;
	}