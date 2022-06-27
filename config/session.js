const expressSession = require("express-session");
const mongoDbStore = require("connect-mongodb-session");

function createSessionStore() {
    let mongodbUrl = 'mongodb://127.0.0.1:27017';

    if (process.env.MONGODB_URL) {
        mongodbUrl = process.env.MONGODB_URL;
    }

    const MongoDBStore = mongoDbStore(expressSession);

    const store = new MongoDBStore({
        uri: mongodbUrl,
        databaseName: "online-shop",
        collection: "sessions"
    });

    return store;
}

function createSessionConfigFunction() {
    return {
        secret: "super-secret",
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 2 * 24 * 60 * 60 * 1000,
        }
    };
}

module.exports = createSessionConfigFunction;