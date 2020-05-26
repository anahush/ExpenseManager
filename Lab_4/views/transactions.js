let Transactions = {
    render: async() => {
        return `
        <div class="site-content">
        <aside>
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
        </aside>

        <main class="transactions">
            <h1>Transactions</h1>
            <details open>
                <summary>Filters</summary>
                <div class="details-content">
                    <div class="transactions-first-row transactions">
                        <input type="search" class="search search-transaction" name="search" placeholder="Search...">
                        <ul class="transactions-links">
                            <li>
                                <input type="button" id="recent" class="text-like-button" value="Recent" />
                            </li>
                            <li>
                                <input type="button" id="all" class="text-like-button" value="All">
                            </li>
                            <li>
                                <a class="in-header" href="#/add_transaction"><img src="res/add.png" height="20"
                                        width="20" /></a>
                            </li>
                        </ul>
                    </div>
                    <div class="transactions-second-row">
                        <div class="dates-period">
                            <div class="date-transaction">
                                <label class="period-label" for="from-transactions">From: </label>
                                <input class="input date-input period-input" id="from-transactions" type="date"
                                    name="date_from">
                            </div>
                            <div class="date-transaction">
                                <label class="period-label" for="to-transactions">To: </label>
                                <input class="input date-input period-input low" id="to-transactions" type="date"
                                    name="date_to">
                            </div>
                        </div>
                        <select class="select-tag select-tag-transactions">
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
                <table class="table-transactions">
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Description</th>
                            <th scope="col">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-th="Date"><time>date_1</time></td>
                            <td data-th="Description"><button
                                    class="text-like-button in-table open-modal">descr_1</button></td>
                            <td data-th="Amount">amount_1</td>
                        </tr>
                        <tr>
                            <td data-th="Date"><time>date_2</time></td>
                            <td data-th="Description"><button
                                    class="text-like-button in-table open-modal">descr_2</button></td>
                            <td data-th="Amount">amount_2</td>
                        </tr>
                        <tr>
                            <td data-th="Date"><time>date_3</time></td>
                            <td data-th="Description"><button
                                    class="text-like-button in-table open-modal">descr_3</button></td>
                            <td data-th="Amount">amount_3</td>
                        </tr>
                        <tr>
                            <td data-th="Date"><time>date_4</time></td>
                            <td data-th="Description"><button
                                    class="text-like-button in-table open-modal">descr_4</button></td>
                            <td data-th="Amount">amount_4</td>
                        </tr>
                        <tr>
                            <td data-th="Date"><time>date_5</time></td>
                            <td data-th="Description"><button
                                    class="text-like-button in-table open-modal">descr_5</button></td>
                            <td data-th="Amount">amount_5</td>
                        </tr>
                        <tr>
                            <td data-th="Date"><time>date_6</time></td>
                            <td data-th="Description"><button class="text-like-button open-modal">descr_6</button></td>
                            <td data-th="Amount">amount_6</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
        `
    }
};

export default Transactions;