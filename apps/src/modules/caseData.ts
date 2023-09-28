
export class User {
  name : string;
  uuid : string;
  balance : number;
  createdOn: Date;
  lastUpdated : Date;
  simulatedDay : number;
  underProcessBal : number;
}

export interface Purchase {
  accountId : string;
  productId : string;
  simulatedDay : number;
}

export class product {
    id: string;
    title: string;
    description: string;
    stock: number;
    price: number;
    simulatedDay : number;
  }