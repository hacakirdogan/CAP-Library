const apiKey = "";

let body = {
  locations: [],
  metrics: ["distance", "duration"],
};

async function start() {
  const vehicles = await getVehicles();
  const customers = await getCustomers();
  getCoordinates(vehicles, customers);
  const matrix = await getMatrix();
  roundMatrix(matrix.distances);
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

async function getCoordinates(vehicles, customers) {
  body.locations.push([
    vehicles.value[0].longitude,
    vehicles.value[0].latitude,
  ]);
  for (let i = 0; i < 24; i++) {
    body.locations.push([
      customers.value[i].longitude,
      customers.value[i].latitude,
    ]);
  }
}

async function getMatrix() {
  try {
    const response = await fetch(
      `https://api.openrouteservice.org/v2/matrix/driving-car`,
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
    return await response.json();
  } catch (error) {
    console.error("Error planning tour:", error);
  }
}

async function roundMatrix(distances) {
  for (let i = 0; i < distances.length; i++) {
    for (let j = 0; j < distances[i].length; j++) {
      distances[i][j] = Math.round(distances[i][j]);
    }
  }
  localStorage.setItem("open_distances", JSON.stringify(distances));
  console.log(distances);
}
