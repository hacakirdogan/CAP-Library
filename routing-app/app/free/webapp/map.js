// Instantiate a map and platform object:
var platform = new H.service.Platform({
  apikey: '1kIwvXFc2n1p6Xvfpj0sxVqbStL2In5Uk1FkXs6rXGg',
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

// add a resize listener to make sure that the map occupies the whole container
// map.addEventListener("resize", () => map.getViewPort().resize());

var mapEvents = new H.mapevents.MapEvents(map);
var behavior = new H.mapevents.Behavior(mapEvents);
var ui = H.ui.UI.createDefault(map, defaultLayers, "tr-TR");

// Create the parameters for the routing request:
let routingParameters = [];
for (let i = 1; i < waypoints.length; i++) {
  const origin = waypoints[i].shift();
  const destination = waypoints[i].pop();
  routingParameters[i] = {
    routingMode: "fast",
    transportMode: "car",
    // The start point of the route:
    origin: origin,
    // The end point of the route:
    destination: destination,
    // defines multiple waypoints
    via: new H.service.Url.MultiValueQueryParameter(waypoints[i]),
    // Include the route shape in the response
    return: "polyline",
  };
}

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

addInfoBubble(map);

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
router.calculateRoute(routingParameters[1], onResult, function (error) {
  alert(error.message);
});
router.calculateRoute(routingParameters[2], onResult2, function (error) {
  alert(error.message);
});
router.calculateRoute(routingParameters[3], onResult3, function (error) {
  alert(error.message);
});
