let ShortStatisticsPartial = {
    render: (data) => {
        ShortStatisticsPartial.data = data;
        let incomeCard = 0, incomeCash = 0, expenseCard = 0, expenseCash = 0;
        ShortStatisticsPartial.data.forEach(element => {
            if (element.type == "Income") {
                if (element.account == "Card") {
                    incomeCard += Number(element.amount);
                } else {
                    incomeCash += Number(element.amount);
                }
            } else if (element.type == "Expense") {
                if (element.account == "Card") {
                    expenseCard += Number(element.amount);
                } else {
                    expenseCash += Number(element.amount);
                }
            }
        });

        return `
        <ul class="statistics-list">
                <li>
                    <h3>Balance</h3>
                    <ul class="statistics-point-list">
                        <li>
                            <p>Card: ${incomeCard - expenseCard}</p>
                        </li>
                        <li>
                            <p>Cash: ${incomeCash - expenseCash}</p>
                        </li>
                    </ul>
                </li>
                <li>
                    <h3>Income</h3>
                    <ul class="statistics-point-list">
                        <li>
                            <p>Card: ${incomeCard}</p>
                        </li>
                        <li>
                            <p>Cash: ${incomeCash}</p>
                        </li>
                    </ul>
                </li>
                <li>
                    <h3>Expense</h3>
                    <ul class="statistics-point-list">
                        <li>
                            <p>Card: ${expenseCard}</p>
                        </li>
                        <li>
                            <p>Cash: ${expenseCash}</p>
                        </li>
                    </ul>
                </li>
            </ul>
        `
    }
}

export default ShortStatisticsPartial;