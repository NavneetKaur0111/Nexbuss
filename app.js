const searchbarInput = document.querySelector('input');
const inputForm = document.querySelector('form');
const streetNameBox = document.querySelector('#street-name');
const streetsResultSection = document.querySelector('.streets');
const schedulebusessection = document.querySelector('tbody');
const baseUrl = 'https://api.winnipegtransit.com/v3/';
const apiKey = 'api-key=2T4MALF1Wx9A3YtpUmKz';

const findRelatedStreets = (name) => {
  return fetch(`${baseUrl}streets.json?${apiKey}&name=${name}&usage=long`)
  .then((data) => data.json());
}

const showRelatedStreets = (name) => {
  findRelatedStreets(name)
    .then(data => data.streets)
    .then((streets) => {
      streetsResultSection.innerHTML="";
      streets.forEach((street) => {
        streetsResultSection.insertAdjacentHTML('beforeend', 
        `<a href="#" data-street-key="${street.key}">${street.name}</a>`)
      })
    });
}

inputForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (event.target.nodeName === 'FORM') {
    showRelatedStreets(searchbarInput.value);
    searchbarInput.value= '';
  };
})