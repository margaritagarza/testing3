function getPlot(id) {

    // get the data from the json file
    d3.json("data/samples.json").then((data) => {
        console.log(data)

        var metadata = data.metadata;

        console.log(metadata)

        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        console.log(result.wfreq)

        // filter sample values
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples);

        // get only top 10 sample values 
        var sampleValues = samples.sample_values.slice(0, 10).reverse();
        // get only top 10 otu ids 
        var idValues = (samples.otu_ids.slice(0, 10)).reverse();
        // get the otu id's to the desired form for the plot
        var idOtu = idValues.map(d => "OTU " + d)
        console.log(`OTU IDS: ${idOtu}`)

        // get the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);

        console.log(`Sample Values: ${sampleValues}`)
        console.log(`Id Values: ${idValues}`)

        // create trace variable for the plot
        var trace = {
            x: sampleValues,
            y: idOtu,
            text: labels,
            type: "bar",
            orientation: "h",
        };

        // create data variable
        var data = [trace];

        // create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTUs",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 30,
                b: 20
            }
        };

        // create the barplot
        Plotly.newPlot("bar", data, layout);

        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,
            },
            text: samples.otu_labels

        };

        // set the layout for the bubble plot
        var layout = {
            xaxis: { title: "OTU ID" },
            height: 500,
            width: 1000
        };

        // create the data variable 
        var data1 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout);

        // normalize the vector
        var level = (result.wfreq)*20 ;

        // Trig to calc meter point
        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
        // Path: may have to change to create a better triangle
        var mainPath = path1,
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data = [{ type: 'scatter',
        x: [0], y:[0],
            marker: {size: 14, color:'850000'},
            showlegend: false,
            name: 'wash frequency',
            text: result.wfreq,
            hoverinfo: 'text'},
        { values: [1,1,1,1,1,1,1,1,1,9],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4','2-3','1-2', '0-1', ''],
        textinfo: 'text',
        textposition:'inside',
        marker: {colors:['rgba(14, 127, 0, .5)','rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)', 'rgba(110, 154, 22, .5)', 
                                'rgba(249, 168, 37, .5)', 'rgba(249, 168, 37, .5)','rgba(249, 168, 37, .5)','rgba(183,28,28, .5)','rgba(183,28,28, .5)',
                                'rgba(0, 0, 0, 0.5)']},
        hoverinfo: 'text',
        hole: .5,
        type: 'pie',
        showlegend: false
        }];

        var layout = {
        title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
            }],
        height: 500,
        width: 450,
        xaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]}
        };

        Plotly.newPlot('gauge', data, layout);
        
    });
}

// create the function to get the necessary data
function getInfo(id) {
    // read the json file to get data
    d3.json("data/samples.json").then((data) => {

        var metadata = data.metadata;
        console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");

        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");


    // read the data 
    d3.json("data/samples.json").then((data) => {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();