//ExampleRules map
var exampleRules = new Map();

//Default
var defaultArr = [
	[2,3],
	[3]
];
exampleRules.set("Default", defaultArr);

//2 dot line gliders
var twoDotGliderArr = [
	[3,4],
	[2]
];
exampleRules.set("2-cell Gliders", twoDotGliderArr);

//Bouncing squares
var bouncingSquaresArr = [
	[5,6,7,8],
	[1]
];
exampleRules.set("Bouncing Squares", bouncingSquaresArr);

//Hypno strobe
var hypnoStrobeArr = [
	[5],
	[1,2,3,4,5,6]
];
exampleRules.set("Hypno Strobe", hypnoStrobeArr);

//Square explosion
var squareExplosionArr = [
	[2,3,4],
	[1,2]
];
exampleRules.set("Square Explosion", squareExplosionArr);

//Growing Splotches
var growingSplotchesArr = [
	[4,5,6,7,8],
	[1]
];
exampleRules.set("Growing Splotches", growingSplotchesArr);

//Decaying blob in the middle
var decayingBlobArr = [
	[5,6,7,8],
	[0,1,5]
];
exampleRules.set("Decay", decayingBlobArr);

//Decaying strobing blob
var decayingStrobingBlobArr = [
	[3,4],
	[0,1,7]
];
exampleRules.set("Strobe Decay", decayingStrobingBlobArr);
