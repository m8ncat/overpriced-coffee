import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

const coffee = [{
  name: "Americano",
  image: "/static/img/americano.jpg",
  price: 999,
},
{
  name: "Cappuccino",
  image: "/static/img/cappuccino.jpg",
  price: 999
},
{
  name: "Latte",
  image: "/static/img/latte.jpg",
  price: 999
}];

app.use(cookieParser());
app.use('/static', express.static('static'));
// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
// Настраиваем пути и дефолтный view
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultView: "default",
    layoutsDir: path.join(rootDir, "/views/layouts/"),
    partialsDir: path.join(rootDir, "/views/partials/"),
  })
);

app.get("/", (_, res) => {
  res.redirect("/menu")
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: coffee
  });
});

app.get("/buy/:name", (req, res) => {
    let cart;
    if(req.cookies.cart) 
      cart = req.cookies.cart;
    else 
      cart = [];
    cart.push(req.params.name);
    res.cookie('cart', cart);
    res.redirect("/menu");
});

app.get("/cart", (req, res) => {
    let _cart;
    if(req.cookies.cart)
      _cart = req.cookies.cart;
    else 
      _cart = [];
    const cart = _cart.map(element => coffee.find(coffee => coffee.name === element));
    res.render('cart', {
        layout: 'default',
        fullPrice: cart.reduce((summ, curVal) => curVal.price + summ, 0),
        items: cart
    });
});

app.post("/cart", (req, res) => {
  res.cookie('cart', []);
  res.redirect('/menu');
});

app.get("/login", (req, res) => {
  let username;
  
  if (req.query.username) 
    username = req.query.username;
  else if (req.cookies.username) 
    username = req.cookies.username;
  else 
    username = "Аноним"

    res.cookie("username", username);
    res.render('login', {
        layout: 'default',
        username: username 
    });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
