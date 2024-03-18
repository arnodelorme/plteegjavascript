document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        plotData(data.data);
    })
    .catch(error => console.error('Error loading the data:', error));
});

function transformData(data) {
    return data.map(channel => 
        channel.map(point => ({ x: point[0], y: point[1] }))
    );
}

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
    console.log(datasets);

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

