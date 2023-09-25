import { User } from './caseData';

export function addDeposit(req, user : User[], SimulatedDay) : User[] {
    const accID = req.params['accountId']; // Use to read path parameters
    const { amount } =  req.body; 

    for (const usr of user){
        if(usr.uuid == accID){
            usr.simulatedDay = SimulatedDay;
            usr.balance = usr.balance + amount;
            if(usr.simulatedDay == SimulatedDay){
                usr.underProcessBal = amount;      
            }
            usr.lastUpdated = new Date();
            break;
        }
    }

    return user;
}