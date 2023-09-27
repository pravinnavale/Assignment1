import express from 'express';
import bodyParser from "body-parser";
import { User } from './caseData';
import { Purchase } from './caseData';
import { products } from './products';
import { createUser } from './createUser';
import { getUser } from './getUser';
import { addDeposit } from './addDeposit';
import { handlePurchase } from './handlePurchase';
import { addProduct } from './addProduct';
import { getSimulatedDay } from './getSimulatedDay';
import { getProductbyID } from './getProductByID';
import { getAllProducts } from './getAllProducts';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

let user : User[] = []; 
const purchase : Purchase[] = [];

let SimulatedDay = 0;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.status(503).setTimeout(3000);
  SimulatedDay = getSimulatedDay(req);  
  next();
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

//To get list of all users
app.get('/accounts', (req, res) => {
  res.send(user);
});

//to get accountID related user
app.get('/accounts/:accountId', (req, res) => {
  getUser(req, res, user, SimulatedDay);
});

//Create account
app.post('/accounts', (req, res) => {
  user[user.length]=(createUser(req, res, SimulatedDay));
  res.status(200).send(user);
});

//Add Deposit in provided account
app.post('/accounts/:accountId/deposits', (req, res) => {
  user = addDeposit(req, user, SimulatedDay);
  res.status(200).send(user);
});

//Get available purchases
app.get('/purchases', (req, res) => {
  res.status(200).send(purchase);
});

//Handle purchase
app.post('/accounts/:accountId/purchases', (req, res) => {
  const resp : string = handlePurchase(req, res, user, purchase, products, SimulatedDay)   ;
  res.send(resp) ;
});

//Add product
app.post('/products', (req, res) => {  
  const tempProd : typeof products[0] = addProduct(req, SimulatedDay);  
  products[products.length] = tempProd;
  res.send(tempProd);
});

//Get available products
app.get('/products', (req, res) => {
  getAllProducts(req, res, SimulatedDay, products);
});

//Get product by ID
app.post('/products/:productId', (req, res) => {
  getProductbyID(req, res, SimulatedDay, products);
});