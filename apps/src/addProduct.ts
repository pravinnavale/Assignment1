import { products } from "./products";
import { randomUUID } from "crypto";

export function addProduct(req, SimulatedDay){
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

  return tempProd;
}