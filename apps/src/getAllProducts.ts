export function getAllProducts(req, res, SimulatedDay, products){    
    let flag = false;
    const tempPrds : typeof products [] = [];
  
    for (const currProd of products){
    if(currProd.simulatedDay < SimulatedDay){
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