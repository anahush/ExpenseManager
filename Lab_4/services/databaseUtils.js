let DatabaseUtils = {
    writeGoalData: (fields, downloadLink, userID, currentTime) => {
        let goalRef = db.ref("goals/" + userID);
        goalRef.child(currentTime).set({
            description: fields.description,
            amount: fields.amount,
            type: fields.type,
            currency: fields.currency,
            category: fields.category,
            due: fields.due,
            imageUrl: downloadLink || "google.com"
        }).catch(e => {
            alert(e.message);
        });
    },

    writePlanData: (fields, downloadLink, userID, currentTime) => {
        let planRef = db.ref("plans/" + userID);
        planRef.child(currentTime).set({
            description: fields.description,
            amount: fields.amount,
            type: fields.type,
            currency: fields.currency,
            category: fields.category,
            date: fields.date,
            repeat: fields.repeat,
            account: fields.account,
            place: fields.place,
            imageUrl: downloadLink || "google.com"
        }).catch(e => {
            alert(e.message);
        });
    },

    writeTransactionData: (fields, downloadLink, userID, currentTime) => {
        let transactionRef = db.ref("transactions/" + userID);
        transactionRef.child(currentTime).set({
            description: fields.description,
            amount: fields.amount,
            type: fields.type,
            currency: fields.currency,
            category: fields.category,
            date: fields.date,
            account: fields.account,
            place: fields.place,
            imageUrl: downloadLink || "google.com"
        }).catch(e => {
            alert(e.message);
        })
    }
}

export default DatabaseUtils;