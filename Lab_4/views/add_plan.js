import DateTimeConvert from "../services/dateTimeConvert.js";
import DatabaseUtils from "../services/databaseUtils.js";
import ShortStatisticsPartial from "./shortStatisticsPartial.js";

let AddPlan = {
    render: async (dataStatistics) => {
        AddPlan.dataStatistics = dataStatistics;
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
                                placeholder="Enter description" required>
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input validate-input" data-validate="Amount is required">
                            <label class="label-input" for="amount-plan">Amount</label>
                            <input class="input input-form" id="amount-plan" type="number" name="amount"
                                placeholder="Enter amount" required>
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="type-plan">Type</label>
                            <div>
                                <select class="select-transaction" id="type-plan" name="type">
                                    <option>Income</option>
                                    <option>Expense</option>
                                </select>
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="currency-plan">Currency</label>
                            <div>
                                <select class="select-transaction" id="currency-plan" name="currency">
                                    <option>USD</option>
                                    <option>EUR</option>
                                    <option>BYN</option>
                                    <option>RUB</option>
                                </select>
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="category-plan">Category</label>
                            <div>
                                <select class="select-transaction" id="category-plan" name="category">
                                    <option>Food</option>
                                    <option>Transport</option>
                                    <option>Car</option>
                                    <option>Entertainment</option>
                                    <option>Clothes</option>
                                    <option>House</option>
                                </select>
                            </div>
                        </div>
                        <div class="wrap-input input-date">
                            <label class="label-input" for="date-plan">Date</label>
                            <input class="input date-input" id="date-plan" type="date" name="date" required>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="repeat-plan">Repeat</label>
                            <div>
                                <select class="select-transaction" id="repeat-plan" name="repeat">
                                    <option>No repeat</option>
                                    <option>Every day</option>
                                    <option>Every month</option>
                                    <option>Every year</option>
                                </select>
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="account-plan">Account</label>
                            <div>
                                <select class="select-transaction" id="account-plan" name="account">
                                    <option>Card</option>
                                    <option>Cash</option>
                                </select>
                            </div>
                        </div>
                        <div class="wrap-input">
                            <label class="label-input" for="place-plan">Place</label>
                            <input class="input input-form" id="place-plan" type="text" name="place"
                                placeholder="Enter place">
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
        let currentTime = DateTimeConvert.convert();

        let key = 0;
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
                alert("Picture was not selected. Default picture will be used instead.");
                let downloadURL = "https://www.shareicon.net/data/512x512/2015/11/20/675119_sign_512x512.png";
                AddPlan.sendFormData(formPlan, downloadURL, userID, key);
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
    },

    sendFormData: (formPlan, downloadURL, userID, key) => {
        DatabaseUtils.writePlanData(AddPlan.getFormData(formPlan), downloadURL, userID, key);
        window.location.hash = "#/plans";
    },

    getFormData: (formPlan) => {
        return {
            description: formPlan['description-plan'].value,
            amount: formPlan['amount-plan'].value,
            type: formPlan['type-plan'].value,
            currency: formPlan['currency-plan'].value,
            category: formPlan['category-plan'].value,
            date: formPlan['date-plan'].value,
            repeat: formPlan['repeat-plan'].value,
            account: formPlan['account-plan'].value,
            place: formPlan['place-plan'].value
        }
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