import { randomUUID } from 'crypto';
import { User } from './caseData';

export function createUser(req, res, SimulatedDay): User {
    const { name } =  req.body; 

    const temp : User = {
      name: name, 
      balance : 0, 
      uuid : randomUUID(), 
      createdOn : new Date(), 
      lastUpdated : new Date(), 
      simulatedDay : SimulatedDay,
      underProcessBal : 0
    };  
    
    return (temp);
}