import DatabaseUtils from "../services/databaseUtils.js";
import ShortStatisticsPartial from "./shortStatisticsPartial.js";
import CSVUtils from "../services/csvUtils.js";

let AdminPage = {
    render: async (dataStatistics, allUsersData, dataError, dataUsageLogs) => {
        AdminPage.dataStatistics = dataStatistics;
        AdminPage.allUsersData = allUsersData;
        AdminPage.dataError = dataError;
        AdminPage.dataUsageLogs = dataUsageLogs;
        AdminPage.tables = ["Users", "Errors", "Logs"];
        AdminPage.current = "Users"
        return `
            <div class="site-content">
            ${AdminPage.renderAside()}
            <main class="transactions account">
            <details open>
            <summary>Filters</summary>
            <div class="details-content">
                <div class="transactions-first-row transactions">
                ${AdminPage.renderSelectTable()}
                <button class="text-like-button download-button admin-download-button" id="download-csv">Download table as csv</button>
                </div>
            </div>
        </details>
        <div id="to-replace">
            <p>Select table</p>
        </div>
            </main>
        </div>
            `
    },

    afterRender: async () => {
        let selectTable = document.getElementById('admin-page-select-table');
        if (selectTable) {
            selectTable.addEventListener('change', async(e) => {
                await AdminPage.renderTable(e);
            });
        }
        let e = {
            target :{
                value: "Users"
            }
        };
        await AdminPage.renderTable(e);
    },

    setTableEventListeners: async (data) => {
        if (data == null) {
            return;
        }

        for (let elem of data) {
            let key = elem.key;
            let status = elem.status;
            let button = document.getElementById(`user-button-${key}`);
            if (button) {
                button.addEventListener('click', async () => {
                    await AdminPage.userButtonClicked(key, status);
                })
            }
        }

        let buttonDownload = document.getElementById("download-csv");
        if (buttonDownload != null) {
            buttonDownload.addEventListener('click', () => {
                let filename;
                switch (AdminPage.current) {
                    case "Users":
                        filename = "users.csv";
                        break;
                    case "Errors":
                        filename = "errors.csv";
                        break;
                    case "Logs":
                        filename = "logs.csv";
                        break;        
                }
                CSVUtils.exportTableToCSV(filename)
            })
        }
    },

    userButtonClicked: async (key, status) => {
        if (status == "blocked") {
            await DatabaseUtils.setUserStatus("active", key);
        } else  {
            await DatabaseUtils.setUserStatus("blocked", key);
        }
        await AdminPage.rerenderUserTableFromDatabase();
    },

    renderAside: () => {
        if (AdminPage.dataStatistics == null) {
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
                ${ShortStatisticsPartial.render(AdminPage.dataStatistics)}
        </aside>
        `
    },

    renderSelectTable: () => {
        return `
        <select class="select-tag select-tag-tables" id="admin-page-select-table">
            <option selected = "true">Users</option>
            <option>Errors</option>
            <option>Logs</option>
        </select>
        `
    },

    renderTablesOptions: () => {
        let markup = ``;
        AdminPage.tables.forEach(table => {
            markup += `<option>${table}</option>`
        })
        return markup;
    },

    rerenderUserTableFromDatabase: async () => {
        let allUsersData = await DatabaseUtils.getAllUsers();
        AdminPage.allUsersData = allUsersData;
        let e = {
            target :{
                value: "Users"
            }
        };
        await AdminPage.renderTable(e);
    },

    renderTable: async (e) => {
        AdminPage.current = e.target.value;
        let t_data;
        switch(AdminPage.current) {
            case "Errors":
                t_data = AdminPage.renderTableErrors();
                break;
            case "Users":
                t_data = AdminPage.renderTableUsers();
                break;
            case "Logs":
                t_data = AdminPage.renderTableLogs();    
        }

        let temp = document.getElementById('to-replace');
        let tableTag = temp ? temp : document.getElementById('table-admin-page');
        let tableNew = document.createElement('table');
        tableNew.setAttribute('class', 'table-transactions');
        tableNew.setAttribute('id', 'table-admin-page');
        tableNew.innerHTML = t_data.markup;
        tableTag.replaceWith(tableNew);

        await AdminPage.setTableEventListeners(t_data.data)
    },

    renderTableErrors: () => {
        let data = AdminPage.dataError.map(x => ({
            username: x.username,
            date: x.date,
            pageRef: x.page_to_error, 
            statusCode: x.statusCode,
        }));
        return {
            markup: `
        <table class="table-transactions" id="table-statistics">
           <thead>
                <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Link</th>
                    <th scope="col">Error status code</th>
                    <th scope="col">Date</th>
                </tr>
            </thead>
            <tbody>
                ${AdminPage.renderTableContent(data, "errors")}
            </tbody>
        </table>
        `,
        data: data}
    },

    renderTableLogs: () => {
        let data = AdminPage.dataUsageLogs.map(x => ({
            uid: x.uid,
            dateEnter: x.dateEnter,
            dateLeave: x.dateLeave,
            timeBeing: x.timeBeing,
        }));

        return {
            markup: `
        <table class="table-transactions" id="table-statistics">
           <thead>
                <tr>
                    <th scope="col">UID</th>
                    <th scope="col">Entered site</th>
                    <th scope="col">Left site</th>
                    <th scope="col">Spent on site</th>
                </tr>
            </thead>
            <tbody>
                ${AdminPage.renderTableContent(data, "logs")}
            </tbody>
        </table>
        `,
        data: data}
    },

    renderTableUsers: () => {
        let data = AdminPage.allUsersData.map(x => ({
            key: x.key,
            username: x.value.username,
            email: x.value.email,
            role: x.value.role,
            status: x.value.status ? x.value.status : "active",
        }));
        return {
        markup: `
        <table class="table-transactions" id="table-statistics">
           <thead>
                <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
                ${AdminPage.renderTableContent(data, "users")}
            </tbody>
        </table>
        `,
        data: data
        };
    },

    renderTableContent: (data, type) => {
        let markup = ``;
        switch (type) {
            case "users":
                data.forEach(element => {
                    markup += AdminPage.renderTRUsers(element);
                });
                break;
            case "errors":
                data.forEach(element => {
                    markup += AdminPage.renderTrErrors(element);
                });
                break;
            case "logs":
                data.forEach(element => {
                    markup += AdminPage.renderTrLogs(element);
                });  
                break;  
        }
        return markup;
    },

    renderTRUsers: (element) => {
        return `
        <tr>
            <td data-th="Username"><time>${element.username}</time></td>
            <td data-th="Email">${element.email}</td>
            <td data-th="Role">${element.role ? element.role : "user"}</td>
            <td data-th="Status">
            <button class="text-like-button open-modal" id="user-button-${element.key}">${element.status}</button></td>
        </tr>
        `
    },

    renderTrErrors: (element) => {
        return `
        <tr>
            <td data-th="Username"><time>${element.username}</time></td>
            <td data-th="Link">${element.pageRef}</td>
            <td data-th="Error status code">${element.statusCode}</td>
            <td data-th="Date"><time>${element.date}</time></td>
        </tr>
        `
    },

    renderTrLogs: (element) => {
        return `
        <tr>
            <td data-th="UID"><time>${element.uid}</time></td>
            <td data-th="Entered site">${element.dateEnter}</td>
            <td data-th="Left site">${element.dateLeave}</td>
            <td data-th="Spent on site"><time>${element.timeBeing}</time></td>
        </tr>
        `
    },
};

export default AdminPage;