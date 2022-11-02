import { useEffect, useState } from "react"
import * as d3 from 'd3'
import Data from './Data'
import allStates from '../data/allstates.json';

type Info = {
    "Average Wage": number,
    "Average Wage Appx MOE": number,
    "Detailed Occupation": string,
    "Employment Time Status": string,
    "ID Detailed Occupation": string,
    "Gender": string,
    "ID Gender": number,
    "ID Geography": string,
    "ID Year": number,
    "Record Count": number,
    "Slug Geography": string,
    "Total Population": number,
    "Total Population MOE Appx": number,
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

    useEffect(() => {
        if (!data && STATE_ID) {
        fetch(`https://datausa.io/api/data?Geography=04000US${STATE_ID ? STATE_ID.val : '06'}&measure=Average%20Wage,Average%20Wage%20Appx%20MOE,Total%20Population,Total%20Population%20MOE%20Appx,Record%20Count&drilldowns=Gender&Employment%20Time%20Status=1&Detailed%20Occupation=291141,533030,1191XX,537062,434051&Record%20Count>=5&year=latest`)
            .then(response => response.json())
            .then(fetched => setData(fetched.data))
        } else if (STATE_ID) {
            setData(null)
        }
    }, [])
    
    if (data && STATE_ID) {
        return (
        <div className={STATE_NO_SPACE}>
            <div id='container'><h2>{state}</h2></div>
            <Data data={data} STATE_NAME={STATE_NO_SPACE} sortBy={sortBy} />
            
        </div>
        )
    } else if (data === undefined) return <h3>Data corrupted. Please try again</h3>
    return <h1>Loading...</h1>
    
}

export default State