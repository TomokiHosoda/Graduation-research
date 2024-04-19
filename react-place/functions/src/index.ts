import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
//const cors = require('cors')({ origin: true });

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://login-react-app-e588f-default-rtdb.firebaseio.com"
});


exports.setExpertClaims = functions.https.onCall(async(data, context) => {
    const uid = context.auth?.uid;

    if(!uid) {
        throw new functions.https.HttpsError('unauthenticated', '認証されていません');
    }

    // カスタムクレームを設定
    try {
        await admin.auth().setCustomUserClaims(uid, { expert: true });
        return console.log('「Expert」に設定しました'); 
    } catch (error) {
        throw new functions.https.HttpsError('internal', 'カスタムクレームの設定中にエラーが発生しました');
    }
});

exports.setBeginnerClaims = functions.https.onCall(async (data, context) => {
    const uid = context.auth?.uid;

    if(!uid) {
        throw new functions.https.HttpsError('unauthenticated', '認証されていません');
    }

    // カスタムクレームを設定
    try {
        await admin.auth().setCustomUserClaims(uid, { beginner: true });
        return { message: `ユーザータイプを 「Beginner」 に設定しました` };
    } catch (error) {
        throw new functions.https.HttpsError('internal', 'カスタムクレームの設定中にエラーが発生しました');
    }
});