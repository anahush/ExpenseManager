import DateTimeConvert from "../services/dateTimeConvert.js";
import DatabaseUtils from '../services/databaseUtils.js';
import ShortStatisticsPartial from "./shortStatisticsPartial.js";

let EditPlan = {
    render: async (dataStatistics, dataChange, id) => {
        EditPlan.dataStatistics = dataStatistics;
        EditPlan.dataChange = dataChange;
        EditPlan.planId = id;
        return `
        <div class="site-content">
        ${EditPlan.renderAside()}

        <main class="add-transaction">
            <div class="container-transaction">
                <div class="wrap-transaction">
                    <form class='transaction-form' id='edit-plan-form'>
                        <div class="wrap-input validate-input" data-validate="Description is required">
                            <label class="label-input" for="description-plan-edit">Description</label>
                            <input class="input input-form" id="description-plan-edit" type="text" name="description"
                                placeholder="Enter description" value="${EditPlan.dataChange.description}">
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input validate-input" data-validate="Amount is required">
                            <label class="label-input" for="amount-plan-edit">Amount</label>
                            <input class="input input-form" id="amount-plan-edit" type="number" name="amount"
                                placeholder="Enter amount" value="${EditPlan.dataChange.amount}">
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="type-plan-edit">Type</label>
                            <div>
                                ${EditPlan.renderDefaultTypeSelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="currency-plan-edit">Currency</label>
                            <div>
                                ${EditPlan.renderDefaultCurrencySelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="category-plan-edit">Category</label>
                            <div>
                                ${EditPlan.renderDefaultCategorySelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-date">
                            <label class="label-input" for="date-plan-edit">Date</label>
                            <input class="input date-input" id="date-plan-edit" type="date"
                            name="date" value="${EditPlan.dataChange.date}">
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="repeat-plan-edit">Repeat</label>
                            <div>
                                ${EditPlan.renderDefaultRepeatSelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="account-plan-edit">Account</label>
                            <div>
                                ${EditPlan.renderDefaultAccountSelect()}
                            </div>
                        </div>
                        <div class="wrap-input">
                            <label class="label-input" for="place-plan-edit">Place</label>
                            <input class="input input-form" id="place-plan-edit" type="text" name="place"
                                placeholder="Enter place" value="${EditPlan.dataChange.place}">
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input">
                            <label class="label-input" for="image-plan-edit">Image</label>
                            <input class="input-file" id="image-plan-edit" type="file" accept="image/*" name="image" class="input-file"
                                placeholder="Upload image">
                            <label for="image-plan-edit" class="btn btn-tertiary js-labelFile" id="button-input-file">
                                <img class="upload" id="upload-picture-plan-edit" src="res/upload.png">
                                <span class="js-fileName" id="file-name">Загрузить файл</span>
                            </label>
                        </div>
                        <div class="buttons">
                            <input type="submit" name="Submit-plan-edit" class="transaction-submit">
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
        const formEditPlan = document.querySelector('#edit-plan-form');
        let userID = auth.currentUser.uid;
        let fileUpload = document.getElementById("image-plan-edit");
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

        formEditPlan.addEventListener('submit', e => {
            e.preventDefault();
            let files = fileUpload.files;
            if (files.length == 0) {
                alert("Picture was not changed.");
                EditPlan.sendFormData(formEditPlan, null, userID, EditPlan.planId);
                return false;
            }

            var storageRef = storage.ref().child("images/" + userID + "/" + currentTime);
            let uploadTask = storageRef.put(files[0]);
            uploadTask.on('state_changed', function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log('File available at ', downloadURL);
                    EditPlan.sendFormData(formEditPlan, downloadURL, userID, EditPlan.planId);
                })
            })
        });
    },

    sendFormData: (formEditPlan, downloadURL, userID, key) => {
        DatabaseUtils.editPlanData(EditPlan.getFormData(formEditPlan), downloadURL, userID, key);
        window.location.hash = "#/plans";
    },

    getFormData: (formPlan) => {
        return {
            description: formPlan['description-plan-edit'].value,
            amount: formPlan['amount-plan-edit'].value,
            type: formPlan['type-plan-edit'].value,
            currency: formPlan['currency-plan-edit'].value,
            category: formPlan['category-plan-edit'].value,
            date: formPlan['date-plan-edit'].value,
            repeat: formPlan['repeat-plan-edit'].value,
            account: formPlan['account-plan-edit'].value,
            place: formPlan['place-plan-edit'].value
        }
    },

    renderAside: () => {
        if (EditPlan.dataStatistics == null) {
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
                ${ShortStatisticsPartial.render(EditPlan.dataStatistics)}
        </aside>
        `
    },

    renderDefaultTypeSelect: () => {
        return `
        <select class="select-transaction" id="type-plan-edit" name="type">
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.type, "Income")}>Income</option>
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.type, "Expense")}>Expense</option>
        </select>

        `
    },

    renderDefaultCurrencySelect: () => {
        return `
        <select class="select-transaction" id="currency-plan-edit" name="currency">
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.currency, "USD")}>USD</option>
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.currency, "EUR")}>EUR</option>
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.currency, "BYN")}>BYN</option>
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.currency, "RUB")}>RUB</option>
        </select>
        `
    },

    renderDefaultCategorySelect: () => {
        return `
        <select class="select-transaction" id="category-plan-edit" name="category">
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.category, "Food")}>Food</option>
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.category, "Transport")}>Transport</option>
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.category, "Car")}>Car</option>
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.category, "Entertainment")}>Entertainment</option>
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.category, "Clothes")}>Clothes</option>
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.category, "House")}>House</option>
        </select>
        `
    },

    renderDefaultRepeatSelect: () => {
        return `
        <select class="select-transaction" id="repeat-plan-edit" name="repeat">
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.repeat, "No repeat")}>No repeat</option>
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.repeat, "Every day")}>Every day</option>
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.repeat, "Every month")}>Every month</option>
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.repeat, "Every year")}>Every year</option>
        </select>
        `
    },

    renderDefaultAccountSelect: () => {
        return `
        <select class="select-transaction" id="account-plan-edit" name="account">
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.account, "Card")}>Card</option>
            <option ${EditPlan.selectedCompare(EditPlan.dataChange.account, "Cash")}>Cash</option>
        </select>
        `
    },

    selectedCompare: (opt1, opt2) => {
        return opt1 == opt2 ? 'selected = "true"' : "";
    }
};

export default EditPlan;