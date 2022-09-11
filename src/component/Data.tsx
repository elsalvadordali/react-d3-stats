import * as d3 from 'd3'
import { useEffect, useState } from 'react'
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
    data: Info[],
    STATE_NAME: string,
    height: number,
    width: number,
    sortBy: string
}



const Data = ({data, STATE_NAME, height, width, sortBy}: Props) => {
    const [datum, setData] = useState(data)

    useEffect(() => {
        console.log('draw', datum)
        const info = d3.select(`#${STATE_NAME}`)  
            info.selectAll('rect').remove()
            info.selectAll('text').remove()
        draw()
    }, [datum])

    useEffect(() => {
        if (sortBy === 'gender') {
            console.log('g')
            setData([...datum?.sort((a,b) => a['ID Gender'] - b['ID Gender'])])
        } else if (sortBy === 'wage') {
            console.log('w')
            setData([...datum?.sort((a,b) => a['Average Wage'] - b['Average Wage'])])
        } else if (sortBy === 'occupation') {
            console.log('n')
            setData([...datum?.sort((a,b) => a['Detailed Occupation'].localeCompare(b['Detailed Occupation']))])
        }
        
    }, [sortBy])

    function sortWages() {
        
    }

    function findLargest() {
        let largest = 0
        for (let n of datum) {
            if (n['Average Wage'] > largest) largest = n['Average Wage']
        }
        return largest
    }

    const toCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    })
        
    const max = findLargest() 

    function draw() {
        if (datum) {
        const info = d3.select(`#${STATE_NAME}`)  
        
            .attr('width', width)
            .attr('height', 350)
        
            info.selectAll('rect')
            .data(datum)
            .enter()
            .append('rect')
            .attr('y', (d: Info, i: number) => i * 35)
            .attr('x', (d: Info) => width - ((d['Average Wage'] / max * .9) * width) - 30)
            .attr('fill', (d: Info) => d.Gender == 'Male' ? '#7dac66' : '#fcebd6')
            .attr('width', (d: Info) => ((d['Average Wage'] / max * .9) * width) - 30 )
            .attr('height', 30)

            //numbers
            info.selectAll('text.title')
            .data(datum)
            .enter()
            .append('text')
            .attr('class', 'wage')
            .text((d: Info) => toCurrency.format(d['Average Wage']))
            .attr('x', (d: Info, i: number) => width - ((d['Average Wage'] / max * .9) * width) < width - 120 ? width - ((d['Average Wage'] / max * .9) * width) - 25 : width - 150)
            .attr('y', (d: Info, i: number) => 23 + (i * 35))
            .attr('font-size', 24)
            .attr('fill', '#162802')

            //icons
            info.selectAll('text.value')
            .data(datum)
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
                return ''
            })
            .attr('x', width - 60)
            .attr('font-size', 28)
            .attr('y', (d: Info, i: number) => 25 + (i * 35))
            .attr('fill', '#162802')
            
        } else {
            let info = d3.select(`#${STATE_NAME}`)  

            info.selectAll('text.value')
            .text('Try reloading the page')
        }
    }

    return <svg id={STATE_NAME} ></svg>

}

export default Data