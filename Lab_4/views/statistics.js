let Statistics = {
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

        <main class="statistics">
            <h1 class="statistics-text">Full statistics</h1>
            <article class="statistics-article">
                <section class="statistics-section chart-container">
                    <h2>Income</h2>
                    <img class="temp-chart" src="res/chart_3.png">
                    <!-- <div id="income_graph"></div> -->
                </section>
                <section class="statistics-section chart-container">
                    <h2>Expense</h2>
                    <img class="temp-chart" src="res/chart_4.png">
                    <!-- <div id="expense_graph"></div> -->
                </section>
            </article>
            <article class="table-article">
                <h2 class="table-title">Budget</h2>
                <table class="budget">
                    <thead>
                        <tr>
                            <th></th>
                            <th scope="col"><time>date_1</time></th>
                            <th scope="col"><time>date_2</time></th>
                            <th scope="col"><time>date_3</time></th>
                            <th scope="col"><time>date_4</time></th>
                            <th scope="col"><time>date_5</time></th>
                        </tr>
                    </thead>
                    <tr>
                        <td class="spanned" colspan="6">Income</td>
                    </tr>
                    <tr>
                        <td><b>income_1</b></td>
                        <td data-th="date_1">amount</td>
                        <td data-th="date_2">amount</td>
                        <td data-th="date_3">amount</td>
                        <td data-th="date_4">amount</td>
                        <td data-th="date_5">amount</td>
                    </tr>
                    <tr>
                        <td><b>income_2</b></td>
                        <td data-th="date_1">amount</td>
                        <td data-th="date_2">amount</td>
                        <td data-th="date_3">amount</td>
                        <td data-th="date_4">amount</td>
                        <td data-th="date_5">amount</td>
                    </tr>
                    <tr>
                        <td class="spanned" colspan="6">Expense</td>
                    </tr>
                    <tr>
                        <td><b>expense_1</b></td>
                        <td data-th="date_1">amount</td>
                        <td data-th="date_2">amount</td>
                        <td data-th="date_3">amount</td>
                        <td data-th="date_4">amount</td>
                        <td data-th="date_5">amount</td>
                    </tr>
                    <tr>
                        <td><b>expense_2</b></td>
                        <td data-th="date_1">amount</td>
                        <td data-th="date_2">amount</td>
                        <td data-th="date_3">amount</td>
                        <td data-th="date_4">amount</td>
                        <td data-th="date_5">amount</td>
                    </tr>
                    <tr>
                        <td><b>expense_3</b></td>
                        <td data-th="date_1">amount</td>
                        <td data-th="date_2">amount</td>
                        <td data-th="date_3">amount</td>
                        <td data-th="date_4">amount</td>
                        <td data-th="date_5">amount</td>
                    </tr>
                    </td>
                </table>
            </article>
        </main>
    </div>
        `
    }
};

export default Statistics;