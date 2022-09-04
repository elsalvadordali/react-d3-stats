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
    const [data, setData] = useState<Info[]|null>(null)
    useEffect(() => {
        if (!data) {
        fetch('https://datausa.io/api/data?Geography=04000US39&measure=Average%20Wage,Average%20Wage%20Appx%20MOE,Total%20Population,Total%20Population%20MOE%20Appx,Record%20Count&drilldowns=Gender&Employment%20Time%20Status=1&Detailed%20Occupation=291141,533030,1191XX,537062,434051&Record%20Count>=5&year=latest')
            .then(response => response.json())
            .then(fetched => setData(fetched.data))
        }
    }, [])

    useEffect(() => {
        if (data) {
            const scale = d3.scaleLinear()
            const output = scale(50)
            let a = data.sort((a: Info,b: Info) => a["Detailed Occupation"].localeCompare(b["Detailed Occupation"]))
            let ohio = d3.select('#ohio')
                .append('svg')
                .attr('class', 'hello?')
                .attr('width', 500)
                .attr('height', 500)
            
                ohio.selectAll('rect')
                .data(a)
                .enter()
                .append('rect')
                .attr('y', (d: Info, i: number) => i * 30)
                .attr('x', (d: Info, i: number) => (300 - d['Average Wage'] / 250))
                .attr('fill', (d: Info, i: number) => d.Gender == 'Male' ? '#a0c7fe' : '#dafea4')
                .attr('width', (d: Info, i: number) => (d['Average Wage'] / 250))
                .attr('height', 25)

                ohio.selectAll('text')
                .data(a)
                .enter()
                .append('text')
                .attr('class', 'tooltip')
                .text((d: Info) => d.Gender === 'Male' ? d['Detailed Occupation'] : '')
                //.attr('transform', 'rotate(-90) ')
                .attr('x', 305)
                .attr('fill', '#162802')
                .attr('y', (d: Info, i: number) => 30 + (i * 30))
                .attr('text-align', 'right')


                const xScale = d3.scaleLinear()
                .domain([0, d3.max(data, (d) => d[0])])
                .range([25, 25]);
                const xAxis = d3.axisBottom(xScale);

        }
    }, [data])
    if (data) {
        return <div id='ohio'><h1>Ohio</h1></div>
    } 
    return <h1>Loading...</h1>
    
}

export default Ohio

