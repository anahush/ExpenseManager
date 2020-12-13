import DatabaseUtils from "../services/databaseUtils.js";

let ErrorPage = {
    render: async(pageRef, dataLogin, date, statusCode, isBlocked) => {
        ErrorPage.pageRef = pageRef
        ErrorPage.dataLogin = dataLogin
        ErrorPage.date = date
        ErrorPage.statusCode = statusCode
        ErrorPage.isBlocked = isBlocked
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Page Not Found</title>
            <link rel="stylesheet" href="css/style.css">
            </head>
        <body>
            <div id="error-message">
            <h2 class="error-text">${ErrorPage.statusCode}</h2>
            <h1 class="error-text">${ErrorPage.getErrorMessage()}</h1>
            <p class="error-text">${ErrorPage.getErrorHint()}</p>
            </div>
        </body>
        </html>
        `
    },

    afterRender: () => {
        let username = "undefined username"
        if (ErrorPage.dataLogin != null) {
            username = ErrorPage.dataLogin.username;
        }
        if (!ErrorPage.isBlocked) {
            DatabaseUtils.writeErrorData(username, ErrorPage.pageRef, ErrorPage.date, ErrorPage.statusCode)
        }
    },

    getErrorMessage: () => {
        switch (ErrorPage.statusCode) {
            case 404:
                return "Page Not Found";
            case 403:
                if (ErrorPage.isBlocked) {
                   return "You have been blocked"
                } else {
                    return "Permission denied";
                }
            default:
                return "Other exception";
        }
    },

    getErrorHint: () => {
        switch (ErrorPage.statusCode) {
            case 404:
                return "Please check the URL for mistakes and try again.";
            case 403:
                if (ErrorPage.isBlocked) {
                   return "If you consider this to be incorrect, please, contact site admin."
                } else {
                    return "Please check the URL for mistakes and try again.";
                }
            default:
                return "Other exception";
        }
    },
}

export default ErrorPage;