document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        plotData(data.data);
    })
    .catch(error => console.error('Error loading the data:', error));
});

function transformData(data,offset) {
    return data.map((point, index) => ({ x: index, y: point+offset*50 }));
}

function plotData(data) {
    const ctx = document.getElementById('myChart').getContext('2d');

    console.log(data[0][2])

    // console.log('Transformed Data:', transformedData);

    const datasets = data.map((channelData, index) => ({
        label: `Channel ${index + 1}`,
        data: transformData(channelData, index),
        fill: false,
        borderColor: `hsl(50%, 100%, 50%)`,
        borderWidth: 1,
    }));

    console.log('Datasets:', datasets);

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
        	datasets: datasets.map(dataset => ({
            	...dataset,
            	pointRadius: 0 // this hides the points on each dataset
        	}))
    	},
	options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            },
        plugins: { 
            legend: { // Target the legend
                display: false  // Set display to false to hide it
             }
        } 
       }
    });

}
