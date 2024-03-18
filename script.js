document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        plotEEGData(data);
    })
    .catch(error => console.error('Error loading the data:', error));
});

function plotEEGData(data) {
    var canvas = document.getElementById('eegCanvas');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var xScale = 10; // Horizontal scale: pixels per data point
    var yScale = 50; // Vertical scale: pixels per value unit

    // Assuming `data` is an array of channels, each with a `name` and `data` property.
    // Adjust plotting logic as necessary.
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
