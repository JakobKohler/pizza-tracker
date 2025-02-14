const ctx = document.getElementById("lineChartMain").getContext("2d");
const ctxPie1 = document.getElementById("pieChart1").getContext("2d");
const ctxPie2 = document.getElementById("pieChart2").getContext("2d");
let lineChartMain;

const CHART_COLORS = {
  red: "rgba(255, 99, 132, 1)",
  blue: "rgba(54, 162, 235, 1)",
  green: "rgba(75, 192, 192, 1)",
  yellow: "rgba(255, 205, 86, 1)",
  purple: "rgba(153, 102, 255, 1)",
  orange: "rgba(255, 159, 64, 1)",
  pink: "rgba(255, 192, 203, 1)",
  teal: "rgba(0, 128, 128, 1)",
  navy: "rgba(0, 0, 128, 1)",
  lime: "rgba(0, 255, 0, 1)",
  maroon: "rgba(128, 0, 0, 1)",
  olive: "rgba(128, 128, 0, 1)",
  gray: "rgba(128, 128, 128, 1)",
  coral: "rgba(255, 127, 80, 1)",
  gold: "rgba(255, 215, 0, 1)",
};

function getDatesFromStartToToday() {
  const startDate = new Date("2025-01-01");
  const today = new Date();
  const dates = [];

  while (startDate <= today) {
    dates.push(startDate.toISOString().split("T")[0]);
    startDate.setDate(startDate.getDate() + 1);
  }

  return dates;
}

const pizzaInfo = (tooltipItem) => {
  const dataPoint = tooltipItem.raw;
  let tooltipText = '';
  if(dataPoint.pizzaList.length > 1){
    ids = dataPoint.pizzaList.map(entry => entry.id)
    tooltipText = `IDs: ${ids.join(', ')}, Mehrere Pizzas`
  }else if(dataPoint.pizzaList.length <= 0){
    tooltipText = `Keine Pizza`
  }else{
    tooltipText = `ID: ${dataPoint.pizzaList[0].id}, ${dataPoint.pizzaList[0].variety}`;
  }
  return `${tooltipText}`;
}

function calcAccumulations(dataset, labels) {
  const sortedDataset = dataset.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  let mappedData = [];
  let totalCounter = 0;
  let dataSetIndex = 0;

  for (let i = 0; i < labels.length; i++) {
    let currentEntry = sortedDataset[dataSetIndex];
    if (currentEntry && currentEntry["date"] == labels[i]) {
      totalCounter++;
      let dayEntry = {timestamp: labels[i], accuCount: totalCounter, pizzas: [currentEntry] };
      while (
        dataSetIndex < sortedDataset.length - 1 &&
        sortedDataset[dataSetIndex + 1].date == labels[i]
      ) {
        dataSetIndex++;
        currentEntry = sortedDataset[dataSetIndex];
        totalCounter++;
        dayEntry.pizzas.push(currentEntry);
        dayEntry.accuCount = totalCounter;
      }
      mappedData.push(dayEntry);
      dataSetIndex++;
    } else {
      mappedData.push({timestamp: labels[i], accuCount: totalCounter, pizzas: [] });
    }
  }
  return mappedData;
}

function createLineChart(set1, set2) {
  const labels = getDatesFromStartToToday();
  const set1Accu = calcAccumulations(set1, labels);
  const set2Accu = calcAccumulations(set2, labels);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Schasch",
        data: set1Accu.map((entry) => ({ x: entry.timestamp, y: entry.accuCount, pizzaList: entry.pizzas })),
        borderColor: CHART_COLORS.red,
      },
      {
        label: "Mani",
        data: set2Accu.map((entry) => ({ x: entry.timestamp, y: entry.accuCount, pizzaList: entry.pizzas })),
        borderColor: CHART_COLORS.blue,
      },
    ],
  };
  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: pizzaInfo,
          }
        },
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Pizzakonsum von Mani und Schasch",
        },
      },
    },
  };

  lineChartMain = new Chart(ctx, config);
}

async function createPieChart(dataset, ctx) {
  const varieties = dataset.map((entry) => entry["variety"]);
  const countMap = varieties.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(countMap);
  const values = Object.values(countMap);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: Object.values(CHART_COLORS).splice(2),
      },
    ],
  };

  const config = {
    type: "pie",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
          text: "Pizzasorten",
        },
      },
    },
  };

  new Chart(ctx, config);
}

function getDiffToToday(dataset){
  if(dataset.length <= 0) return '-'

  const mostRecent = dataset.reduce((latest, obj) => 
    new Date(obj.date) > new Date(latest.date) ? obj : latest
  );

  const today = new Date();
  const recentDate = new Date(mostRecent.date);
  const diffInDays = Math.floor((today - recentDate) / (1000 * 60 * 60 * 24));
  return diffInDays
}

function adjustDOM(schaschData, maniData){
  const schaschCountField = document.getElementById("schaschCount");
  const maniCountField = document.getElementById("maniCount");
  const schaschTimeField = document.getElementById("schaschTime");
  const maniTimeField = document.getElementById("maniTime");

  schaschCountField.innerText = schaschData.length;
  maniCountField.innerText = maniData.length;

  schaschTimeField.innerText = getDiffToToday(schaschData);
  maniTimeField.innerText = getDiffToToday(maniData);
}

async function fetchData() {
  try {
    let response = await fetch(
      "http://localhost:3000/api/v1/pizzaStats/schasch"
    );
    const schaschData = await response.json();
    response = await fetch("http://localhost:3000/api/v1/pizzaStats/mani");
    const maniData = await response.json();

    createLineChart(schaschData, maniData);
    createPieChart(schaschData, ctxPie1);
    createPieChart(maniData, ctxPie2);
    adjustDOM(schaschData, maniData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();

