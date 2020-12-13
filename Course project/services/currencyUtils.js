let CurrencyUtils = {
    convertToUSD: (amount, currency) => {
        if (typeof amount != "number") {
            amount = Number(amount);
        }
        switch(currency) {
            case "USD":
                return Number(amount.toFixed(2));
            case "EUR":
                return Number((amount * 1.21).toFixed(2));
            case "BYN":
                return Number((amount * 0.39).toFixed(2));
            case "RUB": 
                return Number((amount * 0.014).toFixed(2));
            default:
                return 0;
        }
    },

    getAmountWithCurrency: (amount, currency) => {
        if (typeof(amount) == "number") {
            amount = amount.toFixed(2);
        }
        switch(currency) {
            case "USD":
                return `${amount}$`;
            case "EUR":
                return `${amount}€`;
            case "BYN":
                return `${amount}Br`;
            case "RUB": 
                return `${amount}₽`;
            default:
                return `${amount}`;
        }
    }
}

export default CurrencyUtils;