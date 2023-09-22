
export interface User {
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