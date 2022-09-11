import { useEffect, useState } from "react"
import * as d3 from 'd3'
import Data from './Data'
import allStates from '../data/allstates.json';

type Info = {
    "Average Wage": number,
    "Average Wage Appx MOE": number,
    "Detailed Occupation": string,
    "Employment Time Status": string,
    Gender: string,
    Geography: string,
    "ID Detailed Occupation": string,
    "ID Gender": number,
    "ID Geography": string,
    "ID Year": number,
    "Record Count": number,
    "Slug Geography": string,
    "Total Population": number,
    "Total Population MOE Appx": number,
    Year: number
}
type Props = {
    state: string,
    sortBy: string
}

const State = ({ state, sortBy }: Props) => {   
    const STATE_NO_SPACE = state.split(' ').join('') 
    const STATE_ID = allStates.find((iteration) => iteration.name === state) || null
    const [data, setData] = useState<Info[]|null|undefined>(undefined)

    const height = data ? data.length * 60 : 300
    const width = window.innerWidth > 700 ? (window.innerWidth / 2.5) - 10 : window.innerWidth - 60
    //const maxWidth = data && data.sort((a,b) => a['Average Wage'] - b['Average Wage'])[data.length - 1] || {'Average Wage': width}


    useEffect(() => {
        if (!data && STATE_ID) {
        fetch(`https://datausa.io/api/data?Geography=04000US${STATE_ID ? STATE_ID.val : '06'}&measure=Average%20Wage,Average%20Wage%20Appx%20MOE,Total%20Population,Total%20Population%20MOE%20Appx,Record%20Count&drilldowns=Gender&Employment%20Time%20Status=1&Detailed%20Occupation=291141,533030,1191XX,537062,434051&Record%20Count>=5&year=latest`)
            .then(response => response.json())
            .then(fetched => setData(fetched.data))
        } else if (STATE_ID) {
            setData(null)
        }
    }, [])
    
    /**
     * This function sorts data and sets it 
     */
    
    if (data && STATE_ID) {
        return (
        <div className={STATE_NO_SPACE}>
            
            <div id='container'><h1>{state}</h1></div>
            <Data data={data} STATE_NAME={STATE_NO_SPACE} width={width} height={height} sortBy={sortBy} />
            <div className='legend'>
                <div><div className='color blue'></div> <p>Male</p></div>
                <div><div className='color pink'></div> <p>Female</p></div>
            </div>
            
        </div>
        )
    } else if (data === undefined) return <h3>Data corrupted. Please try again</h3>
    return <h1>Loading...</h1>
    
}

export default State