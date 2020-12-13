import ShortStatisticsPartial from "./shortStatisticsPartial.js";

let Account = {
    render: async (dataStatistics, personalData, otherData) => {
        Account.dataStatistics = dataStatistics;
        Account.personalData = personalData;
        Account.Data = otherData;

        return `
            <div class="site-content">
            ${Account.renderAside()}
            <main class="transactions account">
                <h1>Personal data      <a class="header-link" href="#/edit_user_info">Edit</a>       ${Account.renderAdmin()}</h1>
                <div class="personal-data">
                    <div class="two-column">
                        <img class="personal-image img-border" src="${Account.personalData.imageUrl}">
                    </div>
                    <div class="two-column">
                        <p class="personal-label"><b>Name:</b> ${Account.Data.passData.name}</p>
                        <p class="personal-label"><b>Surname:</b> ${Account.Data.passData.surname}</p>
                        <p class="personal-label"><b>Gender:</b> ${Account.Data.passData.gender}</p>
                        <p class="personal-label"><b>Date of birth:</b> ${Account.Data.passData.birthDate}</p>
                        <p class="personal-label"></br></p>

                        <h3>Contact info:</h3>
                        <div class="text-block-wrapper">
                            <p class="personal-label"><b>Phone:</b> ${Account.personalData.phone}</p>
                            <p class="personal-label"><b>Email:</b> ${Account.Data.loginData.email}</p>
                        </div>
                    </div>
                    <div class="two-column text">
                        <div class="address-info">
                            <h3></br>Address:</h3>
                            <div class="text-block-wrapper">
                                <p class="personal-label"><b>Country:</b> ${Account.Data.addressData.country}</p>
                                <p class="personal-label"><b>Locality:</b> ${Account.Data.addressData.locality}</p>
                                <p class="personal-label"><b>Postal code:</b> ${Account.Data.addressData.zip}</p>
                            </div>
                        </div>
                    </div>
                    <div class="two-column">
                        <div class="professional-info">
                            <h3></br>Professional information:</h3>
                            <div class="text-block-wrapper">
                                <p class="personal-label"><b>Company:</b> ${Account.Data.profData.company}</p>
                                <p class="personal-label"><b>Position:</b> ${Account.Data.profData.position}</p>
                                <p class="personal-label"><b>Education:</b> ${Account.Data.profData.education}</p>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </main>
        </div>
            `
    },

    afterRender: async () => {
        
    },

    renderAside: () => {
        if (Account.dataStatistics == null) {
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
                ${ShortStatisticsPartial.render(Account.dataStatistics)}
        </aside>
        `
    },

    renderAdmin: () => {
        if (Account.Data.loginData.role == "admin") {
            return `
            <a class="header-link" href="#/admin">Admin page</a>`
        } else {
            return ``
        }
    }
};

export default Account;