import { User } from './modules/caseData';
import { users } from './router';
import { simulatedDay } from './main';

export function getUser(req, res) {
  //const accID = req.query.accountId; //Use to read query parameters
  const accID = req.params['accountId']; // Use to read path parameters
  console.log(accID);
  
  let resp : User;
   const tempUser = users.find(resp => resp.uuid === accID)
   console.log("user found: "+ tempUser);

  // for (const usr of users){
  //   if(usr.uuid === accID){
  //     if(usr.simulatedDay === simulatedDay){
  //       const tmpUsr = {...usr};
  //       tmpUsr.balance = tmpUsr.balance - tmpUsr.underProcessBal;
  //       resp = tmpUsr;
  //     }else{
  //       usr.underProcessBal = 0; // Assuming request will never be backdated..
  //       resp = usr;
  //     }
  //     break;      
  //   }
  // } 
  
  if(tempUser !== undefined){
    res.status(200).json(tempUser);
  }else{
    res.status(400).send('No user found with given account ID: ' + accID);
  }

}