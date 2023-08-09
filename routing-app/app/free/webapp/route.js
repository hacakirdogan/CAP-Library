// Instantiate a map and platform object:
var platform = new H.service.Platform({
  apikey: "",
});

// Get the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate the map:
var map = new H.Map(
  document.getElementById("mapContainer"),
  defaultLayers.vector.normal.map,
  {
    zoom: 10,
    center: { lat: 41.02, lng: 29.05 },
  }
);

// map.addLayer(defaultLayers.vector.normal.traffic);
// map.addLayer(defaultLayers.vector.normal.trafficincidents);

// add a resize listener to make sure that the map occupies the whole container
map.addEventListener("resize", () => map.getViewPort().resize());

var mapEvents = new H.mapevents.MapEvents(map);
var behavior = new H.mapevents.Behavior(mapEvents);

var ui = H.ui.UI.createDefault(map, defaultLayers, "tr-TR");

// Get an instance of the search service:
var service = platform.getSearchService();

// Call the geocode method with the geocoding parameters,
// the callback and an error callback function (called if a
// communication error occurs):
// service.geocode({
//   q: 'Bahçelievler, Bosna Blv No: 140, 34680 Üsküdar/İstanbul'
// }, (result) => {
//   // Add a marker for each location found
//   result.items.forEach((item) => {
//     map.addObject(new H.map.Marker(item.position));
//   });
// }, alert);

// Call the reverse geocode method with the geocoding parameters,
// the callback and an error callback function (called if a
// communication error occurs):
// service.reverseGeocode({
//   at: '41.04247539724414,29.039862392909274,150'
// }, (result) => {
//   result.items.forEach((item) => {
//     // Assumption: ui is instantiated
//     // Create an InfoBubble at the returned location with
//     // the address as its contents:
//     ui.addBubble(new H.ui.InfoBubble(item.position, {
//       content: item.address.label
//     }));
//   });
// }, alert);

// This array holds instances of H.map.Marker representing the route waypoints
const waypoints = [
  "41.03452671852723,29.071230402519824",
  "41.04734756782421,29.077037704271138",
  "41.04247539724414,29.039862392909274",
  "41.030732234172014,29.02753503118113",
  "41.014678139594,29.02772953263123",
];

const waypoints2 = [
  "41.01822138763166,29.06607390005595",
  "40.99901399332795,29.099975160763623",
  "40.98667525730876,29.099536308929682",
];

const waypoints3 = [
  "41.004892712749076,29.071340115166347",
  "40.96919833214902,29.064976771139857",
  "40.98650962121526,29.052908360385736",
  "40.99718572244428,29.04308700198174",
];

// Create the parameters for the routing request:
var routingParameters = {
  routingMode: "fast",
  transportMode: "car",
  // The start point of the route:
  origin: "41.02031822963801,29.04687657961709",
  // The end point of the route:
  destination: "41.02031822963801,29.04687657961709",
  // defines multiple waypoints
  via: new H.service.Url.MultiValueQueryParameter(waypoints),
  // Include the route shape in the response
  return: "polyline",
};

var routingParameters2 = {
  routingMode: "fast",
  transportMode: "car",
  // The start point of the route:
  origin: "41.02031822963801,29.04687657961709",
  // The end point of the route:
  destination: "41.02031822963801,29.04687657961709",
  // defines multiple waypoints
  via: new H.service.Url.MultiValueQueryParameter(waypoints2),
  // Include the route shape in the response
  return: "polyline",
};

var routingParameters3 = {
  routingMode: "fast",
  transportMode: "car",
  // The start point of the route:
  origin: "41.02031822963801,29.04687657961709",
  // The end point of the route:
  destination: "41.02031822963801,29.04687657961709",
  // defines multiple waypoints
  via: new H.service.Url.MultiValueQueryParameter(waypoints3),
  // Include the route shape in the response
  return: "polyline",
};

const green = '"#008000"';
const blue = '"#0000FF"';
const red = '"#FF0000"';
const black = '"#000000"';

function getMarkerIcon(id, color) {
  const svgCircle = `<svg width="30" height="30" version="1.1" xmlns="http://www.w3.org/2000/svg">
                           <g id="marker">
                             <circle cx="15" cy="15" r="10" fill=${color} stroke=${color} stroke-width="4" />
                             <text x="50%" y="50%" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="12px" dy=".3em">${id}</text>
                           </g></svg>`;
  return new H.map.Icon(svgCircle, {
    anchor: {
      x: 10,
      y: 10,
    },
  });
}
function addMarker(position, id, color) {
  const marker = new H.map.Marker(position, {
    data: {
      id,
    },
    icon: getMarkerIcon(id, color),
  });

  map.addObject(marker);
  return marker;
}

function addMarkerToGroup(group, coordinate, html, id, color) {
  var marker = new H.map.Marker(coordinate, {
    data: {
      id,
    },
    icon: getMarkerIcon(id, color),
  });

  marker.setData(html);
  group.addObject(marker);
}

function addInfoBubble(map) {
  var group = new H.map.Group();

  map.addObject(group);

  // add 'tap' event listener, that opens info bubble, to the group
  group.addEventListener(
    "tap",
    function (evt) {
      var coord = map.screenToGeo(
        evt.currentPointer.viewportX,
        evt.currentPointer.viewportY
      );
      // event target is the marker itself, group is a parent event target
      // for all objects that it contains
      var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
        // read custom data
        content: evt.target.getData() + `${coord.lat},` + ` ${coord.lng}`, // evt.target.getData()
      });
      // show info bubble
      ui.addBubble(bubble);
    },
    false
  );

  var htmlText = "<div>Depo</div>";
  addMarkerToGroup(
    group,
    { lat: 41.02031822963801, lng: 29.04687657961709 },
    htmlText,
    "0",
    black
  );
}

// Define a callback function to process the routing response:
var onResult = function (result) {
  // ensure that at least one route was found
  if (result.routes.length) {
    result.routes[0].sections.forEach((section, i) => {
      // Create a linestring to use as a point source for the route line
      let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

      // Create a polyline to display the route:
      let routeLine = new H.map.Polyline(linestring, {
        style: { strokeColor: "blue", lineWidth: 3 },
      });

      // Create a marker for the start point:
      if (i > 0) {
        let startMarker = addMarker(section.departure.place.location, i, blue);
      }
      // Create a marker for the end point:
      // let endMarker = addMarker(section.arrival.place.location, '0', blue);

      // Add the route polyline and the two markers to the map:
      map.addObjects([routeLine]);

      // Set the map's viewport to make the whole route visible:
      map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
    });
  }
};

var onResult2 = function (result) {
  // ensure that at least one route was found
  if (result.routes.length) {
    result.routes[0].sections.forEach((section, i) => {
      // Create a linestring to use as a point source for the route line
      let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

      // Create a polyline to display the route:
      let routeLine = new H.map.Polyline(linestring, {
        style: { strokeColor: "red", lineWidth: 3 },
      });

      if (i > 0) {
        let startMarker = addMarker(section.departure.place.location, i, red);
      }
      // Create a marker for the end point:
      // let endMarker = addMarker(section.arrival.place.location, '0', red);

      // Add the route polyline and the two markers to the map:
      map.addObjects([routeLine]);

      // Set the map's viewport to make the whole route visible:
      map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
    });
  }
};

var onResult3 = function (result) {
  // ensure that at least one route was found
  if (result.routes.length) {
    result.routes[0].sections.forEach((section, i) => {
      // Create a linestring to use as a point source for the route line
      let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

      // Create a polyline to display the route:
      let routeLine = new H.map.Polyline(linestring, {
        style: { strokeColor: "green", lineWidth: 3 },
      });
      // Create a marker for the start point:
      if (i > 0) {
        let startMarker = addMarker(section.departure.place.location, i, green);
      }

      // Create a marker for the end point:
      // let endMarker = addMarker(section.arrival.place.location, '0', green);

      // Add the route polyline and the two markers to the map:
      map.addObjects([routeLine]);

      // Set the map's viewport to make the whole route visible:
      map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
    });
  }
};

// Get an instance of the routing service version 8:
var router = platform.getRoutingService(null, 8);

// Call calculateRoute() with the routing parameters,
// the callback and an error callback function (called if a
// communication error occurs):
router.calculateRoute(routingParameters, onResult, function (error) {
  alert(error.message);
});
router.calculateRoute(routingParameters2, onResult2, function (error) {
  alert(error.message);
});
router.calculateRoute(routingParameters3, onResult3, function (error) {
  alert(error.message);
});

addInfoBubble(map);
