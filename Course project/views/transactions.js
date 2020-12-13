import ShortStatisticsPartial from "./shortStatisticsPartial.js";
import DatabaseUtils from "../services/databaseUtils.js";
import CurrencyUtils from "../services/currencyUtils.js";
import CSVUtils from "../services/csvUtils.js";


let Transactions = {
    render: async (data, customCategories) => {
        Transactions.data = data;
        Transactions.customCategories = customCategories;
        Transactions.standartCategories = ["Food", "Transport", "Car", "Entertainment", "Clothes", "House", "Other"];
        return `
        <div class="site-content">
        ${Transactions.renderAside()}

        <main class="transactions">
            <h1>Transactions</h1>
            <details open>
                <summary>Filters</summary>
                <div class="details-content">
                    <div class="transactions-first-row transactions">
                        <input type="search" class="search search-transaction" name="search"
                        placeholder="Search..." id="search-transactions">
                        <ul class="transactions-links">
                            <li>
                                <input type="button" id="recent-button-transactions" class="text-like-button" value="Recent" />
                            </li>
                            <li>
                                <input type="button" id="all-button-transactions" class="text-like-button" value="All">
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
                        ${Transactions.renderSelectCategory()}
                    </div>
                    <button class="text-like-button download-button" id="download-csv">Download table as csv</button>
                </div>
            </details>
            <div>
                <div class="modal" id="modal-transactions">
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
                ${Transactions.renderTable(Transactions.data)}
            </div>
        </main>
    </div>
        `
    },

    afterRender: async () => {
        Transactions.setTableEventListeners(Transactions.data);

        let selectCategory = document.getElementById('transactions-select-category-filter');
        if (selectCategory) {
            selectCategory.addEventListener('change', Transactions.transactionsFilter);
        }

        let search = document.getElementById('search-transactions');
        if (search) {
            search.addEventListener('input', Transactions.searchTransaction);
        }

        let recent = document.getElementById('recent-button-transactions');
        if (recent) {
            recent.addEventListener('click', Transactions.recentButtonClicked);
        }

        let all = document.getElementById('all-button-transactions');
        if (all) {
            all.addEventListener('click', Transactions.allButtonClicked);
        }

        let dateMin = document.getElementById('from-transactions');
        if (dateMin) {
            dateMin.addEventListener('change', (e) => {
                Transactions.minimumDateSelected(e.target.value);
            });
        }

        let dateMax = document.getElementById('to-transactions');
        if (dateMax) {
            dateMax.addEventListener('change', (e) => {
                Transactions.maximumDateSelected(e.target.value);
            });
        }

        let buttonDownload = document.getElementById("download-csv");
        if (buttonDownload != null) {
            buttonDownload.addEventListener('click', () => {
                CSVUtils.exportTableToCSV("transactions.csv")
            })
        }
    },

    recentButtonClicked: (e) => {
        Transactions.hideSelectFilter();
        Transactions.hideSearch();
        Transactions.hideDates();

        if (Transactions.data == null) {
            return;
        }

        let filteredData = [];
        let today = new Date();
        let dateToDays = 1000 * 60 * 60 * 24;
        for (let el of Transactions.data) {
            if (Math.abs(new Date(el.date) - today) / dateToDays < 31) {
                filteredData.push(el);
            }
        }

        Transactions.replaceTable(filteredData);
        Transactions.setTableEventListeners(filteredData);
    },

    allButtonClicked: (e) => {
        Transactions.hideSelectFilter();
        Transactions.hideSearch();
        Transactions.hideDates();

        Transactions.replaceTable(Transactions.data);
        Transactions.setTableEventListeners(Transactions.data);
    },

    renderSelectCategory: () => {
        return `
        <select class="select-tag select-tag-transactions" id="transactions-select-category-filter">
            <option value="hid" selected disabled hidden>Choose category</option>
            <optgroup label="Standart">
                ${Transactions.renderStandartOptions()}
                <option value="All">All</option>
            </optgroup>
            <optgroup label="Custom">
                ${Transactions.renderCustomOptions(Transactions.customCategories)}
            </optgroup>
        </select>
        `
    },

    renderStandartOptions: () => {
        let markup = ``;
        Transactions.standartCategories.forEach(category => {
            markup += `<option>${category}</option>`
        })
        return markup;
    },

    renderCustomOptions: () => {
        let markup = ``;
        Transactions.customCategories.forEach(category => {
            markup += `<option>${category.name}</option>`
        });
        return markup;
    },

    replaceTable: (data) => {
        let table = document.getElementById('table-statistics');
        let tableNew = document.createElement('table');
        tableNew.setAttribute('class', 'table-transactions');
        tableNew.setAttribute('id', 'table-statistics');
        tableNew.innerHTML = Transactions.renderTable(data);
        table.replaceWith(tableNew);
    },

    replaceAside: () => {
        let aside = document.getElementById('aside-transactions');
        let asideNew = document.createElement('aside');
        asideNew.setAttribute('id', 'aside-transactions');
        let data = Transactions.data != null ? Transactions.data : [{ type: "Income", amount: "0", currency: "USD" }, { type: "Expense", amount: "0", currency: "USD" }];
        asideNew.innerHTML = Transactions.renderAsideContent(data);
        aside.replaceWith(asideNew);
    },

    minimumDateSelected: (minDate) => {
        Transactions.hideSearch();
        Transactions.hideSelectFilter();

        if (Transactions.data == null) {
            return;
        }

        let maxDateInput = document.getElementById('to-transactions');
        let maxDate = maxDateInput.value;
        if (maxDate != "") {
            if (minDate != "") {
                Transactions.twoDatesSelected(minDate, maxDate);
            } else {
                Transactions.maximumDateSelected(maxDate);
            }
            return;
        } else if (minDate == "") {
            Transactions.replaceTable(Transactions.data);
            Transactions.setTableEventListeners(Transactions.data);
            return;
        }

        let filteredData = [];
        minDate = new Date(minDate);
        for (let el of Transactions.data) {
            if (new Date(el.date) >= minDate) {
                filteredData.push(el);
            }
        }
        Transactions.replaceTable(filteredData);
        Transactions.setTableEventListeners(filteredData);
    },

    maximumDateSelected: (maxDate) => {
        Transactions.hideSearch();
        Transactions.hideSelectFilter();

        if (Transactions.data == null) {
            return;
        }

        let minDateInput = document.getElementById('from-transactions');
        let minDate = minDateInput.value;
        if (minDate != "") {
            if (maxDate != "") {
                Transactions.twoDatesSelected(minDate, maxDate);
            } else {
                Transactions.minimumDateSelected(minDate);
            }
            return;
        } else if (maxDate == "") {
            Transactions.replaceTable(Transactions.data);
            Transactions.setTableEventListeners(Transactions.data);
            return;
        }

        let filteredData = [];
        maxDate = new Date(maxDate);
        for (let el of Transactions.data) {
            if (new Date(el.date) <= maxDate) {
                filteredData.push(el);
            }
        }
        Transactions.replaceTable(filteredData);
        Transactions.setTableEventListeners(filteredData);
    },

    twoDatesSelected: (min, max) => {
        let minDate = new Date(min);
        let maxDate = new Date(max);

        let filteredData = [];

        for (let el of Transactions.data) {
            let dateCur = new Date(el.date);
            if (dateCur >= minDate && dateCur <= maxDate) {
                filteredData.push(el);
            }
        }
        Transactions.replaceTable(filteredData);
        Transactions.setTableEventListeners(filteredData);
    },

    searchTransaction: (e) => {
        let patternString = e.target.value;
        Transactions.hideSelectFilter();
        Transactions.hideDates();

        if (Transactions.data == null) {
            return;
        }

        let filteredData = [];
        for (let el of Transactions.data) {
            if (el.description.toLowerCase().search(patternString.toLowerCase()) != -1) {
                filteredData.push(el);
            }
        }

        Transactions.replaceTable(filteredData);
        Transactions.setTableEventListeners(filteredData);
    },

    hideSelectFilter: () => {
        let filter = document.getElementById('transactions-select-category-filter');
        let options = filter.options;
        for (let option, i = 0; option = options[i]; i++) {
            if (option.value == "hid") {
                options.selectedIndex = i;
                break;
            }
        }
    },

    hideDates: () => {
        let minDateInput = document.getElementById('from-transactions');
        let maxDateInput = document.getElementById('to-transactions');
        minDateInput.value = "";
        maxDateInput.value = "";
    },

    hideSearch: () => {
        let search = document.getElementById('search-transactions');
        search.value = "";
    },

    transactionsFilter: (e) => {
        Transactions.hideSearch();
        Transactions.hideDates();

        if (Transactions.data == null) {
            return;
        }

        let option = e.target.value;
        let filteredData = [];

        if (option == "All") {
            Transactions.replaceTable(Transactions.data);
            Transactions.setTableEventListeners(Transactions.data);
        } else {
            for (let el of Transactions.data) {
                if (el.category == option) {
                    filteredData.push(el);
                }
            }
            Transactions.replaceTable(filteredData);
            Transactions.setTableEventListeners(filteredData);
        }
    },

    transactionsButtonClicked: (i) => {
        let divBefore = document.getElementById('modal-transactions');
        let newModalWindow = document.createElement('div');
        newModalWindow.setAttribute('class', "modal");
        newModalWindow.setAttribute('id', 'modal-transactions');

        let modal = `
        <div class="modal-content">
            <span class="close-modal" id="close-modal-${i}">&times;</span>
            <h2>${Transactions.data[i].description}<a class="edit-link" href="#/edit_transaction/:${i}" id="edit-transaction-${i}">Edit</a>
            <button class="edit-link text-like-button" id="remove-transaction-${i}">Remove</button></h2>
            <img src="${Transactions.data[i].imageUrl}" style="height: 100px;">
            <ul class="modal-ul">
                <li>Date: ${Transactions.data[i].date}</li>
                <li>Place: ${Transactions.data[i].place}</li>
                <li>Amount: ${CurrencyUtils.getAmountWithCurrency(Transactions.data[i].amount, Transactions.data[i].currency)}</li>
                <li>Category: ${Transactions.data[i].category}</li>
            </ul>
        </div>
        `

        newModalWindow.innerHTML = modal;
        divBefore.replaceWith(newModalWindow);
        newModalWindow.style.display = "block";

        let closeModal = document.getElementById(`close-modal-${i}`);
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                newModalWindow.style.display = "none";
            });
            window.onclick = (event) => {
                if (event.target == newModalWindow) {
                    newModalWindow.style.display = "none";
                }
            }
        }

        let deleteButton = document.getElementById(`remove-transaction-${i}`);
        if (deleteButton) {
            deleteButton.addEventListener('click', (e) => {
                Transactions.transactionsDelete(i)
            })
        }
    },

    transactionsDelete: (i) => {
        let uid = auth.currentUser.uid;
        if (confirm("Do you really want to delete this transaction?")) {
            DatabaseUtils.deleteTransaction(i, uid);
            let modalWindow = document.getElementById('modal-transactions');
            modalWindow.style.display = "none";

            Transactions.rerenderTableFromDatabase(uid);        }
    },

    rerenderTableFromDatabase: (uid) => {
        db.ref('transactions/' + uid).once('value').then((snapshot) => {
            let transactionsData = snapshot.val();

            if (!transactionsData) {
                return;
            }

            let keys = Object.keys(transactionsData);
            for (let key of keys) {
                transactionsData[key].key = key;
            }

            Transactions.data = Object.values(transactionsData);
            Transactions.replaceTable(Transactions.data);
            Transactions.setTableEventListeners(Transactions.data);
            Transactions.replaceAside();
        });
    },

    setTableEventListeners: (data) => {
        if (data == null) {
            return;
        }

        for (let elem of data) {
            let i = elem.key;
            let button = document.getElementById(`transactions-button-${i}`);
            if (button) {
                button.addEventListener('click', () => {
                    Transactions.transactionsButtonClicked(i);
                })
            }
        }
    },

    renderTable: (data) => {
        if (data == null) {
            return `
            <table class="table-transactions" id="table-statistics">
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Description</th>
                        <th scope="col">Amount</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            `
        }
        return `
        <table class="table-transactions" id="table-statistics">
           <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Description</th>
                    <th scope="col">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${Transactions.renderTableContent(data)}
            </tbody>
        </table>
        `
    },

    renderTableContent: (data) => {
        let markup = ``;
        data.forEach(element => {
            markup += Transactions.renderTR(element);
        });
        return markup;
    },

    renderTR: (element) => {
        return `
        <tr>
            <td data-th="Date"><time>${element.date}</time></td>
            <td data-th="Description">
                <button class="text-like-button open-modal" id="transactions-button-${element.key}">${element.description}</button>
            </td>
            <td data-th="Amount">${CurrencyUtils.getAmountWithCurrency(element.amount, element.currency)}</td>
        </tr>
        `
    },

    renderAside: () => {
        if (Transactions.data == null) {
            return `
            <aside id="aside-transactions">
            ${Transactions.renderAsideContent([{ type: "Income", amount: "0", currency: "USD" }, { type: "Expense", amount: "0", currency: "USD" }])}
            </aside>

            `
        }
        return `
        <aside id="aside-transactions">
            ${Transactions.renderAsideContent(Transactions.data)}
        </aside>
        `
    },

    renderAsideContent: (data) => {
        return `
        <h2>Short statistics</h2>
        ${ShortStatisticsPartial.render(data)}
        `
    }
};

export default Transactions;