google.charts.load('current', { packages: ['corechart', 'line'] });
google.charts.setOnLoadCallback(drawBalanceChart);
google.charts.setOnLoadCallback(drawTrendChart);
google.charts.setOnLoadCallback(drawIncomeChart);
google.charts.setOnLoadCallback(drawExpenseChart);


window.onresize = drawCharts;

function drawCharts() {
    drawBalanceChart();
    drawTrendChart();
}

function getBalanceData(dataBalance) {
    dataBalance.addColumn('number', 'X');
    dataBalance.addColumn('number', 'Average');
    dataBalance.addColumn('number', 'Real');

    dataBalance.addRows([
        [1, 5, 0],
        [2, 5, 0],
        [3, 5, 5],
        [4, 5, 10],
        [5, 5, 10],
    ]);

    var optionsBalance = {
        curveType: 'function',
        chartArea: {
            // leave room for y-axis labels
            width: '80%'
        },
        legend: { position: 'top', alignment: 'center' },
        colors: ['#a52714', '#097138']
    };
    return dataBalance, optionsBalance;
}

function drawBalanceChart() {
    var dataBalance = new google.visualization.DataTable();
    var optionsBalance;
    dataBalance, optionsBalance = getBalanceData(dataBalance)

    var chart = new google.visualization.LineChart(document.getElementById('balance_chart'));
    chart.draw(dataBalance, optionsBalance);
}

function drawTrendChart() {
    var dataTrend = google.visualization.arrayToDataTable([
        ['Month', 'Income', 'Expense'],
        ['January', 700, -300],
        ['February', 500, -400],
        ['March', 400, -150],
        ['April', 1000, -700],
        ['May', 900, -800],
        ['June', 350, -120],
        ['July', 600, -400]]);

    var optionsTrend = {
        isStacked: true,
        colors: ['#80ffd4', '#ff9999'],
        legend: { position: 'top', alignment: 'center' },
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('trend_chart'));
    chart.draw(dataTrend, optionsTrend);
}

function drawIncomeChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Browser');
    data.addColumn('number', 'Percentage');
    data.addRows([
        ['tag_1', 45.0],
        ['tag_2', 30],
        ['tag_3', 25],
    ]);

    // Set chart options
    var options = {
        pieHole: 0.6,
        fontSize: 6,
        chartArea: {
            height: '80%'
        },
        legend: { position: 'bottom', alignment: 'center' },
        colors: ['#B2DFDB', '#80CBC4', '#4DB6AC', '#26A69A', '#009688', '#00897B', '#00796B',
            '#00695C', '#004D40', '#A7FFEB', '#64FFDA', '#1DE9B6','#1DE9B6', '#00BFA5']
    };

    // Instantiate and draw the chart.
    var chart = new google.visualization.PieChart(document.getElementById('income_graph'));
    chart.draw(data, options);
}

function drawExpenseChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Browser');
    data.addColumn('number', 'Percentage');
    data.addRows([
        ['tag_1', 45.0],
        ['tag_2', 30],
        ['tag_3', 25],
    ]);

    // Set chart options
    var options = {
        pieHole: 0.6,
        fontSize: 6,
        chartArea: {
            height: '80%'
        },
        legend: { position: 'bottom', alignment: 'center' },
        colors: ['#FFCDD2', '#EF9A9A', '#E57373','#EF5350', '#F44336','#E53935','#D32F2F',
        '#C62828', '#B71C1C', '#FF8A80', '#FF5252', '#FF1744', '#D50000']
    };

    // Instantiate and draw the chart.
    var chart = new google.visualization.PieChart(document.getElementById('expense_graph'));
    chart.draw(data, options);
}

