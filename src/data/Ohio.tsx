import { useEffect, useMemo, useState } from "react"
import * as d3 from 'd3'

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

const Ohio = () => {
    const [data, setData] = useState<Info[]|null|undefined>(null)
    const [dropdown, setDropdown] = useState<string>('open')
    useEffect(() => {
        if (!data) {
        fetch('https://datausa.io/api/data?Geography=04000US39&measure=Average%20Wage,Average%20Wage%20Appx%20MOE,Total%20Population,Total%20Population%20MOE%20Appx,Record%20Count&drilldowns=Gender&Employment%20Time%20Status=1&Detailed%20Occupation=291141,533030,1191XX,537062,434051&Record%20Count>=5&year=latest')
            .then(response => response.json())
            .then(fetched => setData(fetched.data))
        }
    }, [])

    useEffect(() => {
        if (data) {
            reDraw()
        }
    }, [data])

    function reDraw() {
        console.log(data)
        const scale = d3.scaleLinear()
        const output = scale(50)

        const height = data.length * 30

        //let a = data.sort((a: Info,b: Info) => a["Detailed Occupation"].localeCompare(b["Detailed Occupation"]))
        let ohio = d3.select('#ohio')  
            .attr('class', 'hello?')
            .attr('width', 700)
            .attr('height', height)
        
            ohio.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('y', (d: Info, i: number) => i * 30)
            .attr('x', (d: Info, i: number) => (380 - d['Average Wage'] / 250))
            .attr('fill', (d: Info, i: number) => d.Gender == 'Male' ? '#a0c7fe' : '#dafea4')
            .attr('width', (d: Info, i: number) => (d['Average Wage'] / 250))
            .attr('height', 25)

            ohio.selectAll('text.title')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'wage')
            .text((d: Info) => d['Average Wage'].toFixed(0))
            .attr('x', (d: Info, i: number) => 330 - d['Average Wage'] / 250)
            .attr('y', (d: Info, i: number) => 18 + (i * 30))
            .attr('fill', '#162802')

            ohio.selectAll('text.value')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'occupation')
            .text((d: Info) => d['Detailed Occupation'])
            .attr('x', 385)
            .attr('y', (d: Info, i: number) => 20 + (i * 30))
            .attr('fill', '#162802')


    }

    function sortBy(measure: string) {
        if (measure === 'occupation') setData((prev: Info[]) => [... prev?.sort((a,b) => a['Detailed Occupation'].localeCompare(b['Detailed Occupation']))])
        else if (measure === 'wage') setData((prev: Info[]) => [...prev?.sort((a,b) => a['Average Wage'] - b['Average Wage'])])
        else if (measure === 'gender') setData((prev: Info[]) => [... prev?.sort((a,b) => a['ID Gender'] - b['ID Gender'])])
        let ohio = d3.select('#ohio') 
        ohio.selectAll('rect').remove()
        ohio.selectAll('text').remove()
        //reDraw()
    }

    if (data) {
        return <><div id='container'><h1>Ohio</h1></div>
        <svg id='ohio' ></svg>
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
        </>
    } 
    return <h1>Loading...</h1>
    
}

export default Ohio

