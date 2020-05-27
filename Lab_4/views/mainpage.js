import Utils from '../services/utils.js';
import ShortStatisticsPartial from './shortStatisticsPartial.js';

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
                    <img class="temp-chart" src="res/chart_1.png">
                    <!-- <div id="balance_chart"></div> -->
                    <form class="chart-form">
                        <label>
                            <input type="radio" name="choice">Month
                        </label>
                        <label>
                            <input type="radio" name="choice">Year
                        </label>
                        <label>
                            <input type="radio" name="choice">All time
                        </label>
                    </form>
                </article>
            </div>

            <div class="main-item">
                <article class="chart-container">
                    <h2>Trend</h2>
                    <img class="temp-chart" src="res/chart_2.png">
                    <!-- <div id="trend_chart"></div> -->
                    <form class="chart-form">
                        <label>
                            <input type="radio" name="choice">Month
                        </label>
                        <label>
                            <input type="radio" name="choice">Year
                        </label>
                        <label>
                            <input type="radio" name="choice">All time
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
            <td data-th="Amount">${element.amount}</td>
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
                    <p>Contributed: ${element.contributed}</p>
                </li>
                <li>
                    <p>Left: ${left}</p>
                </li>
            </ul>
        </li>
        `
    },

    renderAside: () => {
        return `
        <aside>
            <h2>Short statistics</h2>
                ${ShortStatisticsPartial.render(MainPage.dataTransactions)}
        </aside>
        `
    },
};

export default MainPage;