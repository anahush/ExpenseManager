import DateTimeConvert from "../services/dateTimeConvert.js";
import DatabaseUtils from '../services/databaseUtils.js';

let AddGoal = {
    render: async () => {
        return `
        <div class="site-content">
        <aside class="aside-add">
            <h2>Short statistics</h2>
            <ul class="statistics-list">
                <li>
                    <h3>Balance</h3>
                    <ul class="statistics-point-list">
                        <li>
                            <p>Card: "value"</p>
                        </li>
                        <li>
                            <p>Cash: "value"</p>
                        </li>
                    </ul>
                </li>
                <li>
                    <h3>Income</h3>
                    <ul class="statistics-point-list">
                        <li>
                            <p>Card: "value"</p>
                        </li>
                        <li>
                            <p>Cash: "value"</p>
                        </li>
                    </ul>
                </li>
                <li>
                    <h3>Expense</h3>
                    <ul class="statistics-point-list">
                        <li>
                            <p>Card: "value"</p>
                        </li>
                        <li>
                            <p>Cash: "value"</p>
                        </li>
                    </ul>
                </li>
            </ul>
        </aside>

        <main class="add-transaction">
            <div class="container-transaction">
                <div class="wrap-transaction">
                    <form class='transaction-form' id="add-goal-form">
                        <div class="wrap-input validate-input" data-validate="Description is required">
                            <label class="label-input" for="description-goal">Description</label>
                            <input class="input input-form" type="text" id="description-goal" name="description"
                                placeholder="Enter description">
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input validate-input" data-validate="Amount is required">
                            <label class="label-input" for="amount-goal">Amount</label>
                            <input class="input input-form" id="amount-goal" type="number" name="amount"
                                placeholder="Enter amount">
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="type-goal">Type</label>
                            <div>
                                <select class="select-transaction" id="type-goal" name="type">
                                    <option>Income</option>
                                    <option>Expense</option>
                                </select>
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="currency-goal">Currency</label>
                            <div>
                                <select class="select-transaction" id="currency-goal" name="currency">
                                    <option>USD</option>
                                    <option>EUR</option>
                                    <option>BYN</option>
                                    <option>RUB</option>
                                </select>
                            </div>
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="category-goal">Category</label>
                            <div>
                                <select class="select-transaction" id="category-goal" name="category">
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
                            <label class="label-input" for="due-goal">Due</label>
                            <input class="input date-input" id="due-goal" type="date" name="due">
                        </div>
                        <div class="wrap-input">
                            <label class="label-input" for="image-goal">Image</label>
                            <input class="input-file" type="file" id="image-goal" name="image" class="input-file"
                                placeholder="Upload image">
                            <label for="image-goal" class="btn btn-tertiary js-labelFile">
                                <img class="upload" src="res/upload.png">
                                <span class="js-fileName">Загрузить файл</span>
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
        let downloadLink = null;
        let currentTime = DateTimeConvert.convert();

        formGoal.addEventListener('submit', e => {
            e.preventDefault();
            let files = fileUpload.files;
            if (files.length == 0) {
                alert("Image not provided!");
                return;
            }

            var storageRef = storage.ref().child("images/" + userID + "/" + currentTime);

            let uploadTask = storageRef.put(files[0]);
            uploadTask.on('state_changed', function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log('File available at ', downloadURL);
                    downloadLink = downloadURL;
                    DatabaseUtils.writeGoalData(AddGoal.getFormData(formGoal), downloadLink, userID, currentTime);
                    window.location.hash = "#/";
                })
            })
        })
    },

    getFormData: (formGoal) => {
        return {
            description: formGoal['description-goal'].value,
            amount: formGoal['amount-goal'].value,
            type: formGoal['type-goal'].value,
            currency: formGoal['currency-goal'].value,
            category: formGoal['category-goal'].value,
            due: formGoal['due-goal'].value,
        }
    }
};

export default AddGoal;