const access_token = "",
  annotations = "distance,duration",
  profile = "mapbox/driving";
coordinates = "";

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
  coordinates = `${vehicles.value[0].longitude},${vehicles.value[0].latitude}`;
  for (let i = 0; i < 24; i++) {
    coordinates += `;${customers.value[i].longitude},${customers.value[i].latitude}`;
  }
}

async function getMatrix() {
  try {
    const response = await fetch(
      `https://api.mapbox.com/directions-matrix/v1/${profile}/${coordinates}?annotations=${annotations}&access_token=${access_token}`
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
  localStorage.setItem("distances", JSON.stringify(distances));
  console.log(distances);
}
