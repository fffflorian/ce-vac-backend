const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();

const path = require('path');
const PORT = process.env.PORT || 5000;

//app.options("*", cors());

// Express Middleware to Enable CORS
app.use(cors({
	credentials: true,
	//origin: true
	origin: "https://ce-vacation.web.app"
	//origin: "http://localhost:4200"
}));
// Parse Request of Content-Type — application/json
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// Parse Request of Content-Type — application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
	name: "ce-on-vacation",
	secret: "COOKIE_SECRET",
	httpOnly: true
}))

const db = require("./app/models");
db.sequelize.sync()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
	res.json({
		message: "Welcome to this application"
	});
});

require("./app/routes/auth.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/team.routes.js")(app);
require("./app/routes/tournament.routes.js")(app);

app.listen(PORT, () => console.log('Server is currently running on port ${PORT}'));