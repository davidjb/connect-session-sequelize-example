const express = require("express");
const Sequelize = require("sequelize");
const session = require("express-session");

const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = new Sequelize("sqlite::memory");

const app = express();

const store = new SequelizeStore({ db: sequelize });
app.use(
  session({
    secret: "guinea pig",
    store,
    resave: false,
    proxy: true,
  })
);

store.sync();

app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.setHeader("Content-Type", "text/html");
    res.write("<p>views: " + req.session.views + "</p>");
    res.write("<p>expires in: " + req.session.cookie.maxAge / 1000 + "s</p>");

    res.write("<h1>Tables</h1>");
    res.write("<p>By default, the table name should be <a href=\"https://github.com/mweibel/connect-session-sequelize/blob/394645289e17c2e962fe6650729b3f0e691a3134/lib/connect-session-sequelize.js#L16\"><code>tableName: 'Sessions'</code></a>");
    sequelize.query("SELECT name FROM sqlite_master WHERE type='table';").then(rows => {
      res.write(`<div><code>${JSON.stringify(rows)}</code></div>`);
      res.end();
    });
  } else {
    req.session.views = 1;
    res.end("welcome to the session demo. refresh!");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
