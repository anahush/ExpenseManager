import Utils from '../services/utils.js';

let MainPage = {
    render: async () => {
        return `
        <aside class="index">
            <div class="aside-content">
                <h2>Short statistics</h2>
                <ul class="statistics-list">
                    <li>
                        <h3>Balance</h3>
                        <ul class="statistics-point-list">
                            <li>
                                <p>Card: "value"</p>
                            </li>
                            <li>
                                <p>Cash: "value"</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3>Income</h3>
                        <ul class="statistics-point-list">
                            <li>
                                <p>Card: "value"</p>
                            </li>
                            <li>
                                <p>Cash: "value"</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3>Expense</h3>
                        <ul class="statistics-point-list">
                            <li>
                                <p>Card: "value"</p>
                            </li>
                            <li>
                                <p>Cash: "value"</p>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </aside>

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
                        <ul class="goals-list">
                            <li>
                                <h3>Goal_1</h3>
                                <ul class="goals-points-list">
                                    <li>
                                        <p>Contributed: "value"</p>
                                    </li>
                                    <li>
                                        <p>Left: "value"</p>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <h3>Goal_2</h3>
                                <ul class="goals-points-list">
                                    <li>
                                        <p>Contributed: "value"</p>
                                    </li>
                                    <li>
                                        <p>Left: "value"</p>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <h3>Goal_1</h3>
                                <ul class="goals-points-list">
                                    <li>
                                        <p>Contributed: "value"</p>
                                    </li>
                                    <li>
                                        <p>Left: "value"</p>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </article>
            </div>

            <div class="main-item">
                <article>
                    <h2>Reminders<a class="in-header" href="#/add_plan"><img src="res/add.png" height="20"
                                width="20" /></a></h2>
                    <table class="main-page-table">
                        <thead>
                            <tr>
                                <th scope="col">Due</th>
                                <th scope="col">Description</th>
                                <th scope="col">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-th="Due"><time>date_1</time></td>
                                <td data-th="Description">descr_1</td>
                                <td data-th="Amount">amount_1</td>
                            </tr>
                            <tr>
                                <td data-th="Due"><time>date_2</time></td>
                                <td data-th="Description">descr_2</td>
                                <td data-th="Amount">amount_2</td>
                            </tr>
                            <tr>
                                <td data-th="Due"><time>date_3</time></td>
                                <td data-th="Description">descr_3</td>
                                <td data-th="Amount">amount_3</td>
                            </tr>
                            <tr>
                                <td data-th="Due"><time>date_4</time></td>
                                <td data-th="Description">descr_4</td>
                                <td data-th="Amount">amount_4</td>
                            </tr>
                            <tr>
                                <td data-th="Due"><time>date_5</time></td>
                                <td data-th="Description">descr_5</td>
                                <td data-th="Amount">amount_5</td>
                            </tr>
                            <tr>
                                <td data-th="Due"><time>date_6</time></td>
                                <td data-th="Description">descr_6</td>
                                <td data-th="Amount">amount_6</td>
                            </tr>
                        </tbody>
                    </table>
                </article>
            </div>
        </main>
        `
    },

    renderTable: () => {
        let markup = ``;
        for (let i = 0; i < MainPage.lenTR; i++) {
            markup += MainPage.renderTR(i);
        }
        return `
        <table class="main-page-table">
            ${markup}
        </table>
        `
    },

    renderTR: (i) => {
        let markup = ``;
        markup += MainPage.renderTDDue(i);
        markup += MainPage.renderTDDescription(i);
        markup += MainPage.renderTDAmount(i);

        return `
        <tr>${markup}</tr>
        `
    },

    renderTdDue(i) {
        return `
        <td data-th="Due"><time>${MainPage.reminders[i].due}</time></td>
        `
    },

    renderTDDescription(i) {
        return `
        <td data-th="Description">${MainPage.reminders[i].description}</td>
        `
    },

    renderTdAmount(i) {
        return `
        <td data-th="Amount">${MainPage.reminders[i].amount}</td>
        `
    }
};

export default MainPage;