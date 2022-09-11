import { geoCentroid } from 'd3-geo';

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from 'react-simple-maps';

import allStates from '../data/allstates.json';

interface Props {
  states: string[],
  addState: (state: string) => void,
  removeState: (index: number) => void

}

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21]
};

const Map = ({states, addState, removeState}: Props) => {
  function nameThatState(selectedState: string) {
    const index = states.indexOf(selectedState) 
    if (index > -1) removeState(index)
    else addState(selectedState)
  }

  return (
    <ComposableMap 
      projection='geoAlbersUsa' 
      width={window.innerWidth } 
      height={window.innerWidth * .6} 
      projectionConfig={{
        scale: window.innerWidth
      }} >
      <Geographies geography={geoUrl}>
        {({ geographies }) => (
          <>
            {geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                stroke='#FFF'
                geography={geo}
                style={{
                  default: {
                    fill: states.includes(geo.properties.name) ? '#bdcddd' : '#dce8d9'
                  },
                  hover: {
                    fill: '#bdcddd' 
                  },
                  pressed: {
                    fill: '#bdcddd'
                  }
                }}
                onClick={() => nameThatState(geo.properties.name)}
              />
            ))}
            {geographies.map(geo => {
              const centroid = geoCentroid(geo);
              const cur = allStates.find(s => s.val === geo.id);
              return (
                <g key={geo.rsmKey + '-name'} onClick={() => nameThatState(geo.properties.name)}
                className={states.includes(geo.properties.name) ? 'color' : 'gray'}
                >
                  {cur &&
                    centroid[0] > -160 &&
                    centroid[0] < -67 &&
                    (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                      <Marker coordinates={centroid}>
                        <text y='2' fontSize={14} textAnchor='middle'>
                          {cur.id}
                        </text>
                      </Marker>
                    ) : (
                      <Annotation
                        subject={centroid}
                        dx={offsets[cur.id][0]}
                        dy={offsets[cur.id][1]}
                      >
                        <text x={4} fontSize={14} alignmentBaseline='middle'>
                          {cur.id}
                        </text>
                      </Annotation>
                    ))}
                </g>
              );
            })}
          </>
        )}
      </Geographies>
    </ComposableMap>
  );
};

export default Map;
