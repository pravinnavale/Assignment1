import { User } from './modules/caseData';
import { users } from './router';
import { simulatedDay } from './main';

export function addDeposit(req, res) {
    const accID = req.params['accountId']; // Use to read path parameters
    const { amount } =  req.body; 

    for (const usr of users){
        if(usr.uuid === accID){
            usr.simulatedDay = simulatedDay;
            usr.balance = usr.balance + amount;
            if(usr.simulatedDay == simulatedDay){
                usr.underProcessBal = amount;      
            }
            usr.lastUpdated = new Date();
            break;
        }
    }

    res.status(200).send(users);
}