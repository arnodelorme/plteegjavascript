
data = 0;
windowSize = 50;
offset = 0;

document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        data = data.data;

    })
    .catch(error => console.error('Error loading the data:', error));
});

function transformData(data, vertOffset, offset, windowSize) {
    const transformed = data.slice(offset, offset + windowSize)
        .map((point, idx) => ({ x: idx + offset, y: point + vertOffset * 50 }));
    return transformed;
}

function plotData(data, offsetTmp = 0, windowSizeTmp = 100) {
    const ctx = document.getElementById('myChart').getContext('2d');

    console.log(data[0][2])

    offset = offsetTmp;
    windowSize = windowSizeTmp;

    // console.log('Transformed Data:', transformedData);

    const datasets = data.map((channelData, index) => ({
        label: `Channel ${index + 1}`,
        data: transformData(channelData, index, offset, windowSize),
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

    document.getElementById('scrollLeft').addEventListener('click', () => {
        const newOffset = Math.max(0, offset - windowSize);
        chart.data.datasets.forEach((dataset, index) => {
            dataset.data = transformData(data[index], newOffset, index, windowSize);
        });
        chart.update();
    });

    document.getElementById('scrollRight').addEventListener('click', () => {
        const newOffset = Math.min(data[0].length - windowSize, offset + windowSize);
        chart.data.datasets.forEach((dataset, index) => {
            dataset.data = transformData(data[index], newOffset, index, windowSize);
        });
        chart.update();
    });

}
