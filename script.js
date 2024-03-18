document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        plotEEGData(data);
    })
    .catch(error => console.error('Error loading the data:', error));
});


function plotData(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const transformedData = transformData(data);
    const datasets = transformedData.map((channelData, index) => ({
        label: `Channel ${index + 1}`,
        data: channelData,
        fill: false,
        borderColor: `hsl(${(index / 32) * 360}, 100%, 50%)`, // Color variation for each channel
        borderWidth: 1,
    }));

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    });
}

function plotEEGData(data) {
    var canvas = document.getElementById('eegCanvas');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var xScale = 10; // Horizontal scale: pixels per data point
    var yScale = 50; // Vertical scale: pixels per value unit

    // Assuming `data` is an array of channels, each with a `name` and `data` property.
    // Adjust plotting logic as necessary.
    console.log('Data is not an array or object:', data);
    data = data.data;
    data.forEach(function(channel, index) {
        var yOffset = (index + 1) * 100;
        ctx.beginPath();
        for (var i = 0; i < channel.data.length; i++) {
            var x = i * xScale;
            var y = yOffset - (channel.data[i] * yScale);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    });
}
