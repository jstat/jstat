## Overview

### Description

jStat is a statistical library written in JavaScript that allows you to perform advanced statistical operations without the need of a dedicated statistical language (e.g. MATLAB or R).

### Architecture

All functionality breaks into one of either static or instance methods. Static methods have been written to be as quick an simple as possible, which means they can be quite inflexible. They also work with native JavaScript data types (e.g. Array's). Static methods were written with other developers in mind. It provides as low-level access to the calculations engine as possible. This way developers can use jStat in their programs without causing a significant amount of overhead.

Instance methods work from first creating a jStat Object, then doing all calculations on that object. While the instance methods cannot perform the calculations as quickly as the static methods, the added flexibility allows for for easy statistical analysis on one or many data sets. They were created for those who will be using jStat for statistical analysis.

Here is a simple example on the difference in usage between the static and instance methods:

	var myVect = [2,6,4,7,2,7,4],
		jObj = jStat( myVect );

	// calculate the sum of the the vector
	jStat.sum( myVect );
	jObj.sum();

Now say we want to do several operations on the vector (e.g. sum, min, max, and standard deviation). This can be accomplished using the static methods, but each will need to be called separately. By using the jStat object we can pass callback functions and chain the execution of each operation:

	jObj.sum( function( val ) {
		// val === sum
	}).min( function( val ) {
		// val === min
	}).max( function( val ) {
		// val === max
	}).stdev( function( val ) {
		// val === st. dev.
	});

This method sets each calculation to be executed in an asynchronous queue. Very useful method of preventing blocking when working with large data sets.
