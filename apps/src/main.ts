import { randomUUID } from 'crypto';
import express from 'express';
import bodyParser from "body-parser";
import { User } from './caseData';
import { Purchase } from './caseData';
import { products } from './products';
import { Console } from 'console';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

const user : User[] = []; 
const purchase : Purchase[] = [];

let SimulatedDay = 0;

app.use(bodyParser.json());

app.use((req, res, next) => {
  const val = req.rawHeaders; // Reading headers from rawHeader because added values are not available in req.headers
  for (let i=0; i < val.length; i++){
    if(val[i] == 'Simulated-Day'){
      SimulatedDay = parseInt(val[++i]);
      console.log(SimulatedDay);
      break;
    }
  }  
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
    //const accID = req.query.accountId; //Use to read query parameters
  const accID = req.params['accountId']; // Use to read path parameters
  console.log(accID);

  let resp : User;
  
  for (const usr of user){
    if(usr.uuid == accID){
      if(usr.simulatedDay === SimulatedDay){
        const tmpUsr = {...usr};
        tmpUsr.balance = tmpUsr.balance - tmpUsr.underProcessBal;
        resp = tmpUsr;
      }else{
        usr.underProcessBal = 0; // Assuming request will never be backdated..
        resp = usr;
      }
      break;      
    }
  }
  
  if(resp !== undefined){
    res.send(resp);
  }else{
    res.send('No user found with given account ID: ' + accID);
  }  
});

//Create account
app.post('/accounts', (req, res) => {    
  const { name } =  req.body; 

  const temp : User = {
    name: name, 
    balance : 0, 
    uuid : randomUUID(), 
    createdOn : new Date(), 
    lastUpdated : new Date(), 
    simulatedDay : SimulatedDay,
    underProcessBal : 0
  };
  
  user[user.length] = temp;
   
  res.send(user);
});

//Add Deposit in provided account
app.post('/accounts/:accountId/deposits', (req, res) => {
  const accID = req.params['accountId']; // Use to read path parameters
  const { amount } =  req.body; 

  for (const usr of user){
    if(usr.uuid == accID){
      usr.simulatedDay = SimulatedDay;
      usr.balance = usr.balance + amount;
      if(usr.simulatedDay == SimulatedDay){
        usr.underProcessBal = amount;      
      }
      usr.lastUpdated = new Date();
      break;
    }
  }

  res.send(user);
});

//Get available products
app.get('/products', (req, res) => {
  res.send(products);
});

//Handle purchase
app.post('/accounts/:accountId/purchases', (req, res) => {
  const { productId } = req.body;
  const accID = req.params['accountId'];
  let resp: string;
  let flag = true;

  if(purchase.length > 0){
    for(let i = purchase.length; i > 0; i--){
      const currPurch = purchase[i-1];
      if(currPurch.accountId == accID){  // check if new purchase simulated date is greater than last purchase      
        if(currPurch.simulatedDay > SimulatedDay){
          flag = false;
          res.statusCode = 400;
          resp = 'Purchase not allowed before existing request..';
          break;
        }
      } 
    }    
  }
  
  if(flag){
    for (const usr of user){
        if(usr.uuid == accID){
          for(const currProd of products){
            if(currProd.id == productId && currProd.stock > 0 && currProd.price <= usr.balance){  //Check if prod in stock and user has sufficient balance
              console.log('Processing Purchase..');
              const tempPurch : Purchase = {
                accountId : accID,
                simulatedDay : SimulatedDay,
                productId : productId
              }
              purchase[purchase.length] = tempPurch;

              --currProd.stock;
              usr.balance = usr.balance-currProd.price;

              resp = 'Purchase of ' + productId + ' is succesfull..';
            }else{
              res.statusCode = 409;
              resp = 'You are not allowed to purchase..';
            }
          }
        }
      }    
    }  
  res.send(resp);
});

//Add product
app.post('/products', (req, res) => {
  const { title } = req.body;
  const { description } = req.body;
  const { price } = req.body;
  const { stock } = req.body;

  const tempProd : typeof products[0] = {
    id : randomUUID(),
    title : title,
    description : description,
    price : price,
    stock : stock,
    simulatedDay : SimulatedDay
  };

  products[products.length] = tempProd;

  res.send(tempProd);
});

//Add product
app.post('/products/:productId', (req, res) => {
  const productId  = req.params['productId'];
  let flag = false;
  
  for (const currProd of products){
    if(currProd.id === productId && currProd.simulatedDay < SimulatedDay){
      flag = true;  
      const {simulatedDay, ...details}= currProd;
      res.status(200).json({ ...details });
      break;  
    }
  }
  if(!flag){
    res.status(400).send('Product not found..');
  }
});