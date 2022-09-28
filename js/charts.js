function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("js/samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
// Initialize the dashboard
init();
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);  
}
// Demographics Panel 
function buildMetadata(sample) {
  d3.json("js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}
// 1. Create the buildCharts function. function contains the argument sample, which is the sample selected from the dropdown menu
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file. Code to retrieve the samples.json file using the d3.json().then() method.
  d3.json("js/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. create a variable that has the array for all the samples 
  let samples = data.samples; 
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    //create a variable that will hold an array that contains all the data from the new sample that is chosen from the dropdown menu. 
    //To retrieve the data from the new sample, filter the variable created in Step 3 for the sample id that matches the new sample id 
    //chosen from the dropdown menu and passed into the buildCharts() function as the argument.
  let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    //  create a variable that holds the first sample in the array.
  let result = resultArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // create variables that have arrays for otu_ids, otu_labels, and sample_values.
  let otuIds = result.otu_ids;
  let otuLabels = result.otu_labels;
  let sampleValues = result.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // create the yticks for the bar chart
    //---var yticks = 
  let yticks = otuIds.slice(0,10).reverse().map(entry => 'OTU ' + String(entry));
    // 8. Create the trace for the bar chart. 
    // create the trace object for the bar chart, where the x values are the sample_values and the hover text for the bars are the otu_labels in descending order.
    //---var barData = [
      let barData = [{
        name: `ID: ${sample}`,
        type: "bar",
        orientation: "h",
        x: sampleValues.slice(0,10).reverse(),
        y: yticks,
        text : otuLabels.slice(0,10).reverse(),
        xname: "Bacterial Species",
        yname: "Sample value"
      }];
    console.log(barData); 
    // 9. Create the layout for the bar chart.
    //create the layout for the bar chart that includes a title. 
    //---var barLayout = {
      let barLayout = {
        title: {
          text: "Top 10 Bacteria Cultures Found",
          font: {
            size: 22
          }
        },
        paper_bgcolor : "transparent",
        plot_bgcolor : "transparent",
        autosize : true
      };
    // 10. Use Plotly to plot the data with the layout.
    //use the Plotly.newPlot() function to plot the trace object with the layout. 
    Plotly.newPlot("bar",barData,barLayout);


//////////////////////////////////////////////////////////
// Bubble Chart
    // 1. Trace Object
    var bubbleInput = [{
      mode: "markers",
      
      // Axis
      x: otuIds,
      y: sampleValues,
      
      marker: {
        //marker size
        size: sampleValues,
        //marker color
        color: otuIds,
      },
      //hover text
      text: otuLabels
    }];

    // 2. Layout
    var bubbleLayout = {
      title: {
        text: "Bacteria Cultures Per sample",
        font: {
          size: 22
        }
      },
      xaxis: {
        title: "OTU ID"
      },
      margins: {
        b: 10,
        t: 10,
        l: 10,
        r: 10
      },
      autosize : true
    };

    // 3. Plotly call
    Plotly.newPlot("bubble",bubbleInput,bubbleLayout); 



    //////////////////////////////////////////////////////////////////////////
   // Gauge Chart Washing frequency
 
//1. create a variable that filters the metadata array for an object in the array whose id property matches the ID number passed into buildCharts() function as the argument.
    let washingFrequency = data.metadata.filter(sampleId => sampleId.id == sample)
    //1a. convert washing frequency to a floating point number
    let floatWashingFrequency = parseFloat(washingFrequency[0].wfreq);
//2. create a variable that holds the first sample in the array created in Step 2.
    var gaugeInput = [
    {
    type: "indicator",
    mode: "gauge+number",
    value: floatWashingFrequency,
    title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},

    gauge: {
      axis: { range: [null, 10], tickwidth: 1, tickcolor: "black", dtick: 2},
      bar: { color: "black" },
      bgcolor: "white",
      borderwidth: 1,
      bordercolor: "black",
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "yellowgreen" },
        { range: [8, 10], color: "green" }
      ],
      }
    }
  ];
    var gaugeLayout = { 
        margin: { t: 0, b: 0 },
        autosize : true
};
// 4. use the Plotly.newPlot() function to plot the trace object and the layout
    Plotly.newPlot("gauge",gaugeInput,gaugeLayout);
  });



}