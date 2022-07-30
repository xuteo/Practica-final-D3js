const width = 800
const height = 500
const margin = {
    top: 10,
    bottom: 40,
    left: 60, 
    right: 10
}

const svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)
const axisGroup =svg.append("g")
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

//set x, y range
let x = d3.scaleLinear().range([0, width - margin.left - margin.right])
let y = d3.scaleBand().range([height - margin.top - margin.bottom, 0]).padding(0.2) 

// axis
const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)

let currentData 
d3.csv("data.csv").then(data => {
        
    data = d3.nest()
            .key(d => d.winner)
            .entries(data)
 
    currentData = data

    // array for scaling y -----
    let paises = []
    let ganador
    for (let i = 0; i < currentData.length; i++) {
        ganador = currentData.map((d,j) => d['values'][0]) 
        paises.push(ganador[i].winner)
    } 
    console.log(paises)
    //--------------------------
    
    // Set x, y domains
    x.domain([0, d3.max(currentData.map((d, i) => d['values']['length']))]) 
    console.log(`d3max para x domain is: ${d3.max(currentData.map((d, i) => d['values']['length']) )}`)  
    y.domain(paises)

    //draw axis
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)



    // Set the atributes of the rectangles
    elementGroup
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
     .attr("class", d => d.key)
     .attr("x", 0)
     .attr("y", d => y(d.key) )// set the attribute  to the value of the funtion 'y' for the iterated element
     .attr("width", d => x(d['values']['length'])) // set the attribute 'width' to the value of the funtion 'x' for the iterated element
     .attr("height", y.bandwidth()) //set the attribute 'height' with the method bandwidth() of bandscale function
})