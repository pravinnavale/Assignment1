import { User } from './modules/caseData';
import { Purchase } from './modules/caseData';
import { createUser } from './createUser';
import { getUser } from './getUser';
import { addDeposit } from './addDeposit';
import { handlePurchase } from './handlePurchase';
import { addProduct } from './addProduct';
import { getProductbyID } from './getProductByID';
import { getAllProducts } from './getAllProducts';

export const users : User[] = []; 
export const purchase : Purchase[] = [];


export function routes(app){

  //To get list of all users
  app.get('/accounts', (req, res) => {
    res.send(users);
  });
  
  //to get accountID related user
  app.get('/accounts/:accountId', getUser);
  
  //Create account
  app.post('/accounts', createUser);

  //Add Deposit in provided account
  app.post('/accounts/:accountId/deposits', addDeposit);
  
  //Get available purchases
  app.get('/purchases', (req, res) => {
    res.status(200).send(purchase);
  });
  
  //Handle purchase
  app.post('/accounts/:accountId/purchases', handlePurchase);

  //Add product
  app.post('/products', addProduct);
  
  //Get available products
  app.get('/products', getAllProducts);
  
  //Get product by ID
  app.post('/products/:productId', getProductbyID);
}