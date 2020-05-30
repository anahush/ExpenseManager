import ShortStatisticsPartial from "./shortStatisticsPartial.js";
import ChartUtilsCanvas from "../services/chartUtils.js";

let Statistics = {
    render: async (dataStatistics) => {
        Statistics.data = dataStatistics;
        return `
        <div class="site-content">
        ${Statistics.renderAside()}

        <main class="statistics">
            <h1 class="statistics-text">Full statistics</h1>
            <article class="statistics-article">
                <section class="statistics-section chart-container">
                    <h2>Income</h2>
                    <!-- <img class="temp-chart" src="res/chart_3.png"> -->
                    <div id="income_graph"></div>
                </section>
                <section class="statistics-section chart-container">
                    <h2>Expense</h2>
                    <!-- <img class="temp-chart" src="res/chart_4.png"> -->
                    <div id="expense_graph"></div>
                </section>
            </article>
            <article class="table-article">
                <h2 class="table-title">Year info</h2>
                <div class="table-budget-div" id="table-budget-div">
                    ${Statistics.renderTable()}
                </div>
            </article>
        </main>
    </div>
        `
    },

    afterRender: () => {
        ChartUtilsCanvas.drawDonutCharts(Statistics.data);
    },

    renderTable: () => {
        return `
            <table class="budget">
                <thead>
                    <tr>
                        <th></th>
                        <th scope="col">January</th>
                        <th scope="col">February</th>
                        <th scope="col">March</th>
                        <th scope="col">April</th>
                        <th scope="col">May</th>
                        <th scope="col">June</th>
                        <th scope="col">July</th>
                        <th scope="col">August</th>
                        <th scope="col">September</th>
                        <th scope="col">October</th>
                        <th scope="col">November</th>
                        <th scope="col">December</th>
                    </tr>
                </thead>
                ${Statistics.renderTableBody()}
            </table>
`
    },

    renderTableBody: () => {
        if (Statistics.data == null) {
            return "";
        }
        let catData = Statistics.createCatData();
        return `
        <tr>
            <td class="spanned" colspan="13">Income</td>
        </tr>
            ${Statistics.renderTableIncomeExpense(catData.income)}
        <tr>
            <td class="spanned" colspan="13">Expense</td>
        </tr>
            ${Statistics.renderTableIncomeExpense(catData.expense)}
        `
    },

    renderTableIncomeExpense: (monthlyData) => {
        let mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        let markup = ``;
        for (let category in monthlyData) {
            if (Object.prototype.hasOwnProperty.call(monthlyData, category)) {
                markup += `
                <tr>
                    <td><b>${category}</b></td>
                `
                let monthData = new Array(12).fill(0.);
                monthlyData[category].forEach(element => {
                    monthData[element.month] += Number(element.amount);
                })
                for (let i = 0; i < 12; i++) {
                    markup += `
                    <td data-th="${mlist[i]}">${monthData[i]}</td>
                    `
                }
                markup += `
                </tr>
                `
            }
        }
        return markup;
    },
    createCatData: () => {
        let cIncome = {
            "Food": [],
            "Transport": [],
            "Car": [],
            "Entertainment": [],
            "Clothes": [],
            "House": []
        };
        let cExpense = {
            "Food": [],
            "Transport": [],
            "Car": [],
            "Entertainment": [],
            "Clothes": [],
            "House": []
        };
        Statistics.data.forEach(element => {
            let date = new Date(element.date);
            if (date.getFullYear() == new Date().getFullYear()) { //Current year only
                let month = date.getMonth();
                if (element.type == "Income") {
                    cIncome[element.category].push({month: month, amount: element.amount});
                } else {
                    cExpense[element.category].push({month: month, amount: element.amount});
                }
            }
        });
        return {income: cIncome, expense: cExpense};
    },

    renderAside: () => {
        if (Statistics.data == null) {
            return `
            <aside>
            <h2>Short statistics</h2>
                ${ShortStatisticsPartial.render([{ type: "Income", amount: "0", currency: "USD" }, { type: "Expense", amount: "0", currency: "USD" }])}
            </aside>

            `
        }
        return `
        <aside>
            <h2>Short statistics</h2>
                ${ShortStatisticsPartial.render(Statistics.data)}
        </aside>
        `
    },
    
    forScroll: () => {
        function scrollHorizontally(e) {
            e = window.event || e;
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            document.getElementById('table-budget-div').scrollLeft -= (delta*40); // Multiplied by 40
            e.preventDefault();
        }
        if (document.getElementById('table-budget-div').addEventListener) {
            // IE9, Chrome, Safari, Opera
            document.getElementById('table-budget-div').addEventListener("mousewheel", scrollHorizontally, false);
            // Firefox
            document.getElementById('table-budget-div').addEventListener("DOMMouseScroll", scrollHorizontally, false);
        } else {
            // IE 6/7/8
            document.getElementById('table-budget-div').attachEvent("onmousewheel", scrollHorizontally);
        }
    }
};

export default Statistics;