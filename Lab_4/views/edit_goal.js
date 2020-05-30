import DateTimeConvert from "../services/dateTimeConvert.js";
import DatabaseUtils from '../services/databaseUtils.js';
import ShortStatisticsPartial from "./shortStatisticsPartial.js";

let EditGoal = {
    render: async (dataStatistics, dataChange, id) => {
        EditGoal.dataStatistics = dataStatistics;
        EditGoal.dataChange = dataChange;
        EditGoal.goalId = id;
        return `
        <div class="site-content">
        ${EditGoal.renderAside()}

        <main class="add-transaction">
            <div class="container-transaction">
                <div class="wrap-transaction">
                    <form class='transaction-form' id="edit-goal-form">
                        <div class="wrap-input validate-input" data-validate="Description is required">
                            <label class="label-input" for="description-goal-edit">Description</label>
                            <input class="input input-form" type="text" id="description-goal-edit" name="description"
                                placeholder="Enter description" value="${EditGoal.dataChange.description}">
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input validate-input" data-validate="Amount is required">
                            <label class="label-input" for="amount-goal-edit">Amount</label>
                            <input class="input input-form" id="amount-goal-edit" type="number" name="amount"
                                placeholder="Enter amount" value="${EditGoal.dataChange.amount}">
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="type-goal-edit">Type</label>
                            <div>
                                ${EditGoal.renderDefaultTypeSelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="currency-goal-edit">Currency</label>
                            <div>
                                ${EditGoal.renderDefaultCurrencySelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="category-goal-edit">Category</label>
                            <div>
                                ${EditGoal.renderDefaultCategorySelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-date">
                            <label class="label-input" for="due-goal-edit">Due</label>
                            <input class="input date-input" id="due-goal-edit" type="date" name="due"
                            value="${EditGoal.dataChange.due}">
                        </div>
                        <div class="wrap-input">
                            <label class="label-input" for="image-goal-edit">Image</label>
                            <input class="input-file" type="file" id="image-goal-edit" name="image" class="input-file"
                                placeholder="Upload image">
                            <label for="image-goal-edit" class="btn btn-tertiary js-labelFile" id="button-input-file">
                                <img class="upload" src="res/upload.png">
                                <span class="js-fileName" id="file-name">Загрузить файл</span>
                            </label>
                        </div>
                        <div class="buttons">
                            <input type="submit" name="Submit" id='sumbit-edit-form' class="transaction-submit">
                            <a class="transaction-submit cancel" href="#/transactions">Cancel</a>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
        `
    },

    afterRender: () => {
        const formEditGoal = document.querySelector('#edit-goal-form');
        let userID = auth.currentUser.uid;
        let fileUpload = document.getElementById("image-goal-edit");
        let currentTime = DateTimeConvert.convert();

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

        formEditGoal.addEventListener('submit', e => {
            e.preventDefault();
            let files = fileUpload.files;
            if (files.length == 0) {
                alert("Picture was not changed.");
                EditGoal.sendFormData(formEditGoal, null, userID, EditGoal.goalId);
                return false;
            }

            var storageRef = storage.ref().child("images/" + userID + "/" + currentTime);
            let uploadTask = storageRef.put(files[0]);
            uploadTask.on('state_changed', function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log('File available at ', downloadURL);
                    EditGoal.sendFormData(formEditGoal, downloadURL, userID, EditGoal.goalId);
                })
            })
        })
    },

    sendFormData: (formEditGoal, downloadURL, userID, key) => {
        DatabaseUtils.editGoalData(EditGoal.getFormData(formEditGoal), downloadURL, userID, key);
        window.location.hash = "#/goals";
    },

    getFormData: (formEditGoal) => {
        return {
            description: formEditGoal['description-goal-edit'].value,
            amount: formEditGoal['amount-goal-edit'].value,
            contributed: '0',
            type: formEditGoal['type-goal-edit'].value,
            currency: formEditGoal['currency-goal-edit'].value,
            category: formEditGoal['category-goal-edit'].value,
            due: formEditGoal['due-goal-edit'].value,
        }
    },

    renderAside: () => {
        if (EditGoal.dataStatistics == null) {
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
                ${ShortStatisticsPartial.render(EditGoal.dataStatistics)}
        </aside>
        `
    },

    renderDefaultTypeSelect: () => {
        return `
        <select class="select-transaction" id="type-goal-edit" name="type">
            <option ${EditGoal.selectedCompare(EditGoal.dataChange.type, "Income")}>Income</option>
            <option ${EditGoal.selectedCompare(EditGoal.dataChange.type, "Expense")}>Expense</option>
        </select>
        `
    },

    renderDefaultCurrencySelect: () => {
        return `
        <select class="select-transaction" id="currency-goal-edit" name="currency">
            <option ${EditGoal.selectedCompare(EditGoal.dataChange.currency, "USD")}>USD</option>
            <option ${EditGoal.selectedCompare(EditGoal.dataChange.currency, "EUR")}>EUR</option>
            <option ${EditGoal.selectedCompare(EditGoal.dataChange.currency, "BYN")}>BYN</option>
            <option ${EditGoal.selectedCompare(EditGoal.dataChange.currency, "RUB")}>RUB</option>
        </select>
        `
    },

    renderDefaultCategorySelect: () => {
        return `
        <select class="select-transaction" id="category-goal-edit" name="category">
            <option ${EditGoal.selectedCompare(EditGoal.dataChange.category, "Food")}>Food</option>
            <option ${EditGoal.selectedCompare(EditGoal.dataChange.category, "Transport")}>Transport</option>
            <option ${EditGoal.selectedCompare(EditGoal.dataChange.category, "Car")}>Car</option>
            <option ${EditGoal.selectedCompare(EditGoal.dataChange.category, "Entertainment")}>Entertainment</option>
            <option ${EditGoal.selectedCompare(EditGoal.dataChange.category, "Clothes")}>Clothes</option>
            <option ${EditGoal.selectedCompare(EditGoal.dataChange.category, "House")}>House</option>
        </select>
        `
    },

    selectedCompare: (opt1, opt2) => {
        return opt1 == opt2 ? 'selected = "true"' : "";
    }

}

export default EditGoal;