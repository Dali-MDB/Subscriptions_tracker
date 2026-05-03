import { Router } from "express";
import { getAllSubscriptions,getSubscription,getUserSubscription,getUpcomingRenewals,editSubscription,deleteSubscription,addSubscription, cancelSubscription} from "../controllers/subscriptions.controllers.js";


const subs_router = Router();

subs_router.get('/', getAllSubscriptions)

subs_router.get('/user', getAllSubscriptions);

subs_router.get('/upcomin-renewals', getUpcomingRenewals);

subs_router.get('/:id', getSubscription)

subs_router.post('/', addSubscription);

subs_router.put('/:id', editSubscription);

subs_router.delete('/:id', deleteSubscription);

subs_router.put('/:id/cancel', cancelSubscription);




export default subs_router;