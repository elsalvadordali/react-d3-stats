import { useEffect, useMemo, useState } from "react"
import * as d3 from 'd3'
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

const State = ({state}) => {

    const STATE_ID = allStates.find((iteration) => iteration.name === state) || null
    console.log(STATE_ID)
    const [data, setData] = useState<Info[]|null|undefined>(null)
    const [dropdown, setDropdown] = useState<string>('open')
    useEffect(() => {
        if (!data) {
        fetch(`https://datausa.io/api/data?Geography=04000US${STATE_ID.val}&measure=Average%20Wage,Average%20Wage%20Appx%20MOE,Total%20Population,Total%20Population%20MOE%20Appx,Record%20Count&drilldowns=Gender&Employment%20Time%20Status=1&Detailed%20Occupation=291141,533030,1191XX,537062,434051&Record%20Count>=5&year=latest`)
            .then(response => response.json())
            .then(fetched => setData(fetched.data))
        }
    }, [])

    useEffect(() => {
        if (data) {
            reDraw()
        }
    }, [data])

    let toCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    })
    console.log(toCurrency.format(500))
    function reDraw() {
        console.log(data)
        const scale = d3.scaleLinear()
        //const output = scale(50)
        
        const height = data ? data.length * 60 : 300
        const width = window.innerWidth > 700 ? (window.innerWidth / 2) - 10 : window.innerWidth - 30
        const maxWidth = data && data.sort((a,b) => a['Average Wage'] - b['Average Wage'])[data.length - 1] || {'Average Wage': width}

        console.log(maxWidth, 'max')

        //let a = data.sort((a: Info,b: Info) => a["Detailed Occupation"].localeCompare(b["Detailed Occupation"]))
        let info = d3.select(`#${state}`)  
            .attr('class', 'hello?')
            .attr('width', width)
            .attr('height', height)
        
            info.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('y', (d: Info, i: number) => i * 60)
            .attr('x', (d: Info) => width - ((d['Average Wage'] / (maxWidth['Average Wage']) * .9) * width) - 30)
            .attr('fill', (d: Info) => d.Gender == 'Male' ? '#a0c7fe' : '#dafea4')
            .attr('width', (d: Info) => ((d['Average Wage'] / (maxWidth['Average Wage']) * .9) * width) - 30 )
            .attr('height', 55)
            info.selectAll('text.title')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'wage')
          
            .text((d: Info) => toCurrency.format(d['Average Wage']))
            .attr('x', (d: Info, i: number) => width - ((d['Average Wage'] / (maxWidth['Average Wage']) * .9)) * width - 20)
            .attr('y', (d: Info, i: number) => 35 + (i * 60))
            .attr('font-size', 24)
            .attr('fill', '#162802')

            
            info.selectAll('text.value')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'occupation')
            .text((d: Info) => {
                if (d['Detailed Occupation'].includes('nurs') && d['Gender'] === 'Female') return '👩‍⚕️'
                else if (d['Detailed Occupation'].includes('nurs') && d['Gender'] === 'Male') return '👨‍⚕️'
                else if (d['Detailed Occupation'].includes('manager') && d['Gender'] === 'Male') return '👨‍💼' 
                else if (d['Detailed Occupation'].includes('manager') && d['Gender'] === 'Female') return '👩‍💼' 
                else if (d['Detailed Occupation'].includes('Labor') && d['Gender'] === 'Male') return '👷‍♂️' 
                else if (d['Detailed Occupation'].includes('Labor') && d['Gender'] === 'Female') return '👷‍♀️' 
                else if (d['Detailed Occupation'].includes('represent') && d['Gender'] === 'Female') return '🤵‍♀️'
                else if (d['Detailed Occupation'].includes('represent') && d['Gender'] === 'Male') return '🤵‍♂️'
                else if (d['Detailed Occupation'].includes('driver')) return '🚚'
           
            })
            .attr('x', width - 60)
            .attr('font-size', 55)
            .attr('y', (d: Info, i: number) => 45 + (i * 60))
            .attr('fill', '#162802')
            
    }

    function sortBy(measure: string) {
        if (data) {
            if (measure === 'occupation') setData((prev: Info[]) => [... prev?.sort((a,b) => a['Detailed Occupation'].localeCompare(b['Detailed Occupation']))])
            else if (measure === 'wage') setData((prev: Info[]) => [...prev?.sort((a,b) => a['Average Wage'] - b['Average Wage'])])
            else if (measure === 'gender') setData((prev: Info[]) => [... prev?.sort((a,b) => a['ID Gender'] - b['ID Gender'])] || null)
        }
        let state = d3.select('#state') 
        state.selectAll('rect').remove()
        state.selectAll('text').remove()
        //reDraw()
    }

    if (data && STATE_ID) {
        return (
        <div className={state}>
            <div id='container'><h1>{state}</h1></div>
            <svg id={state} ></svg>
            <div className='legend'>
                <div><div className='color blue'></div> <p>Male</p></div>
                <div><div className='color green'></div> <p>Female</p></div>
            </div>
            <div onClick={() => setDropdown(dropdown === 'close' ? 'open' : 'close')} className={dropdown}>
                <h6>{dropdown}</h6>
                <div>
                    <button onClick={() => sortBy('occupation')}>by Occupation</button>
                    <button onClick={() => sortBy('wage')}>by Wage</button>
                    <button onClick={() => sortBy('gender')}>by Gender</button>
                </div>
            </div>
        </div>
        )
    } 
    return <h1>Loading...</h1>
    
}

export default State