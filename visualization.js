



var svg = d3.select("#map")
        .append("svg")
        .attr("height", 500)
        .attr("width", 1500)





var projection = d3.geoAlbersUsa();

var path = d3.geoPath().projection(projection);
var fipsToVotes = {};
var tempContainer = svg.append("g")

var mouseOverContainer = svg.append("g")



function zoomed(event) {
    const {transform} = event;
    tempContainer.attr("transform", transform);
    tempContainer.attr("stroke-width", 1 / transform.k);
    }


var zoom = d3.zoom()

        .scaleExtent([1,5])
        .on('zoom', zoomed)

svg.call(zoom)







var demColor = d3.scaleThreshold().domain([1,1.3,1.5,1.7,2]).range(["#4d4dff", "#1a1aff", "#0000e6", "#003399", "#001133" ]);
var repColor = d3.scaleThreshold().domain([1,1.3,1.5,1.7,2]).range(["#ffb3b3", "#ff6666", "#ff1a1a", "#cc0000", "#8b0000" ]);

var mine = d3.select("svg")



async function test() {
    
    j =   await d3.csv("https://raw.githubusercontent.com/MEDSL/2018-elections-unoffical/master/election-context-2018.csv").then(
    function(data) {
 
         
        data.forEach(function(d) {
            //console.log(d.clinton16)
             if(d.fips == 46113) {
                fipsToVotes[46102] = [d.clinton16, d.trump16, d.county, d.state];
            
            } 
            else if (d.fips.length > 4) {
            fipsToVotes[d.fips] = [d.clinton16, d.trump16, d.county, d.state];
            } else {
                fipsToVotes["0" + d.fips] = [d.clinton16, d.trump16, d.county, d.state];

            }

        })


    });

    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json").then(
    function(data) {
        //console.log(data.objects.counties.geometries[0].properties.name)

        var states = topojson.feature(data, data.objects.counties).features

        //console.log(states)
        tempContainer.selectAll(".states")
            .data(states)
            .enter()
            .append("path")
            //.datum(groupData)
            .attr("class" , "states")
            .attr("d", path)
            .attr("fill", function(data) {
                var temp = fipsToVotes[data.id]
            if (temp != undefined) {
                var groupData = data.id
                d3.select(this).datum(groupData)
                //console.log(temp[0])
                tempa = fipsToVotes[data.id][0]
                var tempb = fipsToVotes[data.id][1]
                if (Number(tempa) >= Number(tempb)) {

                    var first = Number(tempa) / Number(tempb)


                    return demColor(first)

                } else if (Number(fipsToVotes[data.id][0]) < Number(fipsToVotes[data.id][1])) {
                    var tempa1 = fipsToVotes[data.id][0]
                    var tempb2 = fipsToVotes[data.id][1]
                    var first = Number(tempb2) / Number(tempa1)

                    return repColor(first)
  
                } 
            }

                return "#ffffff"
            }).attr("opacity", 1)
            .on("mouseover", function(data, index) {
                console.log(data)
                //console.log(d3.select(this).datum())

                var xVar = event.clientX
                var yVar = event.clientY
                d3.select(this).style("stroke", "black")

                
                mouseOverContainer.append("rect")
                    .attr("class", "dataBoxes")
                    .attr("x", xVar + 10)
                    .attr("y", yVar - 40)
                    .attr("width", 220)
                    .attr("height", 60)
                    .attr("opacity", .8)
                   

                    
                //set up chart ability
                var indivisualData = [{index: "clinton16",
                                        result: fipsToVotes[index][0]
                                    },
                                    {index: "trump16",
                                        result: fipsToVotes[index][1]
                                    }          
                                ]

                    console.log(indivisualData)            
                    console.log(d3.max(indivisualData, function(f) {return Number(f.result)}))                                
                var x = d3.scaleLinear().domain([0, d3.max(indivisualData.map(s => Number(s.result)))]).range([0, 158])
                var y = d3.scaleBand()
                    .range([ yVar - 40 , yVar ])
                    .domain(indivisualData.map(function(d) { return d.index; }))
                    .padding(.2);


                    mouseOverContainer.selectAll("myRect")
                    .data(indivisualData)
                    .enter()
                    .append("rect")
                    .attr("class", "barChart")
                    .attr("x", xVar + 10)
                    .attr("y", function(d) { return y(d.index) + 17; })
                    .attr("height", y.bandwidth() )
                    .transition()
                    .duration(750)
                    .attr("width", function(d) { return x(Number(d.result)); })
                    .attr("fill", function (f) {
                        console.log(f)
                        if (f.index == "clinton16") {
                            return "#1a53ff"
                        }
                        return "#cc0000" 
                    })


                    mouseOverContainer.append("text").attr("class" , "val")
                    .attr("x", function() { return xVar + 12 })
                    .attr("y", function() { return yVar - 25})
                    .text(function() {
            
                        return fipsToVotes[index][2] + " County, " + fipsToVotes[index][3]
                
                
                    }).attr("fill", function() {
                        if (Number(fipsToVotes[index][0]) >= Number(fipsToVotes[index][1])) {
                            return "#ffffff"
                        }

                        return "#ffffff" 
                    } )
                    .attr("opacity", 0)
                    .transition()
                    .duration(750)
                    .attr("opacity", 1)


                    mouseOverContainer.append("text").attr("class" , "val")
                    .attr("x", function() { return xVar + 10 })
                    .attr("y", function() { return yVar  - 8})
                    .text(function() {
            
                        return fipsToVotes[index][0]
                
                
                    }).attr("fill", "#1a53ff" )
                    .attr("opacity", 0)
                    .transition()
                    .duration(750)
                    .attr("x", xVar + 15 +  x(fipsToVotes[index][0]))
                    .attr("opacity", 1)
                    mouseOverContainer.append("text").attr("class" , "val")
                    .attr("x", function() { return xVar + 10 })
                    .attr("y", function() { return yVar  +12})
                    .text(function() {
            
                        return fipsToVotes[index][1]
                
                
                    }).attr("fill","#cc0000" )
                    .attr("opacity", 0)
                    .transition()
                    .duration(750)
                    .attr("x", xVar + 15 +  x(fipsToVotes[index][1]))
                    .attr("opacity", 1)
            }).on("mouseout", function(d) {
                                d3.select(this).style("stroke", "none")

  
                mouseOverContainer.selectAll("rect").remove()
                mouseOverContainer.selectAll("text").remove()

            })
        }
    );
}


test();


 



