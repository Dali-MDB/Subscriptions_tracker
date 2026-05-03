import cron from "node-cron";
import Subscription from "../models/subscriptions.model.js";

const clean_expired = async ()=>{
    cron.schedule("11 0 * * *",async ()=>{
        const to_expire = await Subscription.find({status:'active',renewaldate:{'$lte':Date.now()}}).updateMany({status:"expired"})
    })
}


export default clean_expired;