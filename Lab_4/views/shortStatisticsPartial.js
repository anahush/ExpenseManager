import CurrencyUtils from "../services/currencyUtils.js";

let ShortStatisticsPartial = {
    render: (data) => {
        ShortStatisticsPartial.data = data;
        let incomeCard = 0, incomeCash = 0, expenseCard = 0, expenseCash = 0;
        ShortStatisticsPartial.data.forEach(element => {
            let amountUSD = CurrencyUtils.convertToUSD(Number(element.amount), element.currency);
            if (element.type == "Income") {
                if (element.account == "Card") {
                    incomeCard += amountUSD;
                } else {
                    incomeCash += amountUSD;
                }
            } else if (element.type == "Expense") {
                if (element.account == "Card") {
                    expenseCard += amountUSD;
                } else {
                    expenseCash += amountUSD;
                }
            }
        });

        return `
        <ul class="statistics-list" id='statistics-list'>
                <li>
                    <h3>Balance</h3>
                    <ul class="statistics-point-list">
                        <li>
                            <p>Card: ${CurrencyUtils.getAmountWithCurrency(incomeCard - expenseCard, "USD")}</p>
                        </li>
                        <li>
                            <p>Cash: ${CurrencyUtils.getAmountWithCurrency(incomeCash - expenseCash, "USD")}</p>
                        </li>
                    </ul>
                </li>
                <li>
                    <h3>Income</h3>
                    <ul class="statistics-point-list">
                        <li>
                            <p>Card: ${CurrencyUtils.getAmountWithCurrency(Number(incomeCard), "USD")}</p>
                        </li>
                        <li>
                            <p>Cash: ${CurrencyUtils.getAmountWithCurrency(Number(incomeCash), "USD")}</p>
                        </li>
                    </ul>
                </li>
                <li>
                    <h3>Expense</h3>
                    <ul class="statistics-point-list">
                        <li>
                            <p>Card: ${CurrencyUtils.getAmountWithCurrency(Number(expenseCard), "USD")}</p>
                        </li>
                        <li>
                            <p>Cash: ${CurrencyUtils.getAmountWithCurrency(Number(expenseCash), "USD")}</p>
                        </li>
                    </ul>
                </li>
            </ul>
        `
    }
}

export default ShortStatisticsPartial;