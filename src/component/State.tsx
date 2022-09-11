import { useEffect, useState } from "react"
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
type Props = {
    state: string,
    sortBy: string
}

const State = ({ state, sortBy }: Props) => {   
    const STATE_NO_SPACE = state.split(' ').join('') 
    const STATE_ID = allStates.find((iteration) => iteration.name === state) || null
    const [data, setData] = useState<Info[]|null|undefined>(undefined)
    useEffect(() => {
        if (!data && STATE_ID) {
        fetch(`https://datausa.io/api/data?Geography=04000US${STATE_ID ? STATE_ID.val : '06'}&measure=Average%20Wage,Average%20Wage%20Appx%20MOE,Total%20Population,Total%20Population%20MOE%20Appx,Record%20Count&drilldowns=Gender&Employment%20Time%20Status=1&Detailed%20Occupation=291141,533030,1191XX,537062,434051&Record%20Count>=5&year=latest`)
            .then(response => response.json())
            .then(fetched => setData(fetched.data))
        } else if (STATE_ID) {
            setData(null)
        }
    }, [])

    useEffect(() => {
        if (data) {
            reDraw()
        }
    }, [data])
    useEffect(() => {
        sortWages()
    }, [sortBy])


    let toCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    })
    function reDraw() {
        const height = data ? data.length * 60 : 300
        const width = window.innerWidth > 700 ? (window.innerWidth / 2.5) - 10 : window.innerWidth
        const maxWidth = data && data.sort((a,b) => a['Average Wage'] - b['Average Wage'])[data.length - 1] || {'Average Wage': width}

        //let a = data.sort((a: Info,b: Info) => a["Detailed Occupation"].localeCompare(b["Detailed Occupation"]))
        if (data) {
        let info = d3.select(`#${STATE_NO_SPACE}`)  
            .attr('width', width)
            .attr('height', height)
        
            info.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('y', (d: Info, i: number) => i * 60)
            .attr('x', (d: Info) => width - ((d['Average Wage'] / (maxWidth['Average Wage']) * .9) * width) - 30)
            .attr('fill', (d: Info) => d.Gender == 'Male' ? '#7dac66' : '#fcebd6')
            .attr('width', (d: Info) => ((d['Average Wage'] / (maxWidth['Average Wage']) * .9) * width) - 30 )
            .attr('height', 55)

            info.selectAll('text.title')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'wage')
            .text((d: Info) => toCurrency.format(d['Average Wage']))
            .attr('x', (d: Info, i: number) => (width - 50) - ((d['Average Wage'] / (maxWidth['Average Wage']) * .9)) * width)
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
                return ''
            })
            .attr('x', width - 60)
            .attr('font-size', 55)
            .attr('y', (d: Info, i: number) => 45 + (i * 60))
            .attr('fill', '#162802')
        } else {
            let info = d3.select(`#${state}`)  

            info.selectAll('text.value')
            .text('Try reloading the page')
        }
    }

    useEffect(() => {
        console.log('newly sorted:')
        console.log(data)
    }, [data])

    /**
     * This function sorts data and sets it 
     */
    function sortWages() {
        console.log('data is', data)
        const destructured = data && [...data]
        if (destructured) destructured.sort((a,b) => a['ID Gender'] - b['ID Gender'])
        else {console.log('what is it', destructured)}
        console.log('sort', destructured)
        setData(destructured)

        /*
        console.log('sorting...', sortBy)
        if (data) {
            if (sortBy === 'occupation') {
                console.log('sort by occ')
                //setData((prev: Info) => [...prev.sort((a,b) => a['Detailed Occupation'].localeCompare(b['Detailed Occupation']))])            
            } else if (sortBy === 'gender') {
                console.log('gendeeeeeer')
                //setData((prev: Info[]) => [...prev.sort((a,b) => a['ID Gender'] - b['ID Gender'])])
            } else if (sortBy === 'wage') {
                console.log('srot by wage')
                setData((prevState: Info[]) => [...prevState])
            }

            
        } */
        let state = d3.select('#state') 
        state.selectAll('rect').remove()
        state.selectAll('text').remove()
        //reDraw()
    }

    if (data && STATE_ID) {
        return (
        <div className={STATE_NO_SPACE}>
            <div id='container'><h1>{state}</h1></div>
            <svg id={STATE_NO_SPACE} ></svg>
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