import ArrayUtils from './arrayUtils.js';
import CurrencyUtils from './currencyUtils.js';

CanvasJS.addColorSet("incomeColorSet", ['#B2DFDB', '#80CBC4', '#4DB6AC', '#26A69A', '#009688', '#00897B', '#00796B',
'#00695C', '#004D40', '#A7FFEB', '#64FFDA', '#1DE9B6','#1DE9B6', '#00BFA5']);
CanvasJS.addColorSet("expenseColorSet", ['#FFCDD2', '#EF9A9A', '#E57373','#EF5350', '#F44336','#E53935','#D32F2F',
'#C62828', '#B71C1C', '#FF8A80', '#FF5252', '#FF1744', '#D50000']);

let ChartUtilsCanvas = {

    getBalanceData: (rawData, type) => {
        rawData.sort((el1, el2) => {
            let el1d = new Date(el1.date), el2d = new Date(el2.date);
            return el1d > el2d ? 1 : el1d < el2d ? -1 : 0;
        })

        let sum = 0, length = rawData.length, lengthCur = 0;
        let data = [];
        let sums = [];

        for (let i = 0; i < length; i++) {
            let amount = CurrencyUtils.convertToUSD(Number(rawData[i].amount), rawData[i].currency);
            if (rawData[i].type == "Income") {
                sum += amount;
            } else {
                sum -= amount;
            }
            let date = new Date(rawData[i].date)
            let today = new Date();
            if (type == "all"
                || (type == "month" && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear())
                || (type == "year" && date.getFullYear() == today.getFullYear())) {
                data.push({ x: date, y: sum })
                sums.push(sum);
                lengthCur += 1;
            }
        }
        let averageChartData = [];
        if (lengthCur != 0) {
            let average = (sums.reduce((a, b) => a + b)) / (lengthCur);
            for (let el of data) {
                averageChartData.push({ x: el.x, y: average })
            }
            return { dataChart: data, average: averageChartData };
        }
        return { "dataChart": data, "average": [{ x: 0, y: 0 }] };
    },

    drawBalanceChart: (rawData, type) => {
        if (rawData == null) {
            return;
        }

        let dataAll = ChartUtilsCanvas.getBalanceData(rawData, type);
        let chart = new CanvasJS.Chart("balance_chart", {
            animationEnabled: false,
            legend: {
                cursor: "pointer",
                verticalAlign: "top",
                horizontalAlign: "center",
                dockInsidePlotArea: true,
            },
            zoomEnabled: true,
            data: [{
                type: "line",
                axisYType: "secondary",
                name: "Real",
                showInLegend: true,
                color: "green",
                markerSize: 0,
                dataPoints: dataAll.dataChart
            },
            {
                type: "line",
                axisYType: "secondary",
                name: "average",
                showInLegend: true,
                color: "red",
                markerSize: 0,
                dataPoints: dataAll.average
            }]
        });
        chart.render();
    },

    getTrendData: (rawData, type) => {
        rawData.sort((el1, el2) => {
            let el1d = new Date(el1.date), el2d = new Date(el2.date);
            return el1d > el2d ? 1 : el1d < el2d ? -1 : 0;
        })
        let dates = [], suitableData = [];
        let today = new Date();
        for (let el of rawData) {
            let date = new Date(el.date);
            if (type == "all"
                || (type == "month" && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear())
                || (type == "year" && date.getFullYear() == today.getFullYear())) {
                let dateSuit = new Date(el.date);
                dates.push(dateSuit);
                suitableData.push({ date: dateSuit, amount: CurrencyUtils.convertToUSD(el.amount, el.currency), type: el.type })
            }
        }

        let dsn = ArrayUtils.chunkify(dates, 7, true);
        let datesSeparate = dsn.out, newN = dsn.outN;
        let outputIncome = [], outputExpense = [];
        let sumsIncome = new Array(newN).fill(0);
        let sumsExpense = new Array(newN).fill(0);
        for (let el of suitableData) {
            for (let i in datesSeparate) {
                if (el.date >= datesSeparate[i][0] && el.date <= datesSeparate[i][datesSeparate[i].length - 1]) {
                    if (el.type == "Income") {
                        sumsIncome[i] += Number(el.amount);
                    } else {
                        sumsExpense[i] -= Number(el.amount);
                    }
                }
            }
        }

        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' })

        for (let i = 0; i < newN; i++) {
            let [{ value: monthBeg }, , { value: dayBeg }, , { value: yearBeg }] = dateTimeFormat.formatToParts(datesSeparate[i][0]);
            let [{ value: monthEnd }, , { value: dayEnd }, , { value: yearEnd }] = dateTimeFormat.formatToParts(datesSeparate[i][datesSeparate[i].length - 1]);
            outputIncome.push({ label: `${dayBeg}-${monthBeg}-${yearBeg} — ${dayEnd}-${monthEnd}-${yearEnd}`, y: sumsIncome[i] });
            outputExpense.push({ label: `${dayBeg}-${monthBeg}-${yearBeg} — ${dayEnd}-${monthEnd}-${yearEnd}`, y: sumsExpense[i] });
        }
        return { income: outputIncome, expense: outputExpense };
    },

    drawTrendChart: (rawData, type) => {
        if (rawData == null) {
            return;
        }
        
        let dataAll = ChartUtilsCanvas.getTrendData(rawData, type);
        let chart = new CanvasJS.Chart("trend_chart", {
            animationEnabled: false,
            zoomEnabled: true,
            data: [
                {
                    type: "stackedColumn",
                    showInLegend: true,
                    color: "green",
                    indexLabelFontSize: 7,
                    name: "Income",
                    dataPoints: dataAll.income
                },
                {
                    type: "stackedColumn",
                    showInLegend: true,
                    color: "red",
                    indexLabelFontSize: 7,
                    name: "Expense",
                    dataPoints: dataAll.expense
                }
            ]
        });
        chart.render();
    },

    getDonutChartsData: (rawData) => {
        let sumIncome = {
            "Food": 0,
            "Transport": 0,
            "Car": 0,
            "Entertainment": 0,
            "Clothes": 0,
            "House": 0
        };
        let sumExpense = {
            "Food": 0,
            "Transport": 0,
            "Car": 0,
            "Entertainment": 0,
            "Clothes": 0,
            "House": 0
        };
        for (let el of rawData) {
            let amount = CurrencyUtils.convertToUSD(Number(el.amount), el.currency);
            if (el.type == "Income") {
                sumIncome[el.category] += amount;
            } else {
                sumExpense[el.category] += amount;
            }
        }

        let dataIncome = [], dataExpense = [];
        for (let category in sumIncome) {
            if (Object.prototype.hasOwnProperty.call(sumIncome, category) && sumIncome[category] != 0) {
                dataIncome.push({y: sumIncome[category], label: category});
            }
        }
        for (let category in sumExpense) {
            if (Object.prototype.hasOwnProperty.call(sumExpense, category) && sumExpense[category] != 0) {
                dataExpense.push({y: sumExpense[category], label: category});
            }
        }
        return {income: dataIncome, expense: dataExpense};
    },

    drawDonutCharts: (rawData) => {
        if (rawData == null) {
            return;
        }
        
        let dataAll = ChartUtilsCanvas.getDonutChartsData(rawData);
        let chartIncome = new CanvasJS.Chart("income_graph", {
            animationEnabled: false,
            colorSet: "incomeColorSet",
            data: [{
                type: "doughnut",
                startAngle: 60,
                indexLabelFontSize: 14,
                indexLabel: "{label} - #percent%",
                toolTipContent: "<b>{label}:</b> {y} (#percent%)",
                dataPoints: dataAll.income
            }]
        });
        let chartExpense = new CanvasJS.Chart("expense_graph", {
            animationEnabled: false,
            colorSet: "expenseColorSet",
            data: [{
                type: "doughnut",
                startAngle: 60,
                indexLabelFontSize: 14,
                indexLabel: "{label} - #percent%",
                toolTipContent: "<b>{label}:</b> {y} (#percent%)",
                dataPoints: dataAll.expense
            }]
        });
        chartIncome.render();
        chartExpense.render();
    }
}

export default ChartUtilsCanvas;