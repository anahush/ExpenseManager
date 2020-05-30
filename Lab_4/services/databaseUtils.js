let DatabaseUtils = {
    writeGoalData: (fields, downloadLink, userID, key) => {
        let goalRef = db.ref("goals/" + userID);
        goalRef.child(key).set({
            description: fields.description,
            amount: fields.amount,
            type: fields.type,
            currency: fields.currency,
            category: fields.category,
            due: fields.due,
            contributed: "0",
            imageUrl: downloadLink || "google.com"
        }).catch(e => {
            alert(e.message);
        });
    },

    editGoalData: (fields, downloadLink, userID, key) => {
        let goalRef = db.ref("goals/" + userID);
        let updateData;
        if (downloadLink) {
            updateData = {
                description: fields.description,
                amount: fields.amount,
                type: fields.type,
                currency: fields.currency,
                category: fields.category,
                due: fields.due,
                imageUrl: downloadLink
            };
        } else {
            updateData = updateData = {
                description: fields.description,
                amount: fields.amount,
                type: fields.type,
                currency: fields.currency,
                category: fields.category,
                due: fields.due
            };
        }
        goalRef.child(key).update(updateData).catch(e => {
            alert(e.message);
        });
    },

    addRemoveData: (i, amountNew, previousContributed, userID) => {
        let goalRef = db.ref("goals/" + userID);

        let updateData = { contributed: Number(previousContributed) + Number(amountNew) }

        goalRef.child(i).update(updateData).catch(e => {
            alert(e.message);
        });
    },

    deleteGoal: (i, userID) => {
        let goalRef = db.ref("goals/" + userID);
        goalRef.child(i).remove();
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

    editPlanData: (fields, downloadLink, userID, key) => {
        let planRef = db.ref("plans/" + userID);
        let updateData;
        if (downloadLink) {
            updateData = {
                description: fields.description,
                amount: fields.amount,
                type: fields.type,
                currency: fields.currency,
                category: fields.category,
                date: fields.date,
                repeat: fields.repeat,
                account: fields.account,
                place: fields.place,
                imageUrl: downloadLink
            };
        } else {
            updateData = updateData = {
                description: fields.description,
                amount: fields.amount,
                type: fields.type,
                currency: fields.currency,
                category: fields.category,
                date: fields.date,
                repeat: fields.repeat,
                account: fields.account,
                place: fields.place,
            };
        }
        planRef.child(key).update(updateData).catch(e => {
            alert(e.message);
        });
    },

    deletePlan: (i, userID) => {
        let planRef = db.ref("plans/" + userID);
        planRef.child(i).remove();
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
    },

    editTransactionData: (fields, downloadLink, userID, key) => {
        let transactionRef = db.ref("transactions/" + userID);
        let updateData;
        if (downloadLink) {
            updateData = {
                description: fields.description,
                amount: fields.amount,
                type: fields.type,
                currency: fields.currency,
                category: fields.category,
                date: fields.date,
                account: fields.account,
                place: fields.place,
                imageUrl: downloadLink
            }
        } else {
            updateData = {
                description: fields.description,
                amount: fields.amount,
                type: fields.type,
                currency: fields.currency,
                category: fields.category,
                date: fields.date,
                account: fields.account,
                place: fields.place,
            }
        }

        planRef.child(key).update(updateData).catch(e => {
            alert(e.message);
        });
    },

    deleteTransaction: (i, userID) => {
        let transactionRef = db.ref("transactions/" + userID);
        transactionRef.child(i).remove();
    },
}

export default DatabaseUtils;