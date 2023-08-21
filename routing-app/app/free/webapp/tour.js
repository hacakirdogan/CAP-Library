let customers = {};

// const apikey = "";

const body = {
  fleet: {
    types: [
      {
        id: "d3e7bb8d20c5",
        profile: "normal_car",
        costs: {
          fixed: 50.0,
          distance: 1.5,
          time: 0,
        },
        shifts: [
          {
            start: {
              time: "2023-08-19T08:00:00Z",
              location: {
                lat: 41.02031822963801,
                lng: 29.04687657961709,
              },
            },
            end: {
              time: "2023-08-19T17:00:00Z",
              location: {
                lat: 41.02031822963801,
                lng: 29.04687657961709,
              },
            },
          },
        ],
        capacity: [30],
        amount: 3,
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

async function getCustomers() {
  try {
    const response = await fetch("http://localhost:4004/browse/Customers");
    customers = await response.json();
    // console.log("Customers:", customers);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  fillBody();
  // planTour();
}
getCustomers();

function fillBody() {
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
            demand: [customers.value[i].demand],
          },
        ],
      },
    });
  }
  // console.log("body", body);
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
    // localStorage.setItem("tourPlan", JSON.stringify(tourPlan));
    console.log("Optimized Tour Plan:", tourPlan);
  } catch (error) {
    console.error("Error planning tour:", error);
  }
}

let tourPlan = JSON.parse(localStorage.getItem("tourPlan"));
const obj = [];
const stops = [];
for (let i = 0; i < tourPlan.tours.length; i++) {
  stops[i] = tourPlan.tours[i].stops;
}
for (let j = 0; j < stops.length; j++) {
  for (let k = 0; k < stops[j].length; k++) {
    // waypoints[j] = stops[j][k].location;
    obj.push({
      id: j,
      location: {
        lat: stops[j][k].location.lat,
        lng: stops[j][k].location.lng,
      },
    });
  }
}
console.log(obj);
