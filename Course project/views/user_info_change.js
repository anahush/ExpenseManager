import DateTimeConvertUtils from "../services/dateTimeConvertUtils.js";
import DatabaseUtils from '../services/databaseUtils.js';
import ShortStatisticsPartial from "./shortStatisticsPartial.js";

let UserInfoChange = {
    render: async (dataStatistics, userInfo, otherData) => {
        UserInfoChange.userInfo = userInfo;
        UserInfoChange.otherData = otherData;
        UserInfoChange.dataStatistics = dataStatistics;

        let markup = `
        <div class="site-content">
        ${UserInfoChange.renderAside()}

        <main class="add-transaction">
            <div class="container-transaction">
                <div class="wrap-transaction">
                    <form class='transaction-form' id="register-info-form">
                        <div class="wrap-input validate-input" data-validate="First name is required">
                            <label class="label-input" for="name-info">First name</label>
                            <input class="input input-form" type="text" id="name-info" name="name"
                                placeholder="Enter first name" value="${UserInfoChange.otherData.passData.name}" required>
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input validate-input" data-validate="Last name is required">
                            <label class="label-input" for="surname-info">Last name</label>
                            <input class="input input-form" type="text" id="surname-info" name="surname"
                                placeholder="Enter last name" value="${UserInfoChange.otherData.passData.surname}" required>
                            <span class="focus-input"></span>
                        </div>
                        <div class="wrap-input input-date">
                            <label class="label-input" for="birth-date">Date of birth</label>
                            <input class="input date-input" id="birth-date" type="date" name="birth date" 
                            value="${UserInfoChange.otherData.passData.birthDate}" required> 
                        </div>
                        <div class="wrap-input input-select">
                            <label class="label-input" for="gender">Gender</label>
                            <div>
                                ${UserInfoChange.renderDefaultGenderSelect() //TODO:   CHANGE DATE
                                }
                            </div>
                        </div>
                        
                        <div class="wrap-input">
                            <label class="label-input" for="image-goal">Profile image</label>
                            <input class="input-file" type="file" id="image-goal" name="image" class="input-file"
                                placeholder="Upload image">
                            <label for="image-goal" class="btn btn-tertiary js-labelFile" id="button-input-file">
                                <img class="upload" src="res/upload.png">
                                <span class="js-fileName" id="file-name">${UserInfoChange.getFileButtonText()}</span>
                            </label>
                        </div>

                        <div class="wrap-input" id="add-company-data-wrapper">
                            <label class="label-input" for="company">Company</label>
                            <input class="input input-form" id="company" value="${UserInfoChange.otherData.profData.company}"  type="text" placeholder="Input company name">
                        </div>

                        <div class="wrap-input" id="add-position-data-wrapper">
                            <label class="label-input" for="position">Position</label>
                            <input class="input input-form" id="position" value="${UserInfoChange.otherData.profData.position}" type="text" placeholder="Input position name">
                        </div>

                        <div class="wrap-input input-select">
                            <label class="label-input" for="education">Education</label>
                            <div>
                                ${UserInfoChange.renderDefaultEducationSelect()}
                            </div>
                        </div>

                        <div class="wrap-input" id="add-country-wrapper">
                            <label class="label-input" for="country">Country</label>
                            <input class="input input-form" id="country" value="${UserInfoChange.otherData.addressData.country}" type="text" placeholder="Input country">
                        </div>

                        <div class="wrap-input" id="add-locality-wrapper">
                            <label class="label-input" for="locality">Locality</label>
                            <input class="input input-form" id="locality" value="${UserInfoChange.otherData.addressData.locality}" type="text" placeholder="Input locality">
                        </div>

                        <div class="wrap-input" id="add-zip-wrapper">
                            <label class="label-input" for="zip">Zip code</label>
                            <input class="input input-form" id="zip" value="${UserInfoChange.otherData.addressData.zip}" type="text" placeholder="Input zip code">
                        </div>
                        
                        <div class="wrap-input" id="add-phone-wrapper">
                            <label class="label-input" for="phone">Phone</label>
                            <input class="input input-form" id="phone" value="${UserInfoChange.userInfo.phone}" type="tel" pattern="[+]{1}[0-9]{11,14}" placeholder="Input phone" required>
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
    return markup;
    },

    afterRender: async () => {
        const formInfo = document.querySelector('#register-info-form');
        let userID = auth.currentUser.uid;
        let fileUpload = document.getElementById("image-goal");
        let currentTime = DateTimeConvertUtils.convert();

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

        formInfo.addEventListener('submit', e => {
            e.preventDefault();
            let files = fileUpload.files;
            if (files.length == 0) {
                if (UserInfoChange.userInfo.imageUrl == null) {
                    alert("Picture was not selected. Default picture will be used instead.");
                    let downloadURL = "https://www.shareicon.net/data/512x512/2015/11/20/675119_sign_512x512.png";
                    UserInfoChange.sendFormData(formInfo, downloadURL, userID);
                } else {
                    alert("Picture was not changed.");
                    UserInfoChange.sendFormData(formInfo, null, userID);
                }
                return false;
            }

            let storageRef = storage.ref().child("profileImage/" + userID + "/" + currentTime);
            storageRef.put(files[0]).then((result) => {
                storageRef.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                    UserInfoChange.sendFormData(formInfo, downloadURL, userID);
                });
            });
        })
    },

    getFileButtonText: () => {
        if (UserInfoChange.userInfo.imageUrl != null && UserInfoChange.userInfo.imageUrl != "") {
            return "Photo is set. Click to change";
        } else {
            return "Upload photo"
        }
    },

    renderDefaultGenderSelect: () => {
        if (UserInfoChange.userInfo) {
            return `
        <select class="select-transaction" id="gender" name="gender">
            <option ${UserInfoChange.selectedCompare(UserInfoChange.otherData.passData.gender, "Male")}>Male</option>
            <option ${UserInfoChange.selectedCompare(UserInfoChange.otherData.passData.gender, "Female")}>Female</option>
            <option ${UserInfoChange.selectedCompare(UserInfoChange.otherData.passData.gender, "Other")}>Other</option>
        </select>
        `
        } else {
            return `
            <select class="select-transaction" id="gender" name="gender">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
        </select>
            `
        }
    },

    renderDefaultEducationSelect: () => {
        if (UserInfoChange.userInfo) {
            return `
        <select class="select-transaction" id="education" name="education">
            <option ${UserInfoChange.selectedCompare(UserInfoChange.otherData.profData.education, "Secondary")}>Secondary</option>
            <option ${UserInfoChange.selectedCompare(UserInfoChange.otherData.profData.education, "Undergraduate")}>Undergraduate</option>
            <option ${UserInfoChange.selectedCompare(UserInfoChange.otherData.profData.education, "Postgraduate")}>Postgraduate</option>
            <option ${UserInfoChange.selectedCompare(UserInfoChange.otherData.profData.education, "Other")}>Other</option>
        </select>
        `
        } else {
            return `
            <select class="select-transaction" id="education" name="education">
                <option>Secondary</option>
                <option>Undergraduate</option>
                <option>Postgraduate</option>
                <option>Other</option>
            </select>
            `
        }
    },

    renderDefaultCurrencySelect: () => {
        if (UserInfoChange.userInfo) {
            return `
            <select class="select-transaction" id="currency-goal" name="currency">
                <option ${UserInfoChange.selectedCompare(UserInfoChange.userInfo.currency, "USD")}>USD</option>
                <option ${UserInfoChange.selectedCompare(UserInfoChange.userInfo.currency, "EUR")}>EUR</option>
                <option ${UserInfoChange.selectedCompare(UserInfoChange.userInfo.currency, "BYN")}>BYN</option>
                <option ${UserInfoChange.selectedCompare(UserInfoChange.userInfo.currency, "RUB")}>RUB</option>
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
                    ${UserInfoChange.renderStandartOptions()}
                </optgroup>
                <optgroup label="Custom">
                    ${UserInfoChange.renderCustomOptions(UserInfoChange.customCategories)}
                </optgroup>
            </select>
            `
    },

    selectedCompare: (opt1, opt2) => {
        return opt1 == opt2 ? 'selected = "true"' : "";
    },

    // sendFormData: (formGoal, downloadURL, userID, key) => {
    //     let saveCategory = document.getElementById('save-option');
    //     if (UserInfoChange.status == "add") {
    //         if (UserInfoChange.categoryOther && saveCategory.checked) {
    //             DatabaseUtils.writeGoalData(UserInfoChange.getFormData(formGoal), downloadURL, userID, key, true);
    //         } else {
    //             DatabaseUtils.writeGoalData(UserInfoChange.getFormData(formGoal), downloadURL, userID, key, false);
    //         }
    //     } else {
    //         if (UserInfoChange.categoryOther && saveCategory.checked) {
    //             DatabaseUtils.editGoalData(UserInfoChange.getFormData(formGoal), downloadURL, userID, key, true);
    //         } else {
    //             DatabaseUtils.editGoalData(UserInfoChange.getFormData(formGoal), downloadURL, userID, key, false);
    //         }
    //     }
    //     window.location.hash = "#/goals";
    // },

    sendFormData: (formInfo, downloadURL, userID, userKey) => {
        DatabaseUtils.writeUserData(UserInfoChange.getFormData(formInfo), downloadURL, userID, UserInfoChange.userInfo);
        window.location.hash = "#/account";
    },

    getFormData: (formInfo) => {
        let professionalInfo = {
            company: formInfo['company'].value,
            position: formInfo['position'].value,
            education: formInfo['education'].value,
        }

        let addressInfo = {
            country: formInfo['country'].value,
            locality: formInfo['locality'].value,
            zip: formInfo['zip'].value,
        }

        return {
            name: formInfo['name'].value,
            surname:  formInfo['surname'].value,
            birthDate: formInfo['birth-date'].value,
            gender: formInfo['gender'].value,
            phone: formInfo['phone'].value,
            professionalInfo: professionalInfo,
            addressInfo: addressInfo,
        }
    },

    renderAside: () => {
        if (UserInfoChange.dataStatistics == null) {
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
                ${ShortStatisticsPartial.render(UserInfoChange.dataStatistics)}
        </aside>
        `
    },
};

export default UserInfoChange;