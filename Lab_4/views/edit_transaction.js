import DateTimeConvert from "../services/dateTimeConvert.js";
import DatabaseUtils from "../services/databaseUtils.js";
import ShortStatisticsPartial from "./shortStatisticsPartial.js";

let EditTransaction = {
    render: async (dataStatistics, dataChange, id) => {
        EditTransaction.dataStatistics = dataStatistics;
        EditTransaction.dataChange = dataChange;
        EditTransaction.transactionId = id;
        return `
        <div class="site-content">
        ${EditTransaction.renderAside()}

        <main class="add-transaction">
            <div class="container-transaction">
                <div class="wrap-transaction">
                    <form class="transaction-form" id="edit-transaction-form">
                        <div class="wrap-input validate-input" data-validate="Description is required">
                            <label class="label-input" for="description-transaction-edit">Description</label>
                            <input class="input input-form" type="text" id="description-transaction-edit" name="description"
                                placeholder="Enter description" value="${EditTransaction.dataChange.description}">
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input validate-input" data-validate="Amount is required">
                            <label class="label-input" for="amount-transaction-edit">Amount</label>
                            <input class="input input-form" id="amount-transaction-edit" type="number" name="amount"
                                placeholder="Enter amount" value="${EditTransaction.dataChange.amount}">
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="type-transaction-edit">Type</label>
                            <div>
                                    ${EditTransaction.renderDefaultTypeSelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="currency-transaction-edit">Currency</label>
                            <div>
                                ${EditTransaction.renderDefaultCurrencySelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="category-transaction-edit">Category</label>
                            <div>
                                ${EditTransaction.renderDefaultCategorySelect()}
                            </div>
                        </div>
                        <div class="wrap-input input-date">
                            <label class="label-input" for="date-transaction-edit">Date</label>
                            <input class="input date-input" id="date-transaction-edit" type="date"
                            name="date" value="${EditTransaction.dataChange.date}">
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="account-transaction-edit">Account</label>
                            <div>
                                ${EditTransaction.renderDefaultAccountSelect()}
                            </div>
                        </div>
                        <div class="wrap-input">
                            <label class="label-input" for="place-transaction-edit">Place</label>
                            <input class="input input-form" id="place-transaction-edit" type="text" name="place"
                            placeholder="Enter place" value="${EditTransaction.dataChange.place}">
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input">
                            <label class="label-input" for="image-transaction-edit">Image</label>
                            <input class="input-file" id="image-transaction-edit" type="file" accept="image/*" name="image" class="input-file"
                                placeholder="Upload image">
                            <label for="image-transaction-edit" class="btn btn-tertiary js-labelFile" id="button-input-file">
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
        const formEditTransaction = document.querySelector('#edit-transaction-form');
        let userID = auth.currentUser.uid;
        let fileUpload = document.getElementById("image-transaction-edit");
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

        formEditTransaction.addEventListener('submit', e => {
            e.preventDefault();
            let files = fileUpload.files;
            if (files.length == 0) {
                alert("Picture was not changed.");
                EditTransaction.sendFormData(formEditTransaction, null, userID, EditTransaction.transactionId);
                return false;
            }

            var storageRef = storage.ref().child("images/" + userID + "/" + currentTime);
            let uploadTask = storageRef.put(files[0]);
            uploadTask.on('state_changed', function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log('File available at ', downloadURL);
                    EditTransaction.sendFormData(formEditTransaction, downloadURL, userID, EditTransaction.transactionId);
                })
            })
        });
    },

    sendFormData: (formTransaction, downloadURL, userID, key) => {
        DatabaseUtils.writeTransactionData(EditTransaction.getFormData(formTransaction), downloadURL, userID, key);
        window.location.hash = "#/transactions";
    },

    getFormData: (formTransaction) => {
        return {
            description: formTransaction['description-transaction-edit'].value,
            amount: formTransaction['amount-transaction-edit'].value,
            type: formTransaction['type-transaction-edit'].value,
            currency: formTransaction['currency-transaction-edit'].value,
            category: formTransaction['category-transaction-edit'].value,
            date: formTransaction['date-transaction-edit'].value,
            account: formTransaction['account-transaction-edit'].value,
            place: formTransaction['place-transaction-edit'].value
        }
    },

    renderAside: () => {
        if (EditTransaction.dataStatistics == null) {
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
                ${ShortStatisticsPartial.render(EditTransaction.dataStatistics)}
        </aside>
        `
    },

    renderDefaultTypeSelect: () => {
        return `
        <select class="select-transaction" id="type-transaction-edit" name="type">
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.type, "Income")}>Income</option>
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.type, "Expense")}>Expense</option>
        </select>

        `
    },

    renderDefaultCurrencySelect: () => {
        return `
        <select class="select-transaction" id="currency-transaction-edit" name="currency">
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.currency, "USD")}>USD</option>
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.currency, "EUR")}>EUR</option>
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.currency, "BYN")}>BYN</option>
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.currency, "RUB")}>RUB</option>
        </select>
        `
    },

    renderDefaultCategorySelect: () => {
        return `
        <select class="select-transaction" id="category-transaction-edit" name="category">
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.category, "Food")}>Food</option>
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.category, "Transport")}>Transport</option>
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.category, "Car")}>Car</option>
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.category, "Entertainment")}>Entertainment</option>
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.category, "Clothes")}>Clothes</option>
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.category, "House")}>House</option>
        </select>
        `
    },

    renderDefaultRepeatSelect: () => {
        return `
        <select class="select-transaction" id="repeat-transaction-edit" name="repeat">
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.repeat, "No repeat")}>No repeat</option>
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.repeat, "Every day")}>Every day</option>
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.repeat, "Every month")}>Every month</option>
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.repeat, "Every year")}>Every year</option>
        </select>
        `
    },

    renderDefaultAccountSelect: () => {
        return `
        <select class="select-transaction" id="account-transaction-edit" name="account">
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.account, "Card")}>Card</option>
            <option ${EditTransaction.selectedCompare(EditTransaction.dataChange.account, "Cash")}>Cash</option>
        </select>
        `
    },

    selectedCompare: (opt1, opt2) => {
        return opt1 == opt2 ? 'selected = "true"' : "";
    }
};

export default EditTransaction;