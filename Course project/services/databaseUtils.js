import DateTimeConvertUtils from "./dateTimeConvertUtils.js";

const DatabaseUtils = {
    saveCategory: (userID, category, otherCategorySelected) => {
        if (otherCategorySelected) {
            let currentTime = DateTimeConvertUtils.convert();
            let categoryRef = db.ref("userCategories/" + userID);
            categoryRef.child(currentTime).set({
                name: category
            })
        }
    },

    writeGoalData: (fields, downloadLink, userID, key, otherCategorySelected) => {
        let goalRef = db.ref("goals/" + userID);
        let currentTime = DateTimeConvertUtils.convert();
        goalRef.child(key).set({
            description: fields.description,
            amount: fields.amount,
            type: fields.type,
            currency: fields.currency,
            category: fields.category,
            due: fields.due,
            contributed: "0",
            imageUrl: downloadLink
        }).then(() => {
            DatabaseUtils.saveCategory(userID, fields.category, otherCategorySelected);
        }).catch(e => {
            alert(e.message);
        });
    },

    writeUserData: (fields, downloadLink, userID, userInfo) => {
        let userRef = db.ref("userInfo/");
        let profUserRef = db.ref("profUserInfo/");
        let passUserRef = db.ref("passUserInfo/");
        let addressUserRef = db.ref("addressUserInfo/");

        let passKey = userInfo.passKey;
        let profKey = userInfo.profKey;
        let addressKey = userInfo.addressKey;
        let loginKey = userInfo.loginKey;

        profUserRef.child(profKey).set({
            company: fields.professionalInfo.company,
            position: fields.professionalInfo.position,
            education: fields.professionalInfo.education,
        });

        passUserRef.child(passKey).set({
            name: fields.name,
            surname: fields.surname,
            gender: fields.gender,
            birthDate: fields.birthDate,
        });

        addressUserRef.child(addressKey).set({
            country: fields.addressInfo.country,
            locality: fields.addressInfo.locality,
            zip: fields.addressInfo.zip,
        });

        userRef.child(userID).set({
            profKey: profKey,
            passKey: passKey,
            loginKey: loginKey,
            addressKey: addressKey,
            phone: fields.phone,
            imageUrl: downloadLink ? downloadLink : userInfo.imageUrl,
        });
    },

    readLoginData: async(uid) => {
        let userInfo = await Promise.all([
            db.ref('userInfo/' + uid).once('value')
        ]);
        userInfo = userInfo[0].val();
        userInfo = userInfo ? userInfo : null;

        let dataLogin = null;
        if (userInfo != null && userInfo.loginKey != null) {
            dataLogin = await Promise.all([
                db.ref('users/' + userInfo.loginKey).once('value')     // TODO: change to 'userLoginInfo/'
            ])
            
            dataLogin = dataLogin[0].val();
            dataLogin = dataLogin ? dataLogin : null;
        }
        return dataLogin;
    },

    readUserData: async (fields) => {

        Promise.all([
            db.ref('addressUserInfo/' + fields[0]).once('value'),
            db.ref('loginUserInfo/' + fields[1]).once('value'),
            db.ref('passUserInfo/' + fields[2]).once('value'),
            db.ref('profUserInfo/' + fields[4]).once('value'),
        ]).then(async (snapshots) => {
            let addressInfo = snapshots[0].val();
            let loginInfo = snapshots[1].val();
            let passInfo = snapshots[2].val();
            let profInfo = snapshots[3].val();

            addressInfo = addressInfo ? Object.values(addressInfo) : null;
            loginInfo = loginInfo ? Object.values(loginInfo) : null;
            passInfo = passInfo ? Object.values(passInfo) : null;
            profInfo = profInfo ? Object.values(profInfo) : null;

            let retData = {
                addressData: addressInfo,
                loginData: loginInfo,
                passData: passInfo,
                profData: profInfo,
            }

            return retData
        }).catch(err => {
            console.log(err);
        })
    },

    doesExist: (ref, value) => {
        return ref.equalTo(value) != null
    },

    editGoalData: (fields, downloadLink, userID, key, otherCategorySelected) => {
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
        goalRef.child(key).update(updateData).then(() => {
            DatabaseUtils.saveCategory(userID, fields.category, otherCategorySelected);
        }).catch(e => {
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

    writePlanData: (fields, downloadLink, userID, key, otherCategorySelected) => {
        let planRef = db.ref("plans/" + userID);
        planRef.child(key).set({
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
        }).then(() => {
            DatabaseUtils.saveCategory(userID, fields.category, otherCategorySelected);
        }).catch(e => {
            alert(e.message);
        });
    },

    editPlanData: (fields, downloadLink, userID, key, otherCategorySelected) => {
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
        planRef.child(key).update(updateData).then(() => {
            DatabaseUtils.saveCategory(userID, fields.category, otherCategorySelected);
        }).catch(e => {
            alert(e.message);
        });
    },

    deletePlan: (i, userID) => {
        let planRef = db.ref("plans/" + userID);
        planRef.child(i).remove();
    },

    writeTransactionData: (fields, downloadLink, userID, key, otherCategorySelected) => {
        let transactionRef = db.ref("transactions/" + userID);
        transactionRef.child(key).set({
            description: fields.description,
            amount: fields.amount,
            type: fields.type,
            currency: fields.currency,
            category: fields.category,
            date: fields.date,
            account: fields.account,
            place: fields.place,
            imageUrl: downloadLink 
        }).then(() => {
            DatabaseUtils.saveCategory(userID, fields.category, otherCategorySelected);
        }).catch(e => {
            alert(e.message);
        })
    },

    writeErrorData: (username, pageRef, date, statusCode) => {
        let errorRef = db.ref("errorLog");

        let key = 0;
        db.ref('errorLog/').limitToLast(1).once("value").then((snapshot) => {
            let val = snapshot.val();
            if (val == null || typeof val == "undefined") {
                key = 0
            } else {
                let lastKey = Number(Object.keys(val)[0]);
                if (lastKey != null && typeof lastKey != "undefined" && lastKey >= 0) {
                    key = lastKey + 1;
                }
            }

            errorRef.child(key).set({
                username: username,
                page_to_error: pageRef, 
                statusCode: statusCode,
                date: date,
            })
        })
    },

    writeUsageLogData: (uid, dateEnter, dateLeave, timeBeing) => {
        let loginLogRef = db.ref("usageLog");

        let key = 0;
        db.ref('usageLog/').limitToLast(1).once("value").then((snapshot) => {
            let val = snapshot.val();
            if (val == null || typeof val == "undefined") {
                key = 0
            } else {
                let lastKey = Number(Object.keys(val)[0]);
                if (lastKey != null && typeof lastKey != "undefined" && lastKey >= 0) {
                    key = lastKey + 1;
                }
            }

            loginLogRef.child(key).set({
                uid: uid,
                dateEnter: dateEnter,
                dateLeave: dateLeave,
                timeBeing: timeBeing,
            })
        })
    },
    
    editTransactionData: (fields, downloadLink, userID, key, otherCategorySelected) => {
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
        transactionRef.child(key).update(updateData).then(() => {
            DatabaseUtils.saveCategory(userID, fields.category, otherCategorySelected);
        }).catch(e => {
            alert(e.message);
        });
    },

    getKey: (tableName, userID) => {
        let key = 0;
        tableName = userID ? tableName + userID + "/" : tableName;
        db.ref(tableName).limitToLast(1).once("value").then((snapshot) => {
            let val = snapshot.val();
            if (val == null || typeof val == "undefined") {
                return;
            }
            let lastKey = Number(Object.keys(val)[0]);
            if (lastKey != null && typeof lastKey != "undefined" && lastKey >= 0) {
                key = lastKey + 1;
            }
            return key;
        });
    },

    deleteTransaction: (i, userID) => {
        let transactionRef = db.ref("transactions/" + userID);
        transactionRef.child(i).remove();
    },

    loadUserDataForIndex: async (uid) => {
        let userInfo = await Promise.all([
            db.ref('userInfo/' + uid).once('value')
        ]);
        userInfo = userInfo[0].val();
        userInfo = userInfo ? userInfo : null;

        let dataTransactions = await Promise.all([
            db.ref('transactions/' + uid).once('value'),
        ]);
        dataTransactions = dataTransactions[0].val();
        dataTransactions = dataTransactions ? Object.values(dataTransactions) : null;


        let dataAddress = await Promise.all([
            db.ref('addressUserInfo/' + userInfo.addressKey).once('value')
        ])
        
        dataAddress = dataAddress[0].val();
        dataAddress = dataAddress ? dataAddress : null;

        let dataLogin = await Promise.all([
            db.ref('users/' + userInfo.loginKey).once('value')     // TODO: change to 'userLoginInfo/'
        ])
        
        dataLogin = dataLogin[0].val();
        dataLogin = dataLogin ? dataLogin : null;

        let dataPassport = await Promise.all([
            db.ref('passUserInfo/' + userInfo.passKey).once('value')
        ])
        
        dataPassport = dataPassport[0].val();
        dataPassport = dataPassport ? dataPassport : null;

        let dataProfile = await Promise.all([
            db.ref('profUserInfo/' + userInfo.profKey).once('value')
        ])
        
        dataProfile = dataProfile[0].val();
        dataProfile = dataProfile ? dataProfile : null;

        let otherData = {
            addressData: dataAddress,
            loginData: dataLogin,
            passData: dataPassport,
            profData: dataProfile,
        }

        return {
            dataTransactions,
            userInfo,
            otherData
        }
    },

    getAllUsers: async () => {
        let users = [];
        let ref = db.ref("users/");
        let temp = await ref.once("value").then((snapshot) => {
            for (const [key, value] of Object.entries(snapshot.val())) {
                users.push({
                    key: key,
                    value: value,
                });
              }              
          });
        return users;
    },

    getAllErrors: async () => {
        let errors = [];
        let ref = db.ref("errorLog");
        let temp = await ref.once("value").then((snapshot) => {
            for (const [key, value] of Object.entries(snapshot.val())) {
                errors.push(value);
              } 
        });
        return errors;
    },

    getAllUsageLogs: async () => {
        let logs = [];
        let ref = db.ref("usageLog");
        let temp = await ref.once("value").then((snapshot) => {
            for (const [key, value] of Object.entries(snapshot.val())) {
                logs.push(value);
            }
        });
        return logs;
    },

    setUserStatus: async(status, key) => {
        let ref = db.ref("users/" + key + "/");
        ref.child("status").set(status);
    },

}

export default DatabaseUtils;