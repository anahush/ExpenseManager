import ShortStatisticsPartial from './shortStatisticsPartial.js';

let Goals = {
    render: async (dataGoals, dataStatistics) => {
        Goals.data = dataGoals;
        Goals.dataStatistics = dataStatistics;
        return `
        <div class="site-content">
        ${Goals.renderAside()}

        <main class="transactions">
            <h1>Goals</h1>
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
                                <a class="in-header" href="#/add_goal"><img src="res/add.png" height="20"
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
                        <span class="close-modal">&times;</span>
                        <h2>Description <a class="edit-link">Edit</a></h2>
                        <!-- temporary -->
                        <img src="res/home.png" style="height: 100px;">
                        <ul class="modal-ul">
                            <li>Due: </li>
                            <li>Contributed: </li>
                            <li>Left: </li>
                            <li>Category: </li>
                        </ul>
                    </div>
                </div>
                <div id="addToGoalsModal" class="modal">
                    <div class="modal-content">
                        <span class="close-modal-add">&times;</span>
                        <h2>Add/remove</h2>
                        <form class="transaction-form">
                            <div class="wrap-input validate-input" data-validate="Amount is required">
                                <label class="label-input" for="amount-goals-modal">Amount</label>
                                <input class="input input-form" id="amount-goals-modal" type="number" name="amount"
                                    placeholder="Enter amount">
                                <span class="focus-input"></span>
                            </div>
                            <div class="modal-submit-wrapper">
                                <input type="submit" name="Submit" class="transaction-submit">
                            </div>
                        </form>
                    </div>
                </div>
                ${Goals.renderTable()}
            </div>
        </main>
    </div>
        `
    },

    renderTable: () => {
        return `
        <table class="table-plans">
            <thead>
                <tr>
                    <th scope="col">Due</th>
                    <th scope="col">Description</th>
                    <th scope="col">Contributed</th>
                    <th scope="col">Left</th>
                    <th scope="col">Add/remove</th>
                </tr>
            </thead>
            <tbody>
            ${Goals.renderTableContent()}
            </tbody>
        </table>
        `
    },

    renderTableContent: () => {
        let markup = ``;
        Goals.data.forEach(element => {
            markup += Goals.renderTR(element);
        });
        return markup;
    },

    renderTR: (element) => {
        let left;
        if (element.contributed) {
            left = element.amount - element.contributed;
        } else {
            left = element.amount;
            element.contributed = "0";
        }
        return `
        <tr>
           <td data-th="Due"><time>${element.due}</time></td>
            <td data-th="Description">
                <button class="text-like-button in-table open-modal">${element.description}</button>
            </td>
            <td data-th="Contributed">${element.contributed}</td>
            <td data-th="Left">${left}</td>
            <td data-th="Add/Remove">
                <a class="in-header open-modal-add"><img src="res/add.png"/></a>
            </td>
        </tr>
        `
    },

    renderAside: () => {
        return `
        <aside>
            <h2>Short statistics</h2>
                ${ShortStatisticsPartial.render(Goals.dataStatistics)}
        </aside>
        `
    },
};

export default Goals;