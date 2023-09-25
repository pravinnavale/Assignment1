
export function getSimulatedDay(req){
    let SimulatedDay = 0;
    const val = req.rawHeaders; // Reading headers from rawHeader because added values are not available in req.headers
    for (let i=0; i < val.length; i++){
    if(val[i] == 'Simulated-Day'){
      SimulatedDay = parseInt(val[++i]);
      console.log('Simulated Day: '+ SimulatedDay);
      break;
    }    
  }
  return SimulatedDay;
} 