const apikey = "";

let body = {
  fleet: {
    types: [
      {
        id: "myVehicleType",
        profile: "normal_car",
        costs: {
          fixed: 50.0,
          distance: 1.5,
          time: 0,
        },
        shifts: [
          {
            start: {
              time: "",
              location: {
                lat: "",
                lng: "",
              },
            },
            end: {
              time: "",
              location: {
                lat: "",
                lng: "",
              },
            },
          },
        ],
        capacity: [],
        amount: "",
      },
    ],
    profiles: [
      {
        type: "car",
        name: "normal_car",
      },
    ],
  },
  plan: {
    jobs: [],
  },
};

async function start() {
  const vehicles = await getVehicles();
  const customers = await getCustomers();
  fillBody(vehicles, customers);
  console.log(body);
  // planTour();
}
// start();

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
  body.fleet.types[0].amount = vehicles.value.length;
  body.fleet.types[0].capacity = [
    Math.ceil(customers.value.length / vehicles.value.length),
  ];
  body.fleet.types[0].shifts[0].start.time = "2023-08-19T09:00:00Z";
  body.fleet.types[0].shifts[0].start.location.lat = vehicles.value[0].latitude;
  body.fleet.types[0].shifts[0].start.location.lng =
    vehicles.value[0].longitude;
  body.fleet.types[0].shifts[0].end.time = "2023-08-19T18:00:00Z";
  body.fleet.types[0].shifts[0].end.location.lat = vehicles.value[0].latitude;
  body.fleet.types[0].shifts[0].end.location.lng = vehicles.value[0].longitude;
  for (let i = 0; i < customers.value.length; i++) {
    body.plan.jobs.push({
      id: "job_" + i,
      tasks: {
        deliveries: [
          {
            places: [
              {
                location: {
                  lat: customers.value[i].latitude,
                  lng: customers.value[i].longitude,
                },
                duration: customers.value[i].waiting * 60,
              },
            ],
            demand: [1],
          },
        ],
      },
    });
  }
}

async function planTour() {
  try {
    const response = await fetch(
      `https://tourplanning.hereapi.com/v3/problems?apikey=${apikey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const tourPlan = await response.json();
    localStorage.setItem("tourPlan", JSON.stringify(tourPlan));
    console.log("Optimized Tour Plan:", tourPlan);
  } catch (error) {
    console.error("Error planning tour:", error);
  }
}

let tourPlan = JSON.parse(localStorage.getItem("tourPlan"));

const stops = [];
for (let i = 0; i < tourPlan.tours.length; i++) {
  stops[i] = tourPlan.tours[i].stops;
}

const waypoints = [];
for (let j = 0; j < stops.length; j++) {
  for (let k = 0; k < stops[j].length; k++) {
    if (waypoints[j] == undefined) {
      waypoints[j] = [
        `${stops[j][k].location.lat},${stops[j][k].location.lng}`,
      ];
    } else {
      waypoints[j] = [].concat(
        waypoints[j],
        `${stops[j][k].location.lat},${stops[j][k].location.lng}`
      );
    }
  }
}


console.log(waypoints)
