import { products } from './modules/products';
import { simulatedDay } from './main';

export function getProductbyID(req, res){
    const productId  = req.params['productId'];
    let flag = false;
  
    for (const currProd of products){
    if(currProd.id === productId && currProd.simulatedDay < simulatedDay){
      flag = true;  
      const {simulatedDay, ...details}= currProd;
      res.status(200).json({ ...details });
      break;  
    }
  }
  if(!flag){
    res.status(400).send('Product not found..');
  }
}