import * as d3 from 'd3';
import * as topojson from 'topojson-client'


const DisplayMap = () => {
  const MAP_URL = '/assets/map.json'

  fetch('/data/world-110m.json')
    .then(date => console.log(date.data))
	console.log(MAP_URL)

  return (
    <div id='main'>
         <svg id="map"></svg>
    </div>
  );
}

export default DisplayMap;