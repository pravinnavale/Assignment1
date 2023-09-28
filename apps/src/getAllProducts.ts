import { product } from './modules/caseData';
import { products } from './modules/products';
import { simulatedDay } from './main';

export function getAllProducts(req, res){    
    let flag = false;
    const tempPrds : product []= [];
  
    for (const currProd of products){
      if(currProd.simulatedDay < simulatedDay){
        flag = true;  
        tempPrds.push(currProd);      
      }
    }

  if(!flag){
    res.status(400).send('No Product found..');
  }else{    
    res.status(200).json(tempPrds);
  }
}