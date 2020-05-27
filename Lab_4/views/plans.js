import ShortStatisticsPartial from './shortStatisticsPartial.js';

let Plans = {
    render: async (dataPlans, dataStatistics) => {
        Plans.data = dataPlans;
        Plans.dataStatistics = dataStatistics;
        return `
        <div class="site-content">
        ${Plans.renderAside()}

        <main class="transactions">
            <h1>Plans</h1>
            <details open>
                <summary>Filters</summary>
                <div class="details-content">
                    <div class="transactions-first-row">
                        <input type="search" class="search search-transaction" name="search" placeholder="Search...">
                        <ul class="transactions-links">
                            <li>
                                <input type="button" id="recent" class="text-like-button" value="Recent" />
                            </li>
                            <li>
                                <input type="button" id="all" class="text-like-button" value="All">
                            </li>
                            <li>
                                <a class="in-header" href="#/add_plan"><img src="res/add.png" height="20"
                                        width="20" /></a>
                            </li>
                        </ul>
                    </div>
                    <div class="transactions-second-row plans">
                        <select class="select-type select-type-plans">
                            <option>Income</option>
                            <option>Expense</option>
                        </select>
                        <select class="select-tag select-tag-plans">
                            <option>Food</option>
                            <option>Transport</option>
                            <option>Car</option>
                            <option>Entertainment</option>
                            <option>Clothes</option>
                            <option>House</option>
                        </select>
                    </div>
                </div>
            </details>
            <div>
                <div id="transactionModal" class="modal">
                    <div class="modal-content">
                        <h2>Description <a class="edit-link">Edit</a></h2>
                        <img src="res/home.png" style="height: 100px;">
                        <ul class="modal-ul">
                            <li>Date: </li>
                            <li>Place: </li>
                            <li>Amount: </li>
                            <li>Category: </li>
                        </ul>
                        <span class="close-modal">&times;</span>
                    </div>
                </div>
                ${Plans.renderTable()}
            </div>
        </main>
    </div>
        `
    },

    afterRender: async () => {

    },

    renderTable: () => {
        return `
        <table class="table-plans">
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Description</th>
                    <th scope="col">Amount</th>
                    </tr>
            </thead>
            <tbody>
                ${Plans.renderTableContent()}
            </tbody>
        </table>
        `
    },

    renderTableContent: () => {
        let markup = ``;
        Plans.data.forEach(element => {
            markup += Plans.renderTR(element);
        });
        return markup;
    },

    renderTR: (element) => {
        return `
        <tr>
            <td data-th="Date"><time>${element.date}</time></td>
            <td data-th="Description">
                <buttonclass="text-like-button in-table open-modal">${element.description}</button>
            </td>
            <td data-th="Amount">${element.amount}</td>
        </tr>
        `
    },

    renderAside: () => {
        return `
        <aside>
            <h2>Short statistics</h2>
                ${ShortStatisticsPartial.render(Plans.dataStatistics)}
        </aside>
        `
    },
};

export default Plans;