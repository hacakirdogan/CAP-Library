// Instantiate a map and platform object:
var platform = new H.service.Platform({
  apikey: "",
});

// Get the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

const warehouse = { lat: 36.94173, lng: 30.73187 };

// Instantiate the map:
var map = new H.Map(
  document.getElementById("mapContainer"),
  defaultLayers.vector.normal.map,
  {
    zoom: 10,
    center: warehouse,
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

const colors = {
  empty: "",
  blue: '"#0000FF"',
  red: '"#FF0000"',
  green: '"#008000"',
  black: '"#000000"',
};

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
  addMarkerToGroup(group, warehouse, htmlText, "0", colors.black);
}

addInfoBubble(map);

// Get an instance of the routing service version 8:
var router = platform.getRoutingService(null, 8);

// Define a callback function to process the routing response:
let onResult = [];
for (let i = 1; i < routingParameters.length; i++) {
  onResult[i] = function (result) {
    // ensure that at least one route was found
    if (result.routes.length) {
      result.routes[0].sections.forEach((section, j) => {
        // Create a linestring to use as a point source for the route line
        let linestring = H.geo.LineString.fromFlexiblePolyline(
          section.polyline
        );

        // Create a polyline to display the route:
        let routeLine = new H.map.Polyline(linestring, {
          style: { strokeColor: Object.keys(colors)[i], lineWidth: 3 },
        });

        // Create a marker for the start point:
        if (j > 0) {
          let startMarker = addMarker(
            section.departure.place.location,
            j,
            Object.values(colors)[i]
          );
        }
        // Create a marker for the end point:
        // let endMarker = addMarker(section.arrival.place.location, '0', blue);

        // Add the route polyline and the two markers to the map:
        map.addObjects([routeLine]);

        // Set the map's viewport to make the whole route visible:
        map
          .getViewModel()
          .setLookAtData({ bounds: routeLine.getBoundingBox() });
      });
    }
  };
  // Call calculateRoute() with the routing parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  router.calculateRoute(routingParameters[i], onResult[i], function (error) {
    alert(error.message);
  });
}
