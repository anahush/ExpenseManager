import AddGoal from './views/add_goal.js';
import AddPlan from './views/add_plan.js';
import AddTransaction from './views/add_transaction.js';
import Goals from './views/goals.js';
import Login from './views/login.js';
import MainPage from './views/mainpage.js';
import Plans from './views/plans.js';
import Register from './views/register.js';
import Statistics from './views/statistics.js';
import Transactions from './views/transactions.js';
import ErrorPage from './views/error.js';
import Account from './views/account.js';
import UserInfoChange from './views/user_info_change.js';
import AdminPage from './views/admin_page.js';


import Utils from './services/utils.js';
import Navbar from './views/navbar.js';
import DatabaseUtils from './services/databaseUtils.js';

const routes = {
    '/': MainPage,
    '/add_goal': AddGoal,
    '/edit_goal/:id': AddGoal,
    '/edit_plan/:id': AddPlan,
    '/edit_transaction/:id': AddTransaction,
    '/add_plan': AddPlan,
    '/add_transaction': AddTransaction,
    '/goals': Goals,
    '/login': Login,
    '/plans': Plans,
    '/statistics': Statistics,
    '/transactions': Transactions,
    '/register': Register,
    '/account': Account,
    '/edit_user_info': UserInfoChange,
    '/admin': AdminPage,
};

let uid = null;
let timeEnter = null;

const router = async () => {
    const all = [];

    const header = null || document.querySelector('header');
    const content = null || document.querySelector('div.site-content');

    let request = Utils.parseRequestURL();
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '');
    let page = null;
    let edit = false;
    let errorStatusCode = 404;
    let isBlocked = false;


    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            header.innerHTML = await Navbar.render();
            edit = parsedURL.search("edit") != -1;
            uid = user.uid;

            let loginData = await DatabaseUtils.readLoginData(uid);
            if (loginData.status == "blocked") {
                page = ErrorPage;
                errorStatusCode = 403;
                isBlocked = true;
                window.location.hash = "#/error";
            } else if (parsedURL == '/admin') {
                if (loginData.role == "admin") {
                    page = routes[parsedURL]
                } else {
                    page = ErrorPage;
                    errorStatusCode = 403;
                    isBlocked = false;
                }
            } else {
                page = routes[parsedURL] ? routes[parsedURL] : ErrorPage;
                errorStatusCode = 404;
            }
        } else {
            header.innerHTML = await Navbar.renderOnlyLogin();
            if (parsedURL == '/login' || parsedURL == '/register') {
                page = routes[parsedURL] ? routes[parsedURL] : ErrorPage;
            } else {
                page = routes['/login'];
                window.location.hash = "#/login";
            }
        }
        await Navbar.afterRender();

        switch (page) {
            case Plans:
                {
                    Promise.all([
                        db.ref('plans/' + uid).once('value'),
                        db.ref('transactions/' + uid).once('value'),
                        db.ref('userCategories/' + uid).once('value')
                    ]).then(async (snapshots) => {
                        let plansData = snapshots[0].val();
                        let transactionsData = snapshots[1].val();
                        let categories = snapshots[2].val();
                        if (transactionsData) {
                            transactionsData = Object.values(transactionsData);
                        } else {
                            transactionsData = [{ type: "Income", amount: "0" }, { type: "Expense", amount: "0" }]
                        }
                        categories = categories ? Object.values(categories) : null;
                        if (plansData) {
                            let keys = Object.keys(plansData);
                            for (let key of keys) {
                                plansData[key].key = key;
                            }
                            content.innerHTML = await page.render(Object.values(plansData), transactionsData, categories);
                        } else {
                            content.innerHTML = await page.render(null, transactionsData, categories);
                        }
                        await page.afterRender();
                    })
                    break;
                }
            case Goals:
                {
                    Promise.all([
                        db.ref('goals/' + uid).once('value'),
                        db.ref('transactions/' + uid).once('value'),
                        db.ref('userCategories/' + uid).once('value')
                    ]).then(async (snapshots) => {
                        let goalsData = snapshots[0].val();
                        let transactionsData = snapshots[1].val();
                        let categories = snapshots[2].val();
                        if (transactionsData) {
                            transactionsData = Object.values(transactionsData);
                        } else {
                            transactionsData = [{ type: "Income", amount: "0" }, { type: "Expense", amount: "0" }]
                        }
                        categories = categories ? Object.values(categories) : null;
                        if (goalsData) {
                            let keys = Object.keys(goalsData);
                            for (let key of keys) {
                                goalsData[key].key = key;
                            }
                            content.innerHTML = await page.render(Object.values(goalsData), transactionsData, categories);
                        } else {
                            content.innerHTML = await page.render(null, transactionsData, categories);
                        }
                        await page.afterRender();
                    });
                    break;
                }
            case AddGoal:
                {
                    if (edit) {
                        let id = request.id.slice(1);
                        Promise.all([
                            db.ref('transactions/' + uid).once('value'),
                            db.ref('goals/' + uid + '/' + id).once('value'),
                            db.ref('userCategories/' + uid).once('value')
                        ]).then(async (snapshots) => {
                            let transactionsData = snapshots[0].val();
                            let dataChange = snapshots[1].val();
                            let categories = snapshots[2].val();
                            transactionsData = transactionsData ? Object.values(transactionsData) : null;
                            categories = categories ? Object.values(categories) : null;

                            content.innerHTML = await page.render(transactionsData, dataChange, categories, id, 'edit');
                            await page.afterRender();
                        })
                    } else {
                        Promise.all([
                            db.ref('transactions/' + uid).once('value'),
                            db.ref('userCategories/' + uid).once('value')
                        ]).then(async (snapshots) => {
                            let transactionsData = snapshots[0].val();
                            let categories = snapshots[1].val();
                            transactionsData = transactionsData ? Object.values(transactionsData) : null;
                            categories = categories ? Object.values(categories) : null;
                            content.innerHTML = await page.render(transactionsData, null, categories, null, 'add');
                            await page.afterRender();
                        })
                    }
                    break;
                }
            case AddPlan:
                {
                    if (edit) {
                        let id = request.id.slice(1);
                        Promise.all([
                            db.ref('transactions/' + uid).once('value'),
                            db.ref('plans/' + uid + '/' + id).once('value'),
                            db.ref('userCategories/' + uid).once('value')
                        ]).then(async (snapshots) => {
                            let transactionsData = snapshots[0].val();
                            let dataChange = snapshots[1].val();
                            let categories = snapshots[2].val();
                            transactionsData = transactionsData ? Object.values(transactionsData) : null;
                            categories = categories ? Object.values(categories) : null;

                            content.innerHTML = await page.render(transactionsData, dataChange, categories, id, 'edit');
                            await page.afterRender();
                        })
                    } else {
                        Promise.all([
                            db.ref('transactions/' + uid).once('value'),
                            db.ref('userCategories/' + uid).once('value')
                        ]).then(async (snapshots) => {
                            let transactionsData = snapshots[0].val();
                            let categories = snapshots[1].val();
                            transactionsData = transactionsData ? Object.values(transactionsData) : null;
                            categories = categories ? Object.values(categories) : null;
                            content.innerHTML = await page.render(transactionsData, null, categories, null, 'add');
                            await page.afterRender();
                        })
                    }
                    break;
                }
            case AddTransaction:
                {
                    Promise.all([
                        db.ref('transactions/' + uid).once('value'),
                        db.ref('userCategories/' + uid).once('value')
                    ]).then(async (snapshots) => {
                        let dataTransactions = snapshots[0].val();
                        let categories = snapshots[1].val();
                        categories = categories ? Object.values(categories) : null;

                        if (edit) {
                            let id = request.id.slice(1);
                            content.innerHTML = await page.render(Object.values(dataTransactions), dataTransactions[id], categories, id, "edit");
                        } else {
                            dataTransactions = dataTransactions ? Object.values(dataTransactions) : null;
                            content.innerHTML = await page.render(dataTransactions, null, categories, null, "add");
                        }
                        await page.afterRender();
                    });
                    break;
                }
            case UserInfoChange:
                {
                    let renderInfo = await DatabaseUtils.loadUserDataForIndex(uid);
                   
                    content.innerHTML = await page.render(renderInfo.dataTransactions,
                        renderInfo.userInfo,
                        renderInfo.otherData);
                    await page.afterRender();
                    
                    break;
                }
            case Account:
                {
                    let renderInfo = await DatabaseUtils.loadUserDataForIndex(uid);
                   
                    content.innerHTML = await page.render(renderInfo.dataTransactions,
                        renderInfo.userInfo,
                        renderInfo.otherData);
                    await page.afterRender();

                    break;
                }
            case Statistics:
                {
                    Promise.all([
                        db.ref('transactions/' + uid).once('value'),
                        db.ref('userCategories/' + uid).once('value')
                    ]).then(async (snapshots) => {
                        let dataTransactions = snapshots[0].val();
                        let categories = snapshots[1].val();
                        dataTransactions = dataTransactions ? Object.values(dataTransactions) : null;
                        categories = categories ? Object.values(categories) : null;

                        content.innerHTML = await page.render(dataTransactions, categories);
                        await page.afterRender();
                    })
                    break;
                }
            case Transactions:
                {
                    Promise.all([
                        db.ref('transactions/' + uid).once('value'),
                        db.ref('userCategories/' + uid).once('value')
                    ]).then(async (snapshots) => {
                        let transactionsData = snapshots[0].val();
                        let categories = snapshots[1].val();
                        categories = categories ? Object.values(categories) : null;
                        if (transactionsData) {
                            let keys = Object.keys(transactionsData);
                            for (let key of keys) {
                                transactionsData[key].key = key;
                            }
                            content.innerHTML = await page.render(Object.values(transactionsData), categories);
                        } else {
                            content.innerHTML = await page.render(null, categories);
                        }
                        await page.afterRender();
                    })
                    break;
                }
            case MainPage:
                {
                    Promise.all([
                        db.ref('transactions/' + uid).once('value'),
                        db.ref('goals/' + uid).once('value'),
                        db.ref('plans/' + uid).once('value')
                    ]).then(async (snapshots) => {
                        let transactionsData = snapshots[0].val();
                        let goalsData = snapshots[1].val();
                        let plansData = snapshots[2].val();
                        if (!transactionsData) {
                            transactionsData = null;
                        } else {
                            transactionsData = Object.values(transactionsData);
                        }
                        if (!goalsData) {
                            goalsData = null;
                        } else {
                            goalsData = Object.values(goalsData);
                        }
                        if (!plansData) {
                            plansData = null;
                        } else {
                            plansData = Object.values(plansData);
                        }
                        content.innerHTML = await page.render(transactionsData, goalsData, plansData);
                        await page.afterRender();
                    });
                    break;
                }
            case ErrorPage:
                {
                    let date = new Date().toLocaleString();
                    let dataLogin = await DatabaseUtils.readLoginData(uid);
                    content.innerHTML = await page.render(window.location.href, dataLogin, date, errorStatusCode, isBlocked);
                    await page.afterRender()
                    break;
                }
            case AdminPage:
                {
                    Promise.all([
                        db.ref('transactions/' + uid).once('value'),
                    ]).then(async (snapshots) => {
                        let dataTransactions = snapshots[0].val();
                        
                        dataTransactions = dataTransactions ? Object.values(dataTransactions) : null;

                        let allUserData = await DatabaseUtils.getAllUsers();
                        let allErrorsData = await DatabaseUtils.getAllErrors();
                        let allUsageLogsData = await DatabaseUtils.getAllUsageLogs();
                        content.innerHTML = await page.render(dataTransactions, allUserData, allErrorsData, allUsageLogsData);
                        await page.afterRender()
                    })
                    break;
                }
            default:
                {
                    content.innerHTML = await page.render();
                    await page.afterRender();
                    break;
                }
        }
    });

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

window.addEventListener('hashchange', () => {
    router();
    hamburgerOnlyClose();
});
window.addEventListener('DOMContentLoaded', router);
auth.onAuthStateChanged(firebaseUser => {
    if (window.location.hash == "#/" && !firebaseUser) {
        router();
    }
})

window.addEventListener('beforeunload', function(e) {
    let timeLeave = new Date()
    if (uid != null) {
    DatabaseUtils.writeUsageLogData(uid,
        timeEnter.toLocaleString(),
        timeLeave.toLocaleString(),
        (Math.round(((timeLeave -  timeEnter % 86400000) % 3600000) / 60000)) + " min(s)")}
    });

window.addEventListener('DOMContentLoaded', function(e) {
    timeEnter = new Date()
});
