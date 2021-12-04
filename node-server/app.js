const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const session = require('express-session')
const connectMongo = require('connect-mongo')(session);

const home = require('./routers/home')
const middleware = require('./middleware/middleware')
const video = require('./routers/video')
const login = require('./routers/login')
const upload = require('./routers/upload')
const create = require('./routers/create')
const logout = require('./routers/logout')
const account = require('./routers/account')
const deletion = require('./routers/delete')

mongoose.connect('mongodb://127.0.0.1:27017/voox', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sessName = 'fun'

mongoose.connection
  .once("open", () => {
    console.log("Connected to DB");
  })
  .on("error", (err) => {
    console.log(err);
  });
 
app.set("view engine", "ejs");
app.use(session({
  name : sessName,
  resave : true,
  saveUninitialized : false,
  secret : 'frignfz,jdbdfg',
  store : new connectMongo({mongooseConnection : mongoose.connection}),
  cookie : {
    maxAge : 1000 * 60 * 60 * 8,
    sameSite : true,
    }
}
))
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/public", express.static("./public"))
app.use("/videos", express.static("./videos"))
app.use("/images", express.static("./images"))
app.use(middleware)
app.use(home)
app.use(login)
app.use(create)
app.use(account)
app.use(upload)
app.use(logout)
app.use(video)
app.use(deletion)

app.listen(3030, () => {
  console.log("App running in port 3000");
});
