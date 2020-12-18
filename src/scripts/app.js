const searchbarInput = document.querySelector('input');
const inputForm = document.querySelector('form');
const streetNameBox = document.querySelector('#street-name');
const streetsResultSection = document.querySelector('.streets');
const schedulebusessection = document.querySelector('tbody');
const baseUrl = 'https://api.winnipegtransit.com/v3/';
const apiKey = 'api-key=5VCDsFRAs7Mgh62H8dNp';

const findRelatedStreets = (name) => {
  return fetch(`${baseUrl}streets.json?${apiKey}&name=${name}&usage=long`)
  .then((data) => data.json());
}

const showRelatedStreets = (name) => {
  findRelatedStreets(name)
    .then(data => data.streets)
    .then((streets) => {
      streetsResultSection.innerHTML="";

      if(streets.length !== 0) {
        streets.forEach((street) => {
          streetsResultSection.insertAdjacentHTML('beforeend', 
          `<a href="#" data-street-key="${street.key}">${street.name}</a>`)
        })
      } else {
        streetsResultSection.insertAdjacentHTML('beforeend', 
        `<div class="no-results">No results found</div>`)
      }
    });
}

const getstopsList = (keys) => {
  const stopsList = keys.map((key) => {
    return fetch(`${baseUrl}stops/${key}/schedule.json?${apiKey}&max-results-per-route=2`)
    .then((data) => data.json())
    .then(data => (data['stop-schedule']))
  })
  return stopsList;
}

const findStopKeys = (streetKey) => {
  return fetch(`${baseUrl}stops.json?${apiKey}&street=${streetKey}`)
  .then((data) => data.json())
  .then(data => data.stops)
  .then(stops => {
        stopsKey = stops.map(stop => stop.key)
        return stopsKey;
  });
}

const getScheduleBusesData = (stopsList) => {
  stopsList.forEach(stop => {
    const routes = stop['route-schedules'];

    routes.forEach(route => {
      const nextBuses = route['scheduled-stops'];

      nextBuses.forEach(bus => {
        let arrivalTime = new Date(bus.times.arrival.scheduled);
         const busData = {
          name : stop.stop.street.name,
          crossStName : stop.stop["cross-street"].name,
          direction : stop.stop.direction,
          busId : route.route.key,
          busTime: dayjs(arrivalTime).format('hh:mm A'),
        }
         showScheduleBuses(busData);
      })   
    })


  })
}

const showScheduleBuses = (busData) => {
  schedulebusessection.insertAdjacentHTML('beforeend', 
  `<tr>
  <td>${busData.name}</td>
  <td>${busData.crossStName}</td>
  <td>${busData.direction}</td>
  <td>${busData.busId}</td>
  <td>${busData.busTime}</td>
  </tr>`)
}

const findStopRoutes = (streetKey) => {
  findStopKeys(streetKey)
  .then((stopKeys) => {
    return getstopsList(stopKeys)
  })
  .then((stopsList) => {
    Promise.all(stopsList)
    .then(stopsList => getScheduleBusesData(stopsList));
  })
}

inputForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (event.target.nodeName === 'FORM') {
    streetsResultSection.innerHTML = '';
    schedulebusessection.innerHTML = '';
    showRelatedStreets(searchbarInput.value);
    searchbarInput.value= '';
  };
})

streetsResultSection.addEventListener('click', (event) => {
  if(event.target.nodeName === 'A') {
    streetNameBox.innerHTML = `Displaying results for ${event.target.innerHTML}`
    schedulebusessection.innerHTML = '';
    findStopRoutes(event.target.dataset.streetKey)
  }
})