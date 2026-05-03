import cron from "node-cron";
import clean_expired from "./expired.jobs.js";

const Tasks = async ()=>{
    clean_expired()
   // cron.schedule("*/1 * * * *",()=>console.log("9ooooowowoowowowow"))
}



export default Tasks;