const express = require("express");
const { engine } = require("express-handlebars");
const Handlebars = require("handlebars");
const path = require("path");
const env = require("dotenv").config();
const socket = require("socket.io");
const cors = require("cors");
const methodOverride = require("method-override");
const databaseService = require("./services/database.service");
const helpers = require("./helpers/viewEngine");
const mongoose = require("mongoose");
const express_handlebars_sections = require("express-handlebars-sections");
// mongoose.connect(process.env.da)

const logger = require("morgan");

const routes = require("./routes/index");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

databaseService.connectDatabase();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// use logger and use read json , static file
// app.use(logger("dev"));

require("./middlewares/session")(app);
require("./middlewares/passport")(app);
app.use(require("./middlewares/locals"));

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: helpers,
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, "/public")));

routes(app);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT || 3000}`);
});
