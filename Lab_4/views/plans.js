import ShortStatisticsPartial from './shortStatisticsPartial.js';
import DatabaseUtils from '../services/databaseUtils.js';
import CurrencyUtils from '../services/currencyUtils.js';

let Plans = {
    render: async (dataPlans, dataStatistics, customCategories) => {
        Plans.data = dataPlans;
        Plans.dataStatistics = dataStatistics;
        Plans.customCategories = customCategories;
        Plans.standartCategories = ["Food", "Transport", "Car", "Entertainment", "Clothes", "House", "Other"];
        return `
        <div class="site-content">
        ${Plans.renderAside()}

        <main class="transactions">
            <h1>Plans</h1>
            <details open>
                <summary>Filters</summary>
                <div class="details-content">
                    <div class="transactions-first-row">
                        <input type="search" class="search search-transaction" name="search"
                        placeholder="Search..." id="search-plans">
                        <ul class="transactions-links">
                            <li>
                                <input type="button" id="recent-button-plans" class="text-like-button" value="Recent" />
                            </li>
                            <li>
                                <input type="button" id="all-button-plans" class="text-like-button" value="All">
                            </li>
                            <li>
                                <a class="in-header" href="#/add_plan"><img src="res/add.png" height="20"
                                        width="20" /></a>
                            </li>
                        </ul>
                    </div>
                    <div class="transactions-second-row plans">
                        <select class="select-type select-type-plans" id="plans-select-type-filter">
                            <option value="hid" selected disabled hidden>Choose type</option>
                            <option>Income</option>
                            <option>Expense</option>
                        </select>
                        ${Plans.renderSelectCategory()}
                    </div>
                </div>
            </details>
            <div>
                <div id="transaction-modal-plans" class="modal">
                    <div class="modal-content">
                        <h2>Description <a class="edit-link">Edit</a><button class="edit-link text-like-button"
                        id="remove-plan-button">Remove</button></h2>
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
                ${Plans.renderTable(Plans.data)}
            </div>
        </main>
    </div>
        `
    },

    afterRender: async () => {
        Plans.setTableEventListeners(Plans.data);

        let selectType = document.getElementById('plans-select-type-filter');
        if (selectType) {
            selectType.addEventListener('change', e => {
                Plans.plansFilter(e, "type", "plans-select-category-filter");
            });
        }

        let selectCategory = document.getElementById('plans-select-category-filter');
        if (selectCategory) {
            selectCategory.addEventListener('change', e => {
                Plans.plansFilter(e, "category", "plans-select-type-filter");
            })
        }

        let search = document.getElementById('search-plans');
        if (search) {
            search.addEventListener('input', Plans.searchPlan);
        }

        let recent = document.getElementById('recent-button-plans');
        if (recent) {
            recent.addEventListener('click', Plans.recentButtonClicked);
        }

        let all = document.getElementById('all-button-plans');
        if (all) {
            all.addEventListener('click', Plans.allButtonClicked);
        }        
    },

    recentButtonClicked: (e) => {
        Plans.hideSelectFilter('plans-select-category-filter');
        Plans.hideSelectFilter('plans-select-type-filter');
        Plans.hideSearch();

        if (Plans.data == null) {
            return;
        }

        let filteredData = [];
        let today = new Date();
        let dateToDays = 1000 * 60 * 60 * 24;
        for (let el of Plans.data) {
            if (Math.abs(new Date(el.date) - today) / dateToDays < 31) {
                filteredData.push(el);
            }
        }

        Plans.replaceTable(filteredData);
        Plans.setTableEventListeners(filteredData);
    },

    allButtonClicked: (e) => {
        Plans.hideSelectFilter('plans-select-category-filter');
        Plans.hideSelectFilter('plans-select-type-filter');
        Plans.hideSearch();

        Plans.replaceTable(Plans.data);
        Plans.setTableEventListeners(Plans.data);
    },

    renderSelectCategory: () => {
        return `
        <select class="select-tag select-tag-plans" id="plans-select-category-filter">
            <option value="hid" selected disabled hidden>Choose category</option>
            <optgroup label="Standart">
                ${Plans.renderStandartOptions()}
                <option value="All">All</option>
            </optgroup>
            <optgroup label="Custom">
                ${Plans.renderCustomOptions(Plans.customCategories)}
            </optgroup>
        </select>
        `
    },

    renderStandartOptions: () => {
        let markup = ``;
        Plans.standartCategories.forEach(category => {
            markup += `<option>${category}</option>`
        })
        return markup;
    },

    renderCustomOptions: () => {
        let markup = ``;
        Plans.customCategories.forEach(category => {
            markup += `<option>${category.name}</option>`
        });
        return markup;
    },

    replaceTable: (data) => {
        let table = document.getElementById('table-plans');
        let tableNew = document.createElement('table');
        tableNew.setAttribute('class', 'table-plans');
        tableNew.setAttribute('id', 'table-plans');
        tableNew.innerHTML = Plans.renderTable(data);
        table.replaceWith(tableNew);
    },

    searchPlan: (e) => {
        let patternString = e.target.value;
        Plans.hideSelectFilter('plans-select-category-filter');
        Plans.hideSelectFilter('plans-select-type-filter');

        if (Plans.data == null) {
            return;
        }

        let filteredData= [];
        for (let el of Plans.data) {
            if (el.description.toLowerCase().search(patternString.toLowerCase()) != -1) {
                filteredData.push(el);
            }
        }

        Plans.replaceTable(filteredData);
        Plans.setTableEventListeners(filteredData);
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
        let search = document.getElementById('search-plans');
        search.value = "";
    },

    plansFilter: (e, param, secondFilterId) => {
        Plans.hideSelectFilter(secondFilterId);
        Plans.hideSearch();

        if (Plans.data == null) {
            return;
        }

        let option = e.target.value;
        let filteredData = [];

        if (option == "All") {
            Plans.replaceTable(Plans.data);
            Plans.setTableEventListeners(Plans.data);
        } else {
            for (let el of Plans.data) {
                if (el[param] == option) {
                    filteredData.push(el);
                }
            }
            Plans.replaceTable(filteredData);
            Plans.setTableEventListeners(filteredData);
        }
    },

    plansButtonClicked: (i) => {
        let divBefore = document.getElementById('transaction-modal-plans');
        let newModalWindow = document.createElement('div');
        newModalWindow.setAttribute('class', "modal");
        newModalWindow.setAttribute('id', 'transaction-modal-plans');

        let modal = `
        <div class="modal-content">
            <span class="close-modal" id="close-modal-${i}">&times;</span>
            <h2>${Plans.data[i].description}<a class="edit-link" href="#/edit_plan/:${i}" id="edit-plan-${i}">Edit</a>
                                            <button class="edit-link text-like-button" id="remove-plan-${i}">Remove</button></h2>
            <img src="${Plans.data[i].imageUrl}" style="height: 200px;">
            <ul class="modal-ul">
                <li>Date: ${Plans.data[i].date}</li>
                <li>Type: ${Plans.data[i].type}</li>
                <li>Amount: ${CurrencyUtils.getAmountWithCurrency(Plans.data[i].amount, Plans.data[i].currency)}</li>
                <li>Category: ${Plans.data[i].category}</li>
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

        let deleteButton = document.getElementById(`remove-plan-${i}`);
        if (deleteButton) {
            deleteButton.addEventListener('click', (e) => {
                Plans.plansDelete(i)
            })
        }
    },

    plansDelete: (i) => {
        let uid = auth.currentUser.uid;
        if (confirm("Do you really want to delete this plan?")) {
            DatabaseUtils.deletePlan(i, uid);
            let modalWindow = document.getElementById('transaction-modal-plans');
            modalWindow.style.display = "none";

            Plans.rerenderTableFromDatabase(uid);
        }
    },

    rerenderTableFromDatabase: (uid) => {
        db.ref('plans/' + uid).once('value').then((snapshot) => {
            let plansData = snapshot.val();

            if (!plansData) {
                return;
            }

            let keys = Object.keys(plansData);
            for (let key of keys) {
                plansData[key].key = key;
            }

            Plans.data = Object.values(plansData);
            Plans.replaceTable(Plans.data);
            Plans.setTableEventListeners(Plans.data);
        })
    },

    setTableEventListeners: (data) => {
        if (data == null) {
            return;
        }
        
        for (let elem of data) {
            let i = elem.key;
            let button = document.getElementById(`plans-button-${i}`);
            if (button) {
                button.addEventListener('click', () => {
                    Plans.plansButtonClicked(i);
                })
            }
        }
    },

    renderTable: (data) => {
        if (data == null) {
            return `
            <table class="table-plans" id="table-plans">
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
        <table class="table-plans" id="table-plans">
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Description</th>
                    <th scope="col">Amount</th>
                    </tr>
            </thead>
            <tbody>
                ${Plans.renderTableContent(data)}
            </tbody>
        </table>
        `
    },

    renderTableContent: (data) => {
        let markup = ``;
        data.forEach(element => {
            markup += Plans.renderTR(element);
        });
        return markup;
    },

    renderTR: (element) => {
        return `
        <tr>
            <td data-th="Date"><time>${element.date}</time></td>
            <td data-th="Description">
                <button class="text-like-button in-table open-modal" id="plans-button-${element.key}">${element.description}</button>
            </td>
            <td data-th="Amount">${CurrencyUtils.getAmountWithCurrency(element.amount, element.currency)}</td>
        </tr>
        `
    },

    renderAside: () => {
        if (Plans.data == null) {
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
                ${ShortStatisticsPartial.render(Plans.dataStatistics)}
        </aside>
        `
    },
};

export default Plans;