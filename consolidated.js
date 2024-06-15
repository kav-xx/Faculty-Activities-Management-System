let barChartInstance;
let pieChartInstance;
let barChartInstance1;
let pieChartInstance1;
let barChartInstance2;
let pieChartInstance2;

document.getElementById('displayButton').addEventListener('click', function () {
  const fromYear = parseInt(document.getElementById('fromYear').value);
  const toYear = parseInt(document.getElementById('toYear').value);

  fetch(`/data_consol?fromYear=${fromYear}&toYear=${toYear}`)
    .then(response => response.json())
    .then(responseData => {
      const { data, data1, data2 } = responseData;
      displayCharts(data, fromYear, toYear);
      displayChartsNew(data1, fromYear, toYear);
      displayChartsOther(data2, fromYear, toYear);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});

function displayCharts(data, fromYear, toYear) {
  const types = data.map(entry => entry.type);
  const counts = data.map(entry => entry.count);



  const colors = [
    'rgba(76, 175, 80, 0.6)',  // #4CAF50
    'rgba(255, 99, 132, 0.6)', // #FF6384
    'rgba(54, 162, 235, 0.6)', // #36A2EB
    'rgba(255, 206, 86, 0.6)', // #FFCE56
    'rgba(170, 101, 204, 0.6)',// #AA65CC
    'rgba(255, 160, 122, 0.6)',// #FFA07A
    'rgba(32, 178, 170, 0.6)', // #20B2AA
    'rgba(119, 136, 153, 0.6)',// #778899
    'rgba(255, 69, 0, 0.6)',   // #FF4500
    'rgba(0, 206, 209, 0.6)'   // #00CED1
  ];
  
  const barCtx = document.getElementById('barChart').getContext('2d');
  const pieCtx = document.getElementById('pieChart').getContext('2d');

  if (barChartInstance) {
    barChartInstance.destroy();
  }
  if (pieChartInstance) {
    pieChartInstance.destroy();
  }

  
  barChartInstance =
  new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: types,
      datasets: [{
        label: `SDP ATTENDED (${fromYear}-${toYear})`,
        //label : 'SDP ATTENDED Training Program',
        data: counts,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      },
      plugins: {
        datalabels: {
          display: true,
          color: '#000',
          anchor: 'end',
          align: 'end',
          formatter: (value) => value,
          font: {
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    plugins: [ChartDataLabels]
  });



  pieChartInstance = new Chart(pieCtx, {
    type: 'line',
    data: {
      labels: types,
      datasets: [{
        label: `SDP ATTENDED (${fromYear}-${toYear})`,
        data: counts,
        fill: false,
        backgroundColor: colors,
        borderColor: colors,
        tension: 0.1
      }]
    },
    options: {
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      },
      plugins: {
        datalabels: {
          display: true,
          color: '#000',
          anchor: 'end',
          align: 'end',
          formatter: (value) => value,
          font: {
            
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}

function displayChartsNew(data, fromYear, toYear) {
  const types = data.map(entry => entry.type);
  const counts = data.map(entry => entry.count);

  const colors = [
    '#4CAF50', '#FF6384', '#36A2EB', '#FFCE56', '#AA65CC', '#FFA07A', '#20B2AA', '#778899', '#FF4500', '#00CED1'
  ];
  const barCtx = document.getElementById('barChartNew').getContext('2d');
  const pieCtx = document.getElementById('pieChartNew').getContext('2d');

  if (barChartInstance1) {
    barChartInstance1.destroy();
  }
  if (pieChartInstance1) {
    pieChartInstance1.destroy();
  }

  barChartInstance1 = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: types,
      datasets: [{
        label: `SDP_Organised (${fromYear}-${toYear})`,
        data: counts,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      },
      plugins: {
        datalabels: {
          display: true,
          color: '#000',
          anchor: 'end',
          align: 'end',
          formatter: (value) => value,
          font: {
            
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    plugins: [ChartDataLabels]
  });

  pieChartInstance1 = new Chart(pieCtx, {
    type: 'line',
    data: {
      labels: types,
      datasets: [{
        label: `SDP_Organised (${fromYear}-${toYear})`,
        data: counts,
        fill: false,
        backgroundColor: colors,
        borderColor: colors,
        tension: 0.1
      }]
    },
    options: {
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      },
      plugins: {
        datalabels: {
          display: true,
          color: '#000',
          anchor: 'end',
          align: 'end',
          formatter: (value) => value,
          font: {
            
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    plugins: [ChartDataLabels]
  });
  document.getElementById('pieChart').width = 600;
  document.getElementById('pieChart').height = 600;
}

function displayChartsOther(data, fromYear, toYear) {
  const types = data.map(entry => entry.type);
  const counts = data.map(entry => entry.count);

  const colors = [
    '#4CAF50', '#FF6384', '#36A2EB', '#FFCE56', '#AA65CC', '#FFA07A', '#20B2AA', '#778899', '#FF4500', '#00CED1'
  ];
  const barCtx = document.getElementById('barChartOther').getContext('2d');
  const pieCtx = document.getElementById('pieChartOther').getContext('2d');

  if (barChartInstance2) {
    barChartInstance2.destroy();
  }
  if (pieChartInstance2) {
    pieChartInstance2.destroy();
  }

  barChartInstance2 = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: types,
      datasets: [{
        label: `Invited Talks (${fromYear}-${toYear})`,
        data: counts,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      },
      plugins: {
        datalabels: {
          display: true,
          color: '#000',
          anchor: 'end',
          align: 'end',
          formatter: (value) => value,
          font: {
            
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    plugins: [ChartDataLabels]
  });

  pieChartInstance2 = new Chart(pieCtx, {
    type: 'line',
    data: {
      labels: types,
      datasets: [{
        label: `Invited Talks (${fromYear}-${toYear})`,
        data: counts,
        fill: false,
        backgroundColor: colors,
        borderColor: colors,
        tension: 0.1
      }]
    },
    options: {
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      },
      plugins: {
        datalabels: {
          display: true,
          color: '#000',
          anchor: 'end',
          align: 'end',
          formatter: (value) => value,
          font: {
            // weight: 'bold'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}
