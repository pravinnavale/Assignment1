import { products } from "./modules/products";
import { randomUUID } from "crypto";
import { simulatedDay } from './main';

export function addProduct(req, res){
  const { title, description, price, stock } = req.body;

  const tempProd : typeof products[0] = {
    id : randomUUID(),
    title : title,
    description : description,
    price : price,
    stock : stock,
    simulatedDay : simulatedDay
  };
  products[products.length] = tempProd;
  res.status(200).send(products);
}