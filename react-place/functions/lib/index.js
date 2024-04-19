"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
//const cors = require('cors')({ origin: true });
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://login-react-app-e588f-default-rtdb.firebaseio.com"
});
exports.setExpertClaims = functions.https.onCall(async (data, context) => {
    var _a;
    const uid = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid;
    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', '認証されていません');
    }
    // カスタムクレームを設定
    try {
        await admin.auth().setCustomUserClaims(uid, { expert: true });
        return { message: `ユーザータイプを 「Expert」 に設定しました` };
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', 'カスタムクレームの設定中にエラーが発生しました');
    }
});
exports.setBeginnerClaims = functions.https.onCall(async (data, context) => {
    var _a;
    const uid = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid;
    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', '認証されていません');
    }
    // カスタムクレームを設定
    try {
        await admin.auth().setCustomUserClaims(uid, { beginner: true });
        return { message: `ユーザータイプを 「Beginner」 に設定しました` };
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', 'カスタムクレームの設定中にエラーが発生しました');
    }
});
//# sourceMappingURL=index.js.map