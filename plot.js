
windowSize = 50;
offset = 0;
maxy = 1700;
increment = 10;

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

    const verticalLinePlugin = {
      id: 'verticalLine',
      afterDatasetsDraw(chart, args, options) {
        const { ctx, chartArea: { left, right, top, bottom }, scales: { x, y } } = chart;
        const xValues = [10,50, 100]; // The x-value at which to draw the line
        const lineColors = ['blue', 'green', 'red'];

        xValues.forEach((xValue,index) => {
            if (xValue >= x.min && xValue <= x.max) {
                const xPixel = x.getPixelForValue(xValue);

                ctx.beginPath();
                ctx.moveTo(xPixel, top);
                ctx.lineTo(xPixel, bottom);
                ctx.strokeStyle = lineColors[index]; //'rgba(255, 1, 1, 1)'; // Set the line color and opacity
                ctx.stroke();
            }
        });

      }
    };

    const textAnnotationPlugin = {
      id: 'textAnnotation',
      afterDatasetsDraw(chart, args, options) {
        const { ctx, chartArea: { left, right, top, bottom }, scales: { x, y } } = chart;
        const annotations = [
            { x: 10, y: maxy, text: 'Event 1' },
            { x: 50, y: maxy, text: 'Event 2' },
            { x: 100, y: maxy, text: 'Event 3' },
        ];

        ctx.font = '12px Arial'; // Set the font for the annotations
        ctx.fillStyle = 'black'; // Set the text color
        annotations.forEach(annotation => {
            const xPixel = x.getPixelForValue(annotation.x);
            const yPixel = y.getPixelForValue(annotation.y);

            if (xPixel >= left && xPixel <= right && yPixel >= top && yPixel <= bottom) {
                ctx.fillText(annotation.text, xPixel, yPixel);
            }
        });
      }
    };

    Chart.register(verticalLinePlugin);
    Chart.register(textAnnotationPlugin);

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
             },
        },
            animation: {
                duration: 0 // Disable the animation
            }, 
       }
    });

    document.getElementById('scrollLeft').addEventListener('click', () => {
        offset = Math.max(0, offset - increment);
        chart.options.scales.x.min = offset;
        chart.options.scales.x.max = offset+windowSize;
        chart.options.scales.y.min = 0;
        chart.options.scales.y.max = maxy;
	console.log(offset);
        chart.data.datasets.forEach((dataset, index) => {
            dataset.data = transformData(data[index], index, offset, windowSize);
	    dataset.borderColor = 'black';
        });
        chart.update();
    });

    document.getElementById('scrollRight').addEventListener('click', () => {
        offset = Math.min(data[0].length - windowSize, offset + increment);
        chart.options.scales.x.min = offset;
        chart.options.scales.x.max = offset+windowSize;
        chart.options.scales.y.min = 0;
        chart.options.scales.y.max = maxy;
	console.log(offset);
        chart.data.datasets.forEach((dataset, index) => {
            dataset.data = transformData(data[index], index, offset, windowSize);
            dataset.borderColor = 'black';
        });
        chart.update();
    });

}
