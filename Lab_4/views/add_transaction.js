import DateTimeConvert from "../services/dateTimeConvert.js";
import DatabaseUtils from "../services/databaseUtils.js";
import ShortStatisticsPartial from "./shortStatisticsPartial.js";

let AddTransaction = {
    render: async (dataStatistics, dataChange, customCategories, id, status) => {
        AddTransaction.dataStatistics = dataStatistics;
        AddTransaction.customCategories = customCategories;
        AddTransaction.dataChange = dataChange;
        AddTransaction.idChange = id;
        AddTransaction.status = status;

        AddTransaction.standartCategories = ["Food", "Transport", "Car", "Entertainment", "Clothes", "House", "Other"];

        return `
        <div class="site-content">
        ${AddTransaction.renderAside()}

        <main class="add-transaction">
            <div class="container-transaction">
                <div class="wrap-transaction">
                    <form class="transaction-form" id="add-transaction-form">
                        <div class="wrap-input validate-input" data-validate="Description is required">
                            <label class="label-input" for="description-transaction">Description</label>
                            <input class="input input-form" type="text" id="description-transaction" name="description"
                                placeholder="Enter description" value="${AddTransaction.getEditField("description")}" required>
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input validate-input" data-validate="Amount is required">
                            <label class="label-input" for="amount-transaction">Amount</label>
                            <input class="input input-form" id="amount-transaction" type="number" name="amount"
                                placeholder="Enter amount" value="${AddTransaction.getEditField("amount")}" required>
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="type-transaction">Type</label>
                            <div>
                                ${AddTransaction.renderDefaultTypeSelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="currency-transaction">Currency</label>
                            <div>
                                ${AddTransaction.renderDefaultCurrencySelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="category-transaction">Category</label>
                            ${AddTransaction.renderDefaultCategorySelect()}
                        </div>
                        <div class="wrap-input add-option" id="add-option-wrapper">
                            <label class="label-input" for="add-option">Add option</label>
                            <input class="input input-form" id="add-option" type="text" placeholder="Input option name">
                            <Br><input id="save-option" type="checkbox">Save option<Br>
                        </div>
                        <div class="wrap-input input-date">
                            <label class="label-input" for="date-transaction">Date</label>
                            <input class="input date-input" id="date-transaction" type="date"
                            name="date" value="${AddTransaction.getEditField("date")}" required>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="account-transaction">Account</label>
                            <div>
                                ${AddTransaction.renderDefaultAccountSelect()}
                            </div>
                        </div>
                        <div class="wrap-input">
                            <label class="label-input" for="place-transaction">Place</label>
                            <input class="input input-form" id="place-transaction" type="text" name="place"
                            placeholder="Enter place" value="${AddTransaction.getEditField("place")}">
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input">
                            <label class="label-input" for="image-transaction">Image</label>
                            <input class="input-file" id="image-transaction" type="file" accept="image/*" name="image" class="input-file"
                                placeholder="Upload image">
                            <label for="image-transaction" class="btn btn-tertiary js-labelFile" id="button-input-file">
                                <img class="upload" id="upload-picture" src="res/upload.png">
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
        const formTransaction = document.querySelector('#add-transaction-form');
        let userID = auth.currentUser.uid;
        let fileUpload = document.getElementById("image-transaction");
        let currentTime = DateTimeConvert.convert();
        let categorySelect = document.getElementById('category-transaction');

        let key;
        if (AddTransaction.status == "edit") {
            key = AddTransaction.idChange;
        } else {
            key = 0;
            db.ref('transactions/' + userID + "/").limitToLast(1).once("value").then((snapshot) => {
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

        formTransaction.addEventListener('submit', e => {
            e.preventDefault();

            let files = fileUpload.files;
            if (files.length == 0) {
                if (AddTransaction.status == "add") {
                    alert("Picture was not selected. Default picture will be used instead.");
                    let downloadURL = "https://www.shareicon.net/data/512x512/2015/11/20/675119_sign_512x512.png";
                    AddTransaction.sendFormData(formTransaction, downloadURL, userID, key);
                } else {
                    alert("Picture was not changed");
                    AddTransaction.sendFormData(formTransaction, null, userID, key);
                }
                return false;
            }

            var storageRef = storage.ref().child("images/" + userID + "/" + currentTime);
            let uploadTask = storageRef.put(files[0]);
            uploadTask.on('state_changed', function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log('File available at ', downloadURL);
                    AddTransaction.sendFormData(formTransaction, downloadURL, userID, key);
                })
            })
        });

        categorySelect.addEventListener('change', e => {
            let categoryWrapper = document.getElementById('add-option-wrapper');
            if (e.target.value == "Other") {
                categoryWrapper.style.display = "block";
                AddTransaction.categoryOther = true;
            } else {
                categoryWrapper.style.display = "none";
                AddTransaction.categoryOther = false;
            }
        })
    },

    getEditField: (field) => {
        if (AddTransaction.status == "edit" && AddTransaction.dataChange) {
            return AddTransaction.dataChange[field];
        }
        return "";
    },

    renderDefaultTypeSelect: () => {
        if (AddTransaction.dataChange) {
            return `
        <select class="select-transaction" id="type-transaction" name="type">
            <option ${AddTransaction.selectedCompare(AddTransaction.dataChange.type, "Income")}>Income</option>
            <option ${AddTransaction.selectedCompare(AddTransaction.dataChange.type, "Expense")}>Expense</option>
        </select>
        `
        } else {
            return `
            <select class="select-transaction" id="type-transaction" name="type">
            <option>Income</option>
            <option>Expense</option>
        </select>
            `
        }
    },

    renderDefaultCurrencySelect: () => {
        if (AddTransaction.dataChange) {
            return `
            <select class="select-transaction" id="currency-transaction" name="currency">
                <option ${AddTransaction.selectedCompare(AddTransaction.dataChange.currency, "USD")}>USD</option>
                <option ${AddTransaction.selectedCompare(AddTransaction.dataChange.currency, "EUR")}>EUR</option>
                <option ${AddTransaction.selectedCompare(AddTransaction.dataChange.currency, "BYN")}>BYN</option>
                <option ${AddTransaction.selectedCompare(AddTransaction.dataChange.currency, "RUB")}>RUB</option>
            </select>
            `
        } else {
            return `
            <select class="select-transaction" id="currency-transaction" name="currency">
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
            <select class="select-transaction" id="category-transaction" name="category">
                <optgroup label="Standart">
                    ${AddTransaction.renderStandartOptions()}
                </optgroup>
                <optgroup label="Custom">
                    ${AddTransaction.renderCustomOptions(AddTransaction.customCategories)}
                </optgroup>
            </select>
            `
    },

    renderDefaultRepeatSelect: () => {
        if (AddTransaction.dataChange) {
            return `
            <select class="select-transaction" id="repeat-transaction" name="repeat">
                <option ${AddTransaction.selectedCompare(AddTransaction.dataChange.repeat, "No repeat")}>No repeat</option>
                <option ${AddTransaction.selectedCompare(AddTransaction.dataChange.repeat, "Every day")}>Every day</option>
                <option ${AddTransaction.selectedCompare(AddTransaction.dataChange.repeat, "Every month")}>Every month</option>
                <option ${AddTransaction.selectedCompare(AddTransaction.dataChange.repeat, "Every year")}>Every year</option>
            </select>
            `
        } else {
            return `
            <select class="select-transaction" id="repeat-transaction" name="repeat">
                <option>No repeat</option>
                <option>Every day</option>
                <option>Every month</option>
                <option>Every year</option>
            </select>
            `
        }
    },

    renderDefaultAccountSelect: () => {
        if (AddTransaction.dataChange) {
            return `
            <select class="select-transaction" id="account-transaction" name="account">
                <option ${AddTransaction.selectedCompare(AddTransaction.dataChange.account, "Card")}>Card</option>
                <option ${AddTransaction.selectedCompare(AddTransaction.dataChange.account, "Cash")}>Cash</option>
            </select>
            `
        } else {
            return `
            <select class="select-transaction" id="account-transaction" name="account">
                <option>Card</option>
                <option>Cash</option>
            </select>
            `
        }
    },

    selectedCompare: (opt1, opt2) => {
        return opt1 == opt2 ? 'selected = "true"' : "";
    },

    sendFormData: (formTransaction, downloadURL, userID, key) => {
        let saveCategory = document.getElementById('save-option');

        if (AddTransaction.status == "add") {
            if (AddTransaction.categoryOther && saveCategory.checked) {
                DatabaseUtils.writeTransactionData(AddTransaction.getFormData(formTransaction), downloadURL, userID, key, true);
            } else {
                DatabaseUtils.writeTransactionData(AddTransaction.getFormData(formTransaction), downloadURL, userID, key, false);
            }
        } else {
            if (AddTransaction.categoryOther && saveCategory.checked) {
                DatabaseUtils.editTransactionData(AddTransaction.getFormData(formTransaction), downloadURL, userID, key, true);
            } else {
                DatabaseUtils.editTransactionData(AddTransaction.getFormData(formTransaction), downloadURL, userID, key, false);
            }
        }
        window.location.hash = "#/transactions";
    },

    getFormData: (formTransaction) => {
        let categorySelected;
        if (AddTransaction.categoryOther) {
            let value = formTransaction['add-option'].value;
            categorySelected = value == "" ? "Other" : value;
        } else {
            categorySelected = formTransaction['category-transaction'].value;
        }

        return {
            description: formTransaction['description-transaction'].value,
            amount: formTransaction['amount-transaction'].value,
            type: formTransaction['type-transaction'].value,
            currency: formTransaction['currency-transaction'].value,
            category: categorySelected,
            date: formTransaction['date-transaction'].value,
            account: formTransaction['account-transaction'].value,
            place: formTransaction['place-transaction'].value
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

        if (AddTransaction.status == "edit" && AddTransaction.dataChange && optionsArray.includes(AddTransaction.dataChange.category)) {
            optionsArray.forEach(category => {
                markup += `<option ${AddTransaction.selectedCompare(AddTransaction.dataChange.category, category)}>${category}</option>`
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
        if (AddTransaction.dataChange) {
            AddTransaction.standartCategories.forEach(category => {
                markup += `<option ${AddTransaction.selectedCompare(AddTransaction.dataChange.category, category)}>${category}</option> `
            })
        } else {
            AddTransaction.standartCategories.forEach(category => {
                markup += `<option>${category}</option>`
            })
        }
        return markup;
    },

    renderAside: () => {
        if (AddTransaction.dataStatistics == null) {
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
                ${ShortStatisticsPartial.render(AddTransaction.dataStatistics)}
        </aside>
        `
    },
};

export default AddTransaction;