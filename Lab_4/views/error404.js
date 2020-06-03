let Error404 = {
    render: async() => {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Page Not Found</title>
            <link rel="stylesheet" href="styles.css" type="text/css">
        </head>
        <body>
            <div id="error-message">
            <h2 class="error-text">404</h2>
            <h1 class="error-text">Page Not Found</h1>
            <p class="error-text">Please check the URL for mistakes and try again.</p>
            </div>
        </body>
        </html>
        `
    }
}

export default Error404;