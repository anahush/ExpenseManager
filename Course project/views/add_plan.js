import DateTimeConvertUtils from "../services/dateTimeConvertUtils.js";
import DatabaseUtils from "../services/databaseUtils.js";
import ShortStatisticsPartial from "./shortStatisticsPartial.js";

let AddPlan = {
    render: async (dataStatistics, dataChange, customCategories, id, status) => {
        AddPlan.dataStatistics = dataStatistics;
        AddPlan.customCategories = customCategories;
        AddPlan.dataChange = dataChange;
        AddPlan.idChange = id;
        AddPlan.status = status;

        AddPlan.standartCategories = ["Food", "Transport", "Car", "Entertainment", "Clothes", "House", "Other"];

        return `
        <div class="site-content">
        ${AddPlan.renderAside()}

        <main class="add-transaction">
            <div class="container-transaction">
                <div class="wrap-transaction">
                    <form class='transaction-form' id='add-plan-form'>
                        <div class="wrap-input validate-input" data-validate="Description is required">
                            <label class="label-input" for="description-plan">Description</label>
                            <input class="input input-form" id="description-plan" type="text" name="description"
                                placeholder="Enter description" value="${AddPlan.getEditField("description")}" required>
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input validate-input" data-validate="Amount is required">
                            <label class="label-input" for="amount-plan">Amount</label>
                            <input class="input input-form" id="amount-plan" type="number" name="amount"
                                placeholder="Enter amount" value="${AddPlan.getEditField("amount")}" required>
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="type-plan">Type</label>
                            <div>
                                ${AddPlan.renderDefaultTypeSelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="currency-plan">Currency</label>
                            <div>
                                ${AddPlan.renderDefaultCurrencySelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="category-plan">Category</label>
                            <div>
                                ${AddPlan.renderDefaultCategorySelect()}
                            </div>
                        </div>
                        <div class="wrap-input add-option" id="add-option-wrapper">
                            <label class="label-input" for="add-option">Add option</label>
                            <input class="input input-form" id="add-option" type="text" placeholder="Input option name">
                            <Br><input id="save-option" type="checkbox">Save option<Br>
                        </div>
                        <div class="wrap-input input-date">
                            <label class="label-input" for="date-plan">Date</label>
                            <input class="input date-input" id="date-plan" type="date" 
                            name="date" value="${AddPlan.getEditField("date")}" required>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="repeat-plan">Repeat</label>
                            <div>
                                ${AddPlan.renderDefaultRepeatSelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="account-plan">Account</label>
                            <div>
                               ${AddPlan.renderDefaultAccountSelect()}
                            </div>
                        </div>
                        <div class="wrap-input">
                            <label class="label-input" for="place-plan">Place</label>
                            <input class="input input-form" id="place-plan" type="text" name="place"
                                placeholder="Enter place" value="${AddPlan.getEditField("place")}">
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input">
                            <label class="label-input" for="image-plan">Image</label>
                            <input class="input-file" id="image-plan" type="file" accept="image/*" name="image" class="input-file"
                                placeholder="Upload image">
                            <label for="image-plan" class="btn btn-tertiary js-labelFile" id="button-input-file">
                                <img class="upload" id="upload-picture-plan" src="res/upload.png">
                                <span class="js-fileName" id="file-name">Загрузить файл</span>
                            </label>
                        </div>
                        <div class="buttons">
                            <input type="submit" name="Submit-plan" class="transaction-submit">
                            <a class="transaction-submit cancel" href="#/plans">Cancel</a>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
        `
    },

    afterRender: async () => {
        const formPlan = document.querySelector('#add-plan-form');
        let userID = auth.currentUser.uid;
        let fileUpload = document.getElementById("image-plan");
        let currentTime = DateTimeConvertUtils.convert();
        let categorySelect = document.getElementById('category-plan');

        let key;
        if (AddPlan.status == "edit") {
            key = AddPlan.idChange;
        } else {
            key = 0;
            db.ref('plans/' + userID + "/").limitToLast(1).once("value").then((snapshot) => {
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

        formPlan.addEventListener('submit', e => {
            e.preventDefault();
            let files = fileUpload.files;
            if (files.length == 0) {
                if (AddPlan.status == "add") {
                    alert("Picture was not selected. Default picture will be used instead.");
                    let downloadURL = "https://www.shareicon.net/data/512x512/2015/11/20/675119_sign_512x512.png";
                    AddPlan.sendFormData(formPlan, downloadURL, userID, key);
                } else {
                    alert("Picture was not changed.");
                    AddPlan.sendFormData(formPlan, null, userID, key);
                }
                return false;
            }

            var storageRef = storage.ref().child("images/" + userID + "/" + currentTime);
            let uploadTask = storageRef.put(files[0]);
            uploadTask.on('state_changed', function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log('File available at ', downloadURL);
                    AddPlan.sendFormData(formPlan, downloadURL, userID, key);
                })
            })
        });

        categorySelect.addEventListener('change', e => {
            let categoryWrapper = document.getElementById('add-option-wrapper');
            if (e.target.value == "Other") {
                categoryWrapper.style.display = "block";
                AddPlan.categoryOther = true;
            } else {
                categoryWrapper.style.display = "none";
                AddPlan.categoryOther = false;
            }
        });
    },

    getEditField: (field) => {
        if (AddPlan.status == "edit" && AddPlan.dataChange) {
            return AddPlan.dataChange[field];
        }
        return "";
    },

    renderDefaultTypeSelect: () => {
        if (AddPlan.dataChange) {
            return `
        <select class="select-transaction" id="type-plan" name="type">
            <option ${AddPlan.selectedCompare(AddPlan.dataChange.type, "Income")}>Income</option>
            <option ${AddPlan.selectedCompare(AddPlan.dataChange.type, "Expense")}>Expense</option>
        </select>
        `
        } else {
            return `
            <select class="select-transaction" id="type-plan" name="type">
            <option>Income</option>
            <option>Expense</option>
        </select>
            `
        }
    },

    renderDefaultCurrencySelect: () => {
        if (AddPlan.dataChange) {
            return `
            <select class="select-transaction" id="currency-plan" name="currency">
                <option ${AddPlan.selectedCompare(AddPlan.dataChange.currency, "USD")}>USD</option>
                <option ${AddPlan.selectedCompare(AddPlan.dataChange.currency, "EUR")}>EUR</option>
                <option ${AddPlan.selectedCompare(AddPlan.dataChange.currency, "BYN")}>BYN</option>
                <option ${AddPlan.selectedCompare(AddPlan.dataChange.currency, "RUB")}>RUB</option>
            </select>
            `
        } else {
            return `
            <select class="select-transaction" id="currency-plan" name="currency">
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
            <select class="select-transaction" id="category-plan" name="category">
                <optgroup label="Standart">
                    ${AddPlan.renderStandartOptions()}
                </optgroup>
                <optgroup label="Custom">
                    ${AddPlan.renderCustomOptions(AddPlan.customCategories)}
                </optgroup>
            </select>
            `
    },

    renderDefaultRepeatSelect: () => {
        if (AddPlan.dataChange) {
            return `
            <select class="select-transaction" id="repeat-plan" name="repeat">
                <option ${AddPlan.selectedCompare(AddPlan.dataChange.repeat, "No repeat")}>No repeat</option>
                <option ${AddPlan.selectedCompare(AddPlan.dataChange.repeat, "Every day")}>Every day</option>
                <option ${AddPlan.selectedCompare(AddPlan.dataChange.repeat, "Every month")}>Every month</option>
                <option ${AddPlan.selectedCompare(AddPlan.dataChange.repeat, "Every year")}>Every year</option>
            </select>
            `
        } else {
            return `
            <select class="select-transaction" id="repeat-plan" name="repeat">
                <option>No repeat</option>
                <option>Every day</option>
                <option>Every month</option>
                <option>Every year</option>
            </select>
            `
        }
    },

    renderDefaultAccountSelect: () => {
        if (AddPlan.dataChange) {
            return `
            <select class="select-transaction" id="account-plan" name="account">
                <option ${AddPlan.selectedCompare(AddPlan.dataChange.account, "Card")}>Card</option>
                <option ${AddPlan.selectedCompare(AddPlan.dataChange.account, "Cash")}>Cash</option>
            </select>
            `
        } else {
            return `
            <select class="select-transaction" id="account-plan" name="account">
                <option>Card</option>
                <option>Cash</option>
            </select>
            `
        }
    },

    selectedCompare: (opt1, opt2) => {
        return opt1 == opt2 ? 'selected = "true"' : "";
    },

    sendFormData: (formPlan, downloadURL, userID, key) => {
        let saveCategory = document.getElementById('save-option');

        if (AddPlan.status == "add") {
            if (AddPlan.categoryOther && saveCategory.checked) {
                DatabaseUtils.writePlanData(AddPlan.getFormData(formPlan), downloadURL, userID, key, true);
            } else {
                DatabaseUtils.writePlanData(AddPlan.getFormData(formPlan), downloadURL, userID, key, false);
            }
        } else {
            if (AddPlan.categoryOther && saveCategory.checked) {
                DatabaseUtils.editPlanData(AddPlan.getFormData(formPlan), downloadURL, userID, key, true);
            } else {
                DatabaseUtils.editPlanData(AddPlan.getFormData(formPlan), downloadURL, userID, key, false);
            }
        }
        window.location.hash = "#/plans";
    },

    getFormData: (formPlan) => {
        let categorySelected;
        if (AddPlan.categoryOther) {
            let value = formPlan['add-option'].value;
            categorySelected = value == "" ? "Other" : value;
        } else {
            categorySelected = formPlan['category-plan'].value;
        }

        return {
            description: formPlan['description-plan'].value,
            amount: formPlan['amount-plan'].value,
            type: formPlan['type-plan'].value,
            currency: formPlan['currency-plan'].value,
            category: categorySelected,
            date: formPlan['date-plan'].value,
            repeat: formPlan['repeat-plan'].value,
            account: formPlan['account-plan'].value,
            place: formPlan['place-plan'].value
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

        if (AddPlan.status == "edit" && AddPlan.dataChange && optionsArray.includes(AddPlan.dataChange.category)) {
            optionsArray.forEach(category => {
                markup += `<option ${AddPlan.selectedCompare(AddPlan.dataChange.category, category)}>${category}</option>`
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
        if (AddPlan.dataChange) {
            AddPlan.standartCategories.forEach(category => {
                markup += `<option ${AddPlan.selectedCompare(AddPlan.dataChange.category, category)}>${category}</option> `
            })
        } else {
            AddPlan.standartCategories.forEach(category => {
                markup += `<option>${category}</option>`
            })
        }
        return markup;
    },

    renderAside: () => {
        if (AddPlan.dataStatistics == null) {
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
                ${ShortStatisticsPartial.render(AddPlan.dataStatistics)}
        </aside>
        `
    },
};

export default AddPlan;