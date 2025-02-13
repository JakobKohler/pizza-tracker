const ctx = document.getElementById('myChart').getContext('2d');
let myChart;

const CHART_COLORS = {
    red: 'rgba(255, 99, 132, 1)',
    blue: 'rgba(54, 162, 235, 1)',
};

function getDatesFromStartToToday() {
    const startDate = new Date("2025-01-01");
    const today = new Date();
    const dates = [];

    while (startDate <= today) {
        dates.push(startDate.toISOString().split('T')[0]);
        startDate.setDate(startDate.getDate() + 1);
    }

    return dates;
}

function calcAccumulations(dataset, labels){
    const sortedDataset = dataset.sort((a, b) => new Date(a.date) - new Date(b.date));
    let mappedData = [];
    let totalCounter = 0;
    let dataSetIndex = 0;

    for(let i=0; i<labels.length; i++){
        let currentEntry = sortedDataset[dataSetIndex];
        if(currentEntry && currentEntry['date'] == labels[i]){
            totalCounter++;
            let dayEntry = {accuCount: totalCounter, pizzas: [currentEntry]}

            if(dataSetIndex < sortedDataset.length - 1){
                dataSetIndex++;
                currentEntry = sortedDataset[dataSetIndex]
            }
            while (dataSetIndex < sortedDataset.length - 1 && currentEntry.date == labels[i]){
                totalCounter++;
                dayEntry.pizzas.push(currentEntry)
                dayEntry.accuCount = totalCounter;
                dataSetIndex++;
                currentEntry = sortedDataset[dataSetIndex]
            }
            mappedData.push(dayEntry);
        }else{
            mappedData.push({accuCount: totalCounter, pizzas: []});
        }
    }
    return mappedData;
}

function createChart(set1, set2){
    const labels = getDatesFromStartToToday();
    const set1Accu = calcAccumulations(set1, labels)
    const set2Accu = calcAccumulations(set2, labels)

    const data = {
        labels: labels,
        datasets: [
          {
            label: 'Schasch',
            data: set1Accu.map(entry => entry['accuCount']),
            borderColor: CHART_COLORS.red,
          },
          {
            label: 'Mani',
            data: set2Accu.map(entry => entry['accuCount']),
            borderColor: CHART_COLORS.blue,
          }
        ]
      };
      const config = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Pizzakonsum von Mani und Schasch'
            }
          }
        },
      };

      myChart = new Chart(ctx, config);
}

async function fetchData() {
    try {
        let response = await fetch('http://localhost:3000/api/v1/pizzaStats/schasch');
        const schaschData = await response.json();
        response = await fetch('http://localhost:3000/api/v1/pizzaStats/mani');
        const maniData = await response.json();

        createChart(schaschData, maniData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();

document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputData = event.target.dataInput.value;
    console.log(inputData);
});

// const labels = data.map(item => item.label);
//         const values = data.map(item => item.value);

//         myChart = new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     label: '# of Votes',
//                     data: values,
//                     backgroundColor: [
//                         'rgba(255, 99, 132, 0.2)',
//                         'rgba(54, 162, 235, 0.2)',
//                         'rgba(255, 206, 86, 0.2)'
//                     ],
//                     borderColor: [
//                         'rgba(255, 99, 132, 1)',
//                         'rgba(54, 162, 235, 1)',
//                         'rgba(255, 206, 86, 1)'
//                     ],
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });