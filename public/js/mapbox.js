// register here https://www.mapbox.com/
mapboxgl.accessToken = 'pk.eyJ1IjoicmlyaXJpcmkiLCJhIjoiY2tuenRndHM2MDk1aDJucXNtcTJmdmx1eCJ9.hjnxB56_3K0p3seg4Xpr7Q';

// to get the location in the browser, use :
// navigator.geolocation.getCurrentPosition(pos => console.log(pos.coords));



var mapBoxManager = {
  init: function() {
    this.mapAllLessons = false;
    this.mapSingleLesson = false;
    this.allLessonMapInitialized = false;
    this.singleLessonMapInitialized = false;

    this.initializeMaps();
  },
  initializeMaps: function() {
    var $map_all_lessons = document.getElementById('map_all_lessons');
    var $map_single_lesson = document.getElementById('map_single_lesson');

    if($map_all_lessons) {
      this.mapAllLessons = new mapboxgl.Map({
        container: 'map_all_lessons', // container ID in the HTML
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [13.405, 52.52], // starting position [lng, lat]
        doubleClickZoom: true,
        zoom: 11, // starting zoom
        // pitch: 100
      });

      let nav = new mapboxgl.NavigationControl();
      this.mapAllLessons.addControl(nav, 'top-left');
      this.getAllLessons();
    }  
    if($map_single_lesson){
      this.mapSingleLesson = new mapboxgl.Map({
        container: 'map_single_lesson', // container ID in the HTML
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [13.405, 52.52], // starting position [lng, lat]
        doubleClickZoom: true,
        zoom: 11, // starting zoom
        // pitch: 100
      });

      let nav = new mapboxgl.NavigationControl();
      this.mapSingleLesson.addControl(nav, 'top-left');
    }
  },
  getAllLessons: async function() {
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
  
    this.loadMapAllLessons(lessons);
  },
  loadMapAllLessons: function(lessons) {
    var self = this;
    this.mapAllLessons.on('load', function() {
      self.mapAllLessons.loadImage(
          'https://res.cloudinary.com/du8yg2esj/image/upload/v1619695358/Group_193_n1pmw8.png',
          function (error, image) {
          if (error) throw error;
          // Add the image to the map style.
          self.mapAllLessons.addImage('cat', image);
          });
          self.mapAllLessons.addLayer({
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
};

mapBoxManager.init();
