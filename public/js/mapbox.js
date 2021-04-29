// register here https://www.mapbox.com/
mapboxgl.accessToken = 'pk.eyJ1IjoicmlyaXJpcmkiLCJhIjoiY2tuenRndHM2MDk1aDJucXNtcTJmdmx1eCJ9.hjnxB56_3K0p3seg4Xpr7Q';

// to get the location in the browser, use :
// navigator.geolocation.getCurrentPosition(pos => console.log(pos.coords));

const map = new mapboxgl.Map({
    container: 'map', // container ID in the HTML
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [13.405, 52.52], // starting position [lng, lat]
    doubleClickZoom: true,
    zoom: 11, // starting zoom
    // pitch: 100
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');

// Fetch lessons from API
async function getLessons() {
    const res = await fetch('/api/v1/lessons');
    const data = await res.json();

    console.log(data);
  
    const lessons = data.data.map(lesson => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            lesson.location.coordinates[0],
            lesson.location.coordinates[1]
          ]
        },
        properties: {
          name: lesson.name
        }
      };
    });
  
    loadMap(lessons);
  }





// Load map with lessoms
function loadMap(lessons) {
    map.on('load', function() {
      map.loadImage(
        'https://res.cloudinary.com/du8yg2esj/image/upload/v1619695358/Group_193_n1pmw8.png',
        function (error, image) {
        if (error) throw error;
        // Add the image to the map style.
        map.addImage('cat', image);
        });
      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: lessons
          }
        },
        layout: {
          'icon-image': 'cat',
          'icon-size': 0.1,
          'text-field': '{name}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.9],
          'text-anchor': 'top'
        },
        paint: {
          "text-color": "#464461"
        }
      });
    });
  }

getLessons();










/////////////////Jan-Ironhack Lecture///////////////////////////////////////

// // setting a popup
// const popup = new mapboxgl.Popup({
//     closeButton: true
// })
// /*
// popup.setLngLat([13.405, 52.52])
//     .setHTML('<h1>Hello Mapbox</h1>')
//     .setMaxWidth('400px')
//     .addTo(map)
// */

// let coords = [
//     [13.405, 52.52],
//     [13.6, 52.6]
// ]

// coords.forEach(coord => {
//     new mapboxgl.Marker({
//         color: 'red',
//         draggable: true
//     })
//         .setLngLat(coord)
//         .addTo(map)
//         .on('dragend', data => {
//             console.log(data)
//         })
// })

// const addMarker = event => {
//     new mapboxgl.Marker({
//         color: 'yellow',
//         draggable: true
//     })
//         .setLngLat(event.lngLat)
//         .addTo(map)
// }

// // map.on('click', (event) => console.log('these are the coords', event.lngLat));
// // map.on('click', addMarker)

// // const marker = new mapboxgl.Marker({
// //     color: 'red'
// // })
// //     .setLngLat([13.405, 52.52])
// //     .addTo(map)

// // Get places from API

// async function getPlaces() {
//     const res = await fetch('/api');
//     const data = await res.json();

//     let places = data.data.map(place => (
//         {
//             type: 'Feature',
//             geometry: {
//                 type: 'Point',
//                 coordinates: [place.location.coordinates[0], place.location.coordinates[1]]
//             },
//             properties: {
//                 city: place.location.city
//             }
//         }
//     ));

//     return places;
// };

// // Show places on map
// async function showMap() {
//     let places = await getPlaces();

//     map.on('load', () => {

//         map.addSource('api', {
//             type: 'geojson',
//             data: {
//                 type: 'FeatureCollection',
//                 features: places
//             }
//         });

//         map.addLayer({
//             id: 'points',
//             type: 'symbol',
//             minzoom: 0,
//             source: 'api',
//             layout: {
//                 'icon-image': 'marker-15',
//                 'icon-allow-overlap': true,
//                 'text-allow-overlap': true,
//                 'icon-size': 2,
//                 'text-field': '{city}',
//                 'text-offset': [0, 0.9],
//                 'text-anchor': 'top'
//             },
//             paint: {
//                 "text-color": "#00d1b2",
//             },
//         });

//     });
// };

// // Handle user input
// const form = document.getElementById('form');
// const place = document.getElementById('place');

// function handleChange() {
//     if (place.value === '') {
//         place.style.border = '3px solid lightcoral';
//     } else {
//         place.style.border = 'none';
//     }
// }

// // Send POST to API to add place
// async function addPlace(e) {
//     e.preventDefault();

//     if (place.value === '') {
//         place.placeholder = 'Please fill in an address';
//         return;
//     }

//     const sendBody = {
//         address: place.value
//     };

//     try {
//         place.value = '';
//         place.placeholder = 'Loading...';

//         const res = await fetch('/api', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(sendBody)
//         });

//         if (res.status === 400) {
//             throw Error;
//         }
        
//         if (res.status === 200) {
//             place.style.border = 'none';
//             place.placeholder = 'Succesfully added!';
            
//             // Retrieve updated data
//             places = await getPlaces();

//             map.getSource('api').setData({
//                 type: 'FeatureCollection',
//                 features: places
//             });
//         }
//     } catch (err) {
//         place.placeholder = err;
//         return;
//     }
// };

// place.addEventListener('keyup', handleChange);
// form.addEventListener('submit', addPlace);

// // Render places
// showMap();