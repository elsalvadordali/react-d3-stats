import * as d3 from 'd3'
import { useEffect, useState } from 'react'
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
    data: Info[],
    STATE_NAME: string,
    sortBy: string
}

const Data = ({ data, STATE_NAME, sortBy }: Props) => {
    const [datum, setData] = useState(data)
    const [width, setWidth] = useState(window.innerWidth * .9)
    useEffect(() => {
        setWidth(window.innerWidth)
        const info = d3.select(`#${STATE_NAME}`)
        info.selectAll('rect').remove()
        info.selectAll('text').remove()
        draw()
    }, [window.innerWidth])

    useEffect(() => {
        const info = d3.select(`#${STATE_NAME}`)
        info.selectAll('rect').remove()
        info.selectAll('text').remove()
        draw()
    }, [datum])

    useEffect(() => {
        if (sortBy === 'gender-reverse') {
            setData([...datum?.sort((a, b) => b['ID Gender'] - a['ID Gender'])])
        } else if (sortBy === 'occupation-reverse') {
            setData([...datum?.sort((a, b) => b['Detailed Occupation'].localeCompare(a['Detailed Occupation']))])
        } else if (sortBy === 'wage-reverse') {
            setData([...datum?.sort((a, b) => b['Average Wage'] - a['Average Wage'])])
        } else if (sortBy === 'gender') {
            setData([...datum?.sort((a, b) => a['ID Gender'] - b['ID Gender'])])
        } else if (sortBy === 'wage') {
            setData([...datum?.sort((a, b) => a['Average Wage'] - b['Average Wage'])])
        } else if (sortBy === 'occupation') {
            setData([...datum?.sort((a, b) => a['Detailed Occupation'].localeCompare(b['Detailed Occupation']))])
        }

    }, [sortBy])


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

    var tooltip = d3.select(`#${STATE_NAME}`)
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#000")
        .text("a simple tooltip");


    console.log(width, max)
    function draw() {
        if (datum) {
            const info = d3.select(`#${STATE_NAME}`)
                .attr('width', width < 896 ? width - 10 : width * .8)
                .attr('height', 350)

            info.selectAll('rect')
                .data(datum)
                .enter()
                .append('rect')
                .attr('y', (d: Info, i: number) => i * 35)
                .attr('x', (d: Info) => {
                    if (width < 896) return 28
                    return (width / 2)
                })
                .attr('fill', (d: Info) => d.Gender == 'Male' ? '#3d5a80' : '#e2a499')
                .attr('width', (d: Info) => {
                    if (width < 896) return ((d['Average Wage'] / max) * width) - 60
                    return ((d['Average Wage'] / max * ((width / 2.5))))
                })
                .attr('height', 30)

            //numbers
            info.selectAll('text.title')
                .data(datum)
                .enter()
                .append('text')
                .attr('class', 'wage')
                .text((d: Info) => toCurrency.format(d['Average Wage']))
                .attr('x', (d: Info, i: number) => {
                    console.log(((d['Average Wage'] / max * ((width / 2.5)))), (d['Average Wage'].toString().length * 6))
                    if (width < 896) return ((d['Average Wage'] / max) * width) - 60 < (d['Average Wage'].toString().length * 6) ? ((d['Average Wage'] / max) * width) - 30 : (d['Average Wage'] / max) * width - d['Average Wage'].toString().length * 6
                    return ((d['Average Wage'] / max * ((width / 2.5)))) < (d['Average Wage'].toString().length * 6) ? (width / 2) + 20 : (width / 2) + (d['Average Wage'] / max * (width / 2.5)) - (d['Average Wage'].toString().length == 6 ? 120 : 100) + 10
                })
                .attr('y', (d: Info, i: number) => 21 + (i * 35))
                .attr('font-size', width < 896 ? 18 : 24)
                .attr('fill', (d) => d.Gender == 'Male' && ((d['Average Wage'] / max) * width) - 60 > (d['Average Wage'].toString().length * 6) ? '#fff' : '#162802')

            //icons
            info.selectAll('text.value')
                .data(datum)
                .enter()
                .append('text')
                .attr('class', 'occupation')
                .attr('id', (d) => d['Detailed Occupation'])
                .attr("text-anchor", width < 896 ? "start" : "end")
                .text((d: Info) => {
                    if (width < 896) {
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
                    }
                    if (d['Detailed Occupation'].includes('Drive')) return 'Drivers & Sales Workers'
                    if (d['Detailed Occupation'].includes('Labor')) return 'Laborers & freight'
                    return d["Detailed Occupation"]
                })
                .attr('x', width < 895 ? 0 : (width / 2) - 15)
                .attr('font-size', 24)
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