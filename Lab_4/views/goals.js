let Goals = {
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
                <table class="table-plans">
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Description</th>
                            <th scope="col">Contributed</th>
                            <th scope="col">Left</th>
                            <th scope="col">Add/remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-th="Date"><time>date_1</time></td>
                            <td data-th="Description"><button
                                    class="text-like-button in-table open-modal">descr_1</button></td>
                            <td data-th="Contributed">amount_1</td>
                            <td data-th="Left">amount_1</td>
                            <td data-th="Add/Remove"><a class="in-header open-modal-add"><img src="res/add.png" /></a>
                            </td>
                        </tr>
                        <tr>
                            <td data-th="Date"><time>date_2</time></td>
                            <td data-th="Description"><button class="text-like-button in-table open-modal">descr_2</a>
                            </td>
                            <td data-th="Contributed">amount_2</td>
                            <td data-th="Left">amount_2</td>
                            <td data-th="Add/Remove"><a class="in-header open-modal-add"><img src="res/add.png" /></a>
                            </td>
                        </tr>
                        <tr>
                            <td data-th="Date"><time>date_3</time></td>
                            <td data-th="Description"><button
                                    class="text-like-button in-table open-modal"></button>descr_3</a></td>
                            <td data-th="Contributed">amount_3</td>
                            <td data-th="Left">amount_3</td>
                            <td data-th="Add/Remove"><a class="in-header open-modal-add"><img src="res/add.png" /></a>
                            </td>
                        </tr>
                        <tr>
                            <td data-th="Date"><time>date_4</time></td>
                            <td data-th="Description"><button
                                    class="text-like-button in-table open-modal">descr_4</button></td>
                            <td data-th="Contributed">amount_4</td>
                            <td data-th="Left">amount_4</td>
                            <td data-th="Add/Remove"><a class="in-header open-modal-add"><img src="res/add.png" /></a>
                            </td>
                        </tr>
                        <tr>
                            <td data-th="Date"><time>date_5</time></td>
                            <td data-th="Description"><button
                                    class="text-like-button in-table open-modal">descr_5</button></td>
                            <td data-th="Contributed">amount_5</td>
                            <td data-th="Left">amount_5</td>
                            <td data-th="Add/Remove"><a class="in-header open-modal-add"><img src="res/add.png" /></a>
                            </td>
                        </tr>
                        <tr>
                            <td data-th="Date"><time>date_6</time></td>
                            <td data-th="Description"><button
                                    class="text-like-button in-table open-modal">descr_6</button></td>
                            <td data-th="Contributed">amount_6</td>
                            <td data-th="Left">amount_6</td>
                            <td data-th="Add/Remove"><a class="in-header open-modal-add"><img src="res/add.png" /></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
        `
    }
};

export default Goals;