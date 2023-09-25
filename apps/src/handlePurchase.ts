import { User } from './caseData';
import { Purchase } from './caseData';
import { products } from './products';

export function handlePurchase(req, res, user : User [], purchase, products, SimulatedDay) : string {
  console.log('Purchase request received..');
  const { productId } = req.body;
  const accID = req.params['accountId'];
  let resp: string;
  let flag = true;

  if(purchase !== undefined && purchase.length > 0){
    console.log('Checking existing Purchases..');
    for(let i = purchase.length; i > 0; i--){
      const currPurch = purchase[i-1];
      console.log('Existing Purchase found ..');
      if(currPurch.accountId == accID){  // check if new purchase simulated date is greater than last purchase      
        console.log('Existing Purchase match with user..');
        if(currPurch.simulatedDay > SimulatedDay){
          flag = false;
          res.statusCode = 400;
          resp = 'Purchase not allowed before existing request..';
          break;
        }
      } 
    }    
  }
  
  if(flag && user !== undefined && user.length > 0){
    console.log('User exists..');
    for (const usr of user){
        if(usr.uuid == accID){
            console.log('User match exists..');
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
    }else{
        res.statusCode = 409;
        resp = 'User doesnt exists..';
    }

    return resp;
}