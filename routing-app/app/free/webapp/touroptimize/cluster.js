var geocluster = require("geocluster");

// array of lat-lon-pairs
var coordinates = [
  [36.8499445, 30.6064743],
  [36.840488, 30.589451],
  [36.85345, 30.60246],
  [36.858061, 30.597205],
  [36.85876, 30.61051],
  [36.855291, 30.612669],
];

// multiply stdev with this factor, the smaller the more clusters
var bias = 1.5;

// result is an array of cluster objects with `centroid` and `elements` properties
var result = geocluster(coordinates, bias);

console.log(result)
