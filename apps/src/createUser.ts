import { randomUUID } from 'crypto';
import { User } from './modules/caseData';
import { users } from './router';
import { simulatedDay } from './main';

export function createUser(req, res) {
  const { name } =  req.body; 
  if(name != undefined){
    const temp : User = {
      name: name, 
      balance : 0, 
      uuid : randomUUID(), 
      createdOn : new Date(), 
      lastUpdated : new Date(), 
      simulatedDay : simulatedDay,
      underProcessBal : 0
    }; 
    users.push(temp);
    res.status(200).send(users);
  }else{
    res.status(400).send("Invalid input...");
  }
    
}