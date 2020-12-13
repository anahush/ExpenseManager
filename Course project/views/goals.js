import ShortStatisticsPartial from './shortStatisticsPartial.js';
import DatabaseUtils from '../services/databaseUtils.js';
import CurrencyUtils from '../services/currencyUtils.js';
import CSVUtils from "../services/csvUtils.js";


let Goals = {
    render: async (dataGoals, dataStatistics, customCategories) => {
        Goals.data = dataGoals;
        Goals.dataStatistics = dataStatistics;
        Goals.customCategories = customCategories;

        Goals.standartCategories = ["Food", "Transport", "Car", "Entertainment", "Clothes", "House", "Other"];

        return `
        <div class="site-content">
        ${Goals.renderAside()}

        <main class="transactions">
            <h1>Goals</h1>
            <details open>
                <summary>Filters</summary>
                <div class="details-content">
                    <div class="transactions-first-row">
                        <input type="search" class="search search-transaction" name="search"
                        id="search-goals" placeholder="Search...">
                        <ul class="transactions-links">
                            <li>
                                <input type="button" id="recent-button-goals" class="text-like-button" value="Recent" />
                            </li>
                            <li>
                                <input type="button" id="all-button-goals" class="text-like-button" value="All">
                            </li>
                            <li>
                                <a class="in-header" href="#/add_goal"><img src="res/add.png" height="20"
                                        width="20" /></a>
                            </li>
                        </ul>
                    </div>
                    <div class="transactions-second-row plans">
                        <select class="select-type select-type-plans" id="goals-select-type-filter">
                            <option value="hid" selected disabled hidden>Choose type</option>
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                            <option value="All">All</option>
                        </select>
                        ${Goals.renderSelectCategory()}
                    </div>
                    <button class="text-like-button download-button" id="download-csv">Download table as csv</button>
                </div>
            </details>
            <div>
                <div id="transactionModal" class="modal">
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <h2>Description <a class="edit-link">Edit</a><button class="edit-link text-like-button"
                                                                            id="remove-goal-button">Remove</button></h2>
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
                        <span class="close-modal-add" id="close-modal-add">&times;</span>
                        <h2>Add/remove</h2>
                        <form class="transaction-form" id="add-remove-goal">
                            <div class="wrap-input validate-input" data-validate="Amount is required">
                                <label class="label-input" for="amount-goals-modal">Amount</label>
                                <input class="input input-form" id="amount-goals-modal" type="number" name="amount"
                                    placeholder="Enter amount">
                                <span class="focus-input"></span>
                            </div>
                            <div class="modal-submit-wrapper">
                                <input type="submit" value="Submit" name="Submit" class="transaction-submit">
                            </div>
                        </form>
                    </div>
                </div>
                <table class="table-plans" id="table-goals">
                    ${Goals.renderTable(Goals.data)}
                </table>
            </div>
        </main>
    </div>
        `
    },

    afterRender: () => {
        Goals.setTableEventListeners(Goals.data);

        let selectType = document.getElementById('goals-select-type-filter');
        if (selectType) {
            selectType.addEventListener('change', e => {
                Goals.goalsFilter(e, "type", "goals-select-category-filter");
            });
        }

        let selectCategory = document.getElementById('goals-select-category-filter');
        if (selectCategory) {
            selectCategory.addEventListener('change', e => {
                Goals.goalsFilter(e, "category", "goals-select-type-filter");
            })
        }

        let search = document.getElementById('search-goals');
        if (search) {
            search.addEventListener('input', Goals.searchGoal);
        }

        let recent = document.getElementById('recent-button-goals');
        if (recent) {
            recent.addEventListener('click', Goals.recentButtonClicked);
        }

        let all = document.getElementById('all-button-goals');
        if (all) {
            all.addEventListener('click', Goals.allButtonClicked);
        }

        let buttonDownload = document.getElementById("download-csv");
        if (buttonDownload != null) {
            buttonDownload.addEventListener('click', () => {
                CSVUtils.exportTableToCSV("goals.csv")
            })
        }
    },

    recentButtonClicked: (e) => {
        Goals.hideSelectFilter('goals-select-category-filter');
        Goals.hideSelectFilter('goals-select-type-filter');
        Goals.hideSearch();

        if (Goals.data == null) {
            return;
        }

        let filteredData = [];
        let today = new Date();
        let dateToDays = 1000 * 60 * 60 * 24;
        for (let el of Goals.data) {
            if (Math.abs(new Date(el.due) - today) / dateToDays < 31) {
                filteredData.push(el);
            }
        }

        Goals.replaceTable(filteredData);
        Goals.setTableEventListeners(filteredData);
    },

    allButtonClicked: (e) => {
        Goals.hideSelectFilter('goals-select-category-filter');
        Goals.hideSelectFilter('goals-select-type-filter');
        Goals.hideSearch();

        Goals.replaceTable(Goals.data);
        Goals.setTableEventListeners(Goals.data);
    },

    renderSelectCategory: () => {
        return `
        <select class="select-tag select-tag-plans" id="goals-select-category-filter">
            <option value="hid" selected disabled hidden>Choose category</option>
            <optgroup label="Standart">
                ${Goals.renderStandartOptions()}
                <option value="All">All</option>
            </optgroup>
            <optgroup label="Custom">
                ${Goals.renderCustomOptions(Goals.customCategories)}
            </optgroup>
        </select>
        `
    },

    renderStandartOptions: () => {
        let markup = ``;
        Goals.standartCategories.forEach(category => {
            markup += `<option>${category}</option>`
        })
        return markup;
    },

    renderCustomOptions: () => {
        let markup = ``;
        Goals.customCategories.forEach(category => {
            markup += `<option>${category.name}</option>`
        });
        return markup;
    },

    replaceTable: (data) => {
        let table = document.getElementById('table-goals');
        let tableNew = document.createElement('table');
        tableNew.setAttribute('class', 'table-plans');
        tableNew.setAttribute('id', 'table-goals');
        tableNew.innerHTML = Goals.renderTable(data);
        table.replaceWith(tableNew);
    },

    searchGoal: (e) => {
        let patternString = e.target.value;
        Goals.hideSelectFilter('goals-select-category-filter');
        Goals.hideSelectFilter('goals-select-type-filter');

        if (Goals.data == null) {
            return;
        }

        let filteredData = [];
        for (let el of Goals.data) {
            if (el.description.toLowerCase().search(patternString.toLowerCase()) != -1) {
                filteredData.push(el);
            }
        }

        Goals.replaceTable(filteredData);
        Goals.setTableEventListeners(filteredData);
    },

    hideSelectFilter: (filterId) => {
        let filter = document.getElementById(filterId);
        let options = filter.options;
        for (let option, i = 0; option = options[i]; i++) {
            if (option.value == "hid") {
                options.selectedIndex = i;
                break;
            }
        }
    },

    hideSearch: () => {
        let search = document.getElementById('search-goals');
        search.value = "";
    },

    goalsFilter: (e, param, secondFilterId) => {
        Goals.hideSelectFilter(secondFilterId);
        Goals.hideSearch();

        if (Goals.data == null) {
            return;
        }

        let option = e.target.value;
        let filteredData = [];

        if (option == "All") {
            Goals.replaceTable(Goals.data);
            Goals.setTableEventListeners(Goals.data)
        } else {
            for (let el of Goals.data) {
                if (el[param] == option) {
                    filteredData.push(el);
                }
            }
            Goals.replaceTable(filteredData);
            Goals.setTableEventListeners(filteredData)
        }
    },

    goalsButtonClicked: (i) => {
        let divBefore = document.getElementById('transactionModal');
        let newModalWindow = document.createElement('div');
        newModalWindow.setAttribute('class', "modal");
        newModalWindow.setAttribute('id', "transactionModal");

        let modal = `
        <div class="modal-content">
            <span class="close-modal" id="close-modal-${i}">&times;</span>
            <h2>${Goals.data[i].description}<a class="edit-link" href="#/edit_goal/:${i}" id="edit-goal-${i}">Edit</a>
                                            <button class="edit-link text-like-button" id="remove-goal-${i}">Remove</button></h2>
            <img src="${Goals.data[i].imageUrl}" style="height: 200px;">
            <ul class="modal-ul">
                <li>Due: ${Goals.data[i].due}</li>
                <li>Type: ${Goals.data[i].type}</li>
                <li>Contributed: ${CurrencyUtils.getAmountWithCurrency(Goals.data[i].contributed ? Goals.data[i].contributed : "0", Goals.data[i].currency)}</li>
                <li>Left: ${CurrencyUtils.getAmountWithCurrency(Goals.data[i].contributed ? Number(Goals.data[i].amount) - Number(Goals.data[i].contributed) : "0")}</li>
                <li>Category: ${Goals.data[i].category}</li>
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

        let deleteButton = document.getElementById(`remove-goal-${i}`);
        if (deleteButton) {
            deleteButton.addEventListener('click', (e) => {
                Goals.goalsDelete(i)
            })
        }
    },

    goalsDelete: (i) => {
        let uid = auth.currentUser.uid;
        if (confirm("Do you really want to delete this goal?")) {
            DatabaseUtils.deleteGoal(i, uid);
            let modalWindow = document.getElementById('transactionModal');
            modalWindow.style.display = "none";

            Goals.rerenderTableFromDatabase(uid);
        }
    },

    rerenderTableFromDatabase: (uid) => {
        db.ref('goals/' + uid).once('value').then((snapshot) => {
            let goalsData = snapshot.val();

            if (!goalsData) {
                return;
            }

            let keys = Object.keys(goalsData);
            for (let key of keys) {
                goalsData[key].key = key;
            }

            Goals.data = Object.values(goalsData);
            Goals.replaceTable(Goals.data);
            Goals.setTableEventListeners(Goals.data)
        })
    },

    goalsAddRemoveButtonClicked: (i) => {
        let divModal = document.getElementById('addToGoalsModal');
        divModal.style.display = "block";
        let closeModal = document.getElementById('close-modal-add');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                divModal.style.display = "none";
            });
            window.onclick = (event) => {
                if (event.target == divModal) {
                    divModal.style.display = "none";
                }
            }
        }

        let formAddRemoveGoal = document.getElementById('add-remove-goal');
        formAddRemoveGoal.removeEventListener('submit', Goals.submitAddRemoveClicked);
        formAddRemoveGoal.addEventListener('submit', Goals.submitAddRemoveClicked);
        formAddRemoveGoal.i = i;
    },

    submitAddRemoveClicked: (e) => {
        e.preventDefault();
        let uid = auth.currentUser.uid;
        let amount = e.currentTarget['amount-goals-modal'].value;
        DatabaseUtils.addRemoveData(e.currentTarget.i, amount,
            Goals.data[e.currentTarget.i].contributed, uid);

        let divModal = document.getElementById('addToGoalsModal');
        divModal.style.display = "none";

        Goals.rerenderTableFromDatabase(uid);
    },

    setTableEventListeners: (data) => {
        if (data == null) {
            return;
        }

        for (let elem of data) {
            let i = elem.key;
            let buttonAddRemove = document.getElementById(`goals-add-remove-${i}`);
            if (buttonAddRemove) {
                buttonAddRemove.addEventListener('click', () => {
                    Goals.goalsAddRemoveButtonClicked(i);
                })
            }

            let button = document.getElementById(`goals-button-${i}`);
            if (button) {
                button.addEventListener('click', () => {
                    Goals.goalsButtonClicked(i);
                })
            }
        }
    },

    renderTable: (data) => {
        if (data == null) {
            return `
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
            </tbody>
            `
        }
        return `
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
            ${Goals.renderTableContent(data)}
            </tbody>
        `
    },

    renderTableContent: (data) => {
        let markup = ``;
        data.forEach(element => {
            markup += Goals.renderTR(element);
        });
        return markup;
    },

    renderTR: (element) => {
        let i = element.key;
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
                <button class="text-like-button in-table open-modal" id="goals-button-${i}">${element.description}</button>
            </td>
            <td data-th="Contributed">${CurrencyUtils.getAmountWithCurrency(element.contributed, element.currency)}</td>
            <td data-th="Left">${CurrencyUtils.getAmountWithCurrency(left, element.currency)}</td>
            <td data-th="Add/Remove">
                <button class="text-like-button in-header open-modal-add" id="goals-add-remove-${i}"><img src="res/add.png"/></a>
            </td>
        </tr>
        `
    },

    renderAside: () => {
        if (Goals.dataStatistics == null) {
            return `
            <aside>
            <h2>Short statistics</h2>
                ${ShortStatisticsPartial.render([{ type: "Income", amount: "0", currency: "USD" }, { type: "Expense", amount: "0", currency: "USD" }])}
            </aside>

            `
        }
        return `
        <aside>
            <h2>Short statistics</h2>
                ${ShortStatisticsPartial.render(Goals.dataStatistics)}
        </aside>
        `
    },
};

export default Goals;