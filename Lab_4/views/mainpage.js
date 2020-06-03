import ShortStatisticsPartial from './shortStatisticsPartial.js';
import ChartUtilsCanvas from '../services/chartUtils.js';
import CurrencyUtils from '../services/currencyUtils.js';

let MainPage = {
    render: async (dataTransactions, dataGoals, dataPlans) => {
        MainPage.dataTransactions = dataTransactions;
        MainPage.dataGoals = dataGoals;
        MainPage.dataPlans = dataPlans;

        return `
        ${MainPage.renderAside()}

        <main class="index">
            <div class="main-item">
                <article class="chart-container">
                    <h2>Balance</h2>
                    <!-- <img class="temp-chart" src="res/chart_1.png"> -->
                    <div id="balance_chart"></div> 
                    <form class="chart-form">
                        <label>
                            <input type="radio" id="month-balance" name="choice" value="1">Month
                        </label>
                        <label>
                            <input type="radio" id="year-balance" name="choice" value="2">Year
                        </label>
                        <label>
                            <input type="radio" id="all-balance" name="choice" value="0">All time
                        </label>
                    </form>
                </article>
            </div>

            <div class="main-item">
                <article class="chart-container">
                    <h2>Trend</h2>
                    <!-- <img class="temp-chart" src="res/chart_2.png"> -->
                    <div id="trend_chart"></div> 
                    <form class="chart-form">
                        <label>
                            <input type="radio" id="month-trend" name="choice">Month
                        </label>
                        <label>
                            <input type="radio" id="year-trend" name="choice">Year
                        </label>
                        <label>
                            <input type="radio" id="all-trend" name="choice">All time
                        </label>
                    </form>
                </article>
            </div>

            <div class="main-item">
                <article>
                    <h2>Goals<a class="in-header" href="#/add_goal"><img src="res/add.png" height="20"
                                width="20" /></a>
                    </h2>
                    <div class="goals-frame">
                        ${MainPage.renderULGoalsList()}
                    </div>
                </article>
            </div>

            <div class="main-item">
                <article>
                    <h2>Reminders<a class="in-header" href="#/add_plan"><img src="res/add.png" height="20"
                                width="20" /></a></h2>
                    ${MainPage.renderTable()}
                </article>
            </div>
        </main>
        `
    },

    afterRender: () => {
        ChartUtilsCanvas.drawBalanceChart(MainPage.dataTransactions, "all");
        ChartUtilsCanvas.drawTrendChart(MainPage.dataTransactions, "all");

        let radioMonthBalance = document.getElementById('month-balance');
        if (radioMonthBalance) {
            radioMonthBalance.addEventListener('click', () => {  
                ChartUtilsCanvas.drawBalanceChart(MainPage.dataTransactions, "month");
            })
        }

        let radioMonthTrend = document.getElementById('month-trend');
        if (radioMonthTrend) {
            radioMonthTrend.addEventListener('click', () => {  
                ChartUtilsCanvas.drawTrendChart(MainPage.dataTransactions, "month");
            })
        }

        let radioYearBalance = document.getElementById('year-balance');
        if (radioYearBalance) {
            radioYearBalance.addEventListener('click', () => {
                ChartUtilsCanvas.drawBalanceChart(MainPage.dataTransactions, "year");
            })
        }

        let radioYearTrend = document.getElementById('year-trend');
        if (radioYearTrend) {
            radioYearTrend.addEventListener('click', () => {
                ChartUtilsCanvas.drawTrendChart(MainPage.dataTransactions, "year");
            })
        }

        let radioAllBalance = document.getElementById('all-balance');
        if (radioAllBalance) {
            radioAllBalance.addEventListener('click', () => {
                ChartUtilsCanvas.drawBalanceChart(MainPage.dataTransactions, "all");
            })
        }

        let radioAllTrend = document.getElementById('all-trend');
        if (radioAllTrend) {
            radioAllTrend.addEventListener('click', () => {
                ChartUtilsCanvas.drawTrendChart(MainPage.dataTransactions, "all");
            })
        }
    },

    renderTable: () => {
        return `
        <table class="main-page-table">
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Description</th>
                    <th scope="col">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${MainPage.renderTableContent()}
            </tbody>
        </table>
        `
    },

    renderTableContent: () => {
        if (MainPage.dataPlans == null) {
            return "";
        }
        let markup = ``;
        MainPage.dataPlans.forEach(element => {
            markup += MainPage.renderTR(element);
        });
        return markup;
    },

    renderTR: (element) => {
        return `
        <tr>
            <td data-th="Date"><time>${element.date}</time></td>
            <td data-th="Description">${element.description}</td>
            <td data-th="Amount">${CurrencyUtils.getAmountWithCurrency(element.amount, element.currency)}</td>
        </tr>
        `
    },

    renderULGoalsList: () => {
        return `
        <ul class="goals-list">
            ${MainPage.renderULGoalsistContent()}
        </ul>
        `
    },

    renderULGoalsistContent: () => {
        if (MainPage.dataGoals == null) {
            return "";
        }
        let markup = ``;
        MainPage.dataGoals.forEach(element => {
            markup += MainPage.renderLIGoalsList(element);
        });
        return markup;
    },

    renderLIGoalsList: (element) => {
        let left = 0;
        if (element.contributed) {
            left = element.amount - element.contributed;
        } else {
            left = element.amount;
            element.contributed = "0";
        }
        return `
        <li>
            <h3>${element.description}</h3>
            <ul class="goals-points-list">
                <li>
                    <p>Contributed: ${CurrencyUtils.getAmountWithCurrency(element.contributed, element.currency)}</p>
                </li>
                <li>
                    <p>Left: ${CurrencyUtils.getAmountWithCurrency(left, element.currency)}</p>
                </li>
            </ul>
        </li>
        `
    },

    renderAside: () => {
        if (MainPage.dataTransactions == null) {
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
                ${ShortStatisticsPartial.render(MainPage.dataTransactions)}
        </aside>
        `
    },
};

export default MainPage;