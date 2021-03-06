const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

let port = 3000;

if (process.env.PORT) {
    port = process.env.PORT;
}

const db = require("./data/database");
const baseRoutes = require("./routes/base.routes");
const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const ordersRoutes = require("./routes/orders.routes");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const csrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");
const updateCartPricesMiddleware = require("./middlewares/update-cart-prices");
const notFoundHandlerMiddleware = require("./middlewares/not-found");
const createSessionConfig = require("./config/session");
const createCloudinaryConfig = require("./config/cloudinary.config");


const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(csrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

createCloudinaryConfig();

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", protectRoutesMiddleware, ordersRoutes);
app.use("/admin", protectRoutesMiddleware, adminRoutes);

app.use(notFoundHandlerMiddleware);

app.use(errorHandlerMiddleware);

db.connectToDatabase().then(function () {
    app.listen(port);
}).catch(function (error) {
    console.log("Failed to connect to database!");
    console.log(error)
});