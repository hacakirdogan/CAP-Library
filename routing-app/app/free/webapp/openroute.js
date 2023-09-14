const apiKey = "5b3ce3597851110001cf6248fd1b31cb9abf413d92dd16ccb5248f55";

let body = {
  vehicles: [],
  jobs: [],
};

async function start() {
  const vehicles = await getVehicles();
  const customers = await getCustomers();
  fillBody(vehicles, customers);
  openRoute();
}
start();

async function getVehicles() {
  try {
    const response = await fetch("http://localhost:4004/browse/Vehicles");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getCustomers() {
  try {
    const response = await fetch("http://localhost:4004/browse/Customers");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fillBody(vehicles, customers) {
  for (let i = 0; i < vehicles.value.length; i++) {
    body.vehicles.push({
      id: Number(vehicles.value[i].vehicle),
      profile: "driving-car",
      capacity: [Math.ceil(customers.value.length / vehicles.value.length)],
      time_window: [1694509200, 1694538000],
      start: [vehicles.value[i].longitude, vehicles.value[i].latitude],
      end: [vehicles.value[i].longitude, vehicles.value[i].latitude],
    });
  }
  for (let i = 0; i < customers.value.length; i++) {
    body.jobs.push({
      id: Number(customers.value[i].customer),
      service: customers.value[i].waiting * 60,
      amount: [1],
      location: [customers.value[i].longitude, customers.value[i].latitude],
    });
  }
}

async function openRoute() {
  try {
    const response = await fetch(
      `https://api.openrouteservice.org/optimization`,
      {
        method: "POST",
        headers: {
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const openTour = await response.json();
    localStorage.setItem("openTour", JSON.stringify(openTour));
  } catch (error) {
    console.error("Error planning tour:", error);
  }
}

let openTour = JSON.parse(localStorage.getItem("openTour"));

const waypoints = [];
for (let i = 0; i < openTour.routes.length; i++) {
  for (let j = 0; j < openTour.routes[i].steps.length; j++) {
    if (waypoints[openTour.routes[i].vehicle] == undefined) {
      waypoints[openTour.routes[i].vehicle] = [
        `${openTour.routes[i].steps[j].location[1]},${openTour.routes[i].steps[j].location[0]}`,
      ];
    } else {
      waypoints[openTour.routes[i].vehicle] = [].concat(
        waypoints[openTour.routes[i].vehicle],
        `${openTour.routes[i].steps[j].location[1]},${openTour.routes[i].steps[j].location[0]}`
      );
    }
  }
}
