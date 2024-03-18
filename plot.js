
windowSize = 50;
offset = 0;
maxy = 1700;

document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        plotData(data.data);

    })
    .catch(error => console.error('Error loading the data:', error));
});

function transformData(data, vertOffset, offset, windowSize) {
    const transformed = data.slice(offset, offset + windowSize)
        .map((point, idx) => ({ x: idx + offset, y: point + (vertOffset+2) * 50 }));
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
                },
		y: {
			min: 0,
			max: maxy
		}
            },
        plugins: { 
            legend: { // Target the legend
                display: false  // Set display to false to hide it
             }
        },
            animation: {
                duration: 0 // Disable the animation
            }, 
       }
    });

    document.getElementById('scrollLeft').addEventListener('click', () => {
        offset = Math.max(0, offset - windowSize);
        chart.options.scales.x.min = offset;
        chart.options.scales.x.max = offset+windowSize;
        chart.options.scales.y.min = 0;
        chart.options.scales.y.max = maxy;
	console.log(offset);
        chart.data.datasets.forEach((dataset, index) => {
            dataset.data = transformData(data[index], index, offset, windowSize);
        });
        chart.update();
    });

    document.getElementById('scrollRight').addEventListener('click', () => {
        offset = Math.min(data[0].length - windowSize, offset + windowSize);
        chart.options.scales.x.min = offset;
        chart.options.scales.x.max = offset+windowSize;
        chart.options.scales.y.min = 0;
        chart.options.scales.y.max = maxy;
	console.log(offset);
        chart.data.datasets.forEach((dataset, index) => {
            dataset.data = transformData(data[index], index, offset, windowSize);
        });
        chart.update();
    });

}
