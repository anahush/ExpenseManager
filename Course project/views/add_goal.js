import DateTimeConvertUtils from "../services/dateTimeConvertUtils.js";
import DatabaseUtils from '../services/databaseUtils.js';
import ShortStatisticsPartial from "./shortStatisticsPartial.js";
import CurrencyUtils from "../services/currencyUtils.js";

let AddGoal = {
    render: async (dataStatistics, dataChange, customCategories, id, status) => {
        AddGoal.dataStatistics = dataStatistics;
        AddGoal.customCategories = customCategories;
        AddGoal.dataChange = dataChange;
        AddGoal.idChange = id;
        AddGoal.status = status;

        AddGoal.standartCategories = ["Food", "Transport", "Car", "Entertainment", "Clothes", "House", "Other"];

        return `
        <div class="site-content">
        ${AddGoal.renderAside()}

        <main class="add-transaction">
            <div class="container-transaction">
                <div class="wrap-transaction">
                    <form class='transaction-form' id="add-goal-form">
                        <div class="wrap-input validate-input" data-validate="Description is required">
                            <label class="label-input" for="description-goal">Description</label>
                            <input class="input input-form" type="text" id="description-goal" name="description"
                                placeholder="Enter description" value="${AddGoal.getEditField("description")}" required>
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input validate-input" data-validate="Amount is required">
                            <label class="label-input" for="amount-goal">Amount</label>
                            <input class="input input-form" id="amount-goal" type="number" name="amount"
                                placeholder="Enter amount" value="${AddGoal.getEditField("amount")}" required>
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="type-goal">Type</label>
                            <div>
                                ${AddGoal.renderDefaultTypeSelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="currency-goal">Currency</label>
                            <div>
                                ${AddGoal.renderDefaultCurrencySelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="category-goal">Category</label>
                            <div>
                                ${AddGoal.renderDefaultCategorySelect()}
                            </div>
                        </div>
                        <div class="wrap-input add-option" id="add-option-wrapper">
                            <label class="label-input" for="add-option">Add option</label>
                            <input class="input input-form" id="add-option" type="text" placeholder="Input option name">
                            <Br><input id="save-option" type="checkbox">Save option<Br>
                        </div>
                        <div class="wrap-input input-date">
                            <label class="label-input" for="due-goal">Due</label>
                            <input class="input date-input" id="due-goal" type="date" name="due" 
                            value="${AddGoal.getEditField("due")}" required>
                        </div>
                        <div class="wrap-input">
                            <label class="label-input" for="image-goal">Image</label>
                            <input class="input-file" type="file" id="image-goal" name="image" class="input-file"
                                placeholder="Upload image">
                            <label for="image-goal" class="btn btn-tertiary js-labelFile" id="button-input-file">
                                <img class="upload" src="res/upload.png">
                                <span class="js-fileName" id="file-name">Загрузить файл</span>
                            </label>
                        </div>
                        <div class="buttons">
                            <input type="submit" name="Submit" class="transaction-submit">
                            <a class="transaction-submit cancel" href="#/transactions">Cancel</a>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
        `
    },

    afterRender: async () => {
        const formGoal = document.querySelector('#add-goal-form');
        let userID = auth.currentUser.uid;
        let fileUpload = document.getElementById("image-goal");
        let currentTime = DateTimeConvertUtils.convert();
        let categorySelect = document.getElementById('category-goal');

        let key;
        if (AddGoal.status == "edit") {
            key = AddGoal.idChange;
        } else {
            key = 0;
            db.ref('goals/' + userID + "/").limitToLast(1).once("value").then((snapshot) => {
                let val = snapshot.val();
                if (val == null || typeof val == "undefined") {
                    return;
                }
                let lastKey = Number(Object.keys(val)[0]);
                if (lastKey != null && typeof lastKey != "undefined" && lastKey >= 0) {
                    key = lastKey + 1;
                }
            })
        }

        fileUpload.addEventListener('change', () => {
            let buttonFileInput = document.getElementById('button-input-file');
            if (buttonFileInput) {
                buttonFileInput.style.color = "green";
                buttonFileInput.style.border = "2px solid green";
                let spanPrevious = document.getElementById('file-name');
                let spanFileName = document.createElement('span');
                spanFileName.setAttribute('class', 'js-fileName');
                spanFileName.setAttribute('id', 'file-name');
                spanFileName.innerHTML = fileUpload.files[0].name;
                spanPrevious.replaceWith(spanFileName);
            }
        })

        formGoal.addEventListener('submit', e => {
            e.preventDefault();
            let files = fileUpload.files;
            if (files.length == 0) {
                if (AddGoal.status == "add") {
                    alert("Picture was not selected. Default picture will be used instead.");
                    let downloadURL = "https://www.shareicon.net/data/512x512/2015/11/20/675119_sign_512x512.png";
                    AddGoal.sendFormData(formGoal, downloadURL, userID, key);
                } else {
                    alert("Picture was not changed.");
                    AddGoal.sendFormData(formGoal, null, userID, key);
                }
                return false;
            }

            var storageRef = storage.ref().child("images/" + userID + "/" + currentTime);
            let uploadTask = storageRef.put(files[0]);
            uploadTask.on('state_changed', function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log('File available at ', downloadURL);
                    AddGoal.sendFormData(formGoal, downloadURL, userID, key);
                })
            })
        })

        categorySelect.addEventListener('change', e => {
            let categoryWrapper = document.getElementById('add-option-wrapper');
            if (e.target.value == "Other") {
                categoryWrapper.style.display = "block";
                AddGoal.categoryOther = true;
            } else {
                categoryWrapper.style.display = "none";
                AddGoal.categoryOther = false;
            }
        });
    },

    getEditField: (field) => {
        if (AddGoal.status == "edit" && AddGoal.dataChange) {
            return AddGoal.dataChange[field];
        }
        return "";
    },

    renderDefaultTypeSelect: () => {
        if (AddGoal.dataChange) {
            return `
        <select class="select-transaction" id="type-goal" name="type">
            <option ${AddGoal.selectedCompare(AddGoal.dataChange.type, "Income")}>Income</option>
            <option ${AddGoal.selectedCompare(AddGoal.dataChange.type, "Expense")}>Expense</option>
        </select>
        `
        } else {
            return `
            <select class="select-transaction" id="type-goal" name="type">
            <option>Income</option>
            <option>Expense</option>
        </select>
            `
        }
    },

    renderDefaultCurrencySelect: () => {
        if (AddGoal.dataChange) {
            return `
            <select class="select-transaction" id="currency-goal" name="currency">
                <option ${AddGoal.selectedCompare(AddGoal.dataChange.currency, "USD")}>USD</option>
                <option ${AddGoal.selectedCompare(AddGoal.dataChange.currency, "EUR")}>EUR</option>
                <option ${AddGoal.selectedCompare(AddGoal.dataChange.currency, "BYN")}>BYN</option>
                <option ${AddGoal.selectedCompare(AddGoal.dataChange.currency, "RUB")}>RUB</option>
            </select>
            `
        } else {
            return `
            <select class="select-transaction" id="currency-goal" name="currency">
                <option>USD</option>
                <option>EUR</option>
                <option>BYN</option>
                <option>RUB</option>
            </select>
            `
        }
    },

    renderDefaultCategorySelect: () => {
        return `
            <select class="select-transaction" id="category-goal" name="category">
                <optgroup label="Standart">
                    ${AddGoal.renderStandartOptions()}
                </optgroup>
                <optgroup label="Custom">
                    ${AddGoal.renderCustomOptions(AddGoal.customCategories)}
                </optgroup>
            </select>
            `
    },

    selectedCompare: (opt1, opt2) => {
        return opt1 == opt2 ? 'selected = "true"' : "";
    },

    sendFormData: (formGoal, downloadURL, userID, key) => {
        let saveCategory = document.getElementById('save-option');
        if (AddGoal.status == "add") {
            if (AddGoal.categoryOther && saveCategory.checked) {
                DatabaseUtils.writeGoalData(AddGoal.getFormData(formGoal), downloadURL, userID, key, true);
            } else {
                DatabaseUtils.writeGoalData(AddGoal.getFormData(formGoal), downloadURL, userID, key, false);
            }
        } else {
            if (AddGoal.categoryOther && saveCategory.checked) {
                DatabaseUtils.editGoalData(AddGoal.getFormData(formGoal), downloadURL, userID, key, true);
            } else {
                DatabaseUtils.editGoalData(AddGoal.getFormData(formGoal), downloadURL, userID, key, false);
            }
        }
        window.location.hash = "#/goals";
    },

    getFormData: (formGoal) => {
        let categorySelected;
        if (AddGoal.categoryOther) {
            let value = formGoal['add-option'].value;
            categorySelected = value == "" ? "Other" : value;
        } else {
            categorySelected = formGoal['category-goal'].value;
        }

        return {
            description: formGoal['description-goal'].value,
            amount: formGoal['amount-goal'].value,
            contributed: '0',
            type: formGoal['type-goal'].value,
            currency: formGoal['currency-goal'].value,
            category: categorySelected,
            due: formGoal['due-goal'].value,
        }
    },

    renderCustomOptions: (options) => {
        if (options == null) {
            return;
        }

        let markup = ``;
        let optionsArray = [];
        options.forEach(option => {
            optionsArray.push(option.name);
        });

        if (AddGoal.status == "edit" && AddGoal.dataChange && optionsArray.includes(AddGoal.dataChange.category)) {
            optionsArray.forEach(category => {
                markup += `<option ${AddGoal.selectedCompare(AddGoal.dataChange.category, category)}>${category}</option>`
            })
        } else {
            optionsArray.forEach(category => {
                markup += `<option>${category}</option>`
            });

        }
        return markup;

    },

    renderStandartOptions: () => {
        let markup = ``;
        if (AddGoal.dataChange) {
            AddGoal.standartCategories.forEach(category => {
                markup += `<option ${AddGoal.selectedCompare(AddGoal.dataChange.category, category)}>${category}</option> `
            })
        } else {
            AddGoal.standartCategories.forEach(category => {
                markup += `<option>${category}</option>`
            })
        }
        return markup;
    },



    renderAside: () => {
        if (AddGoal.dataStatistics == null) {
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
                ${ShortStatisticsPartial.render(AddGoal.dataStatistics)}
        </aside>
        `
    },
};

export default AddGoal;