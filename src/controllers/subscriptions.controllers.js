import Subscription from "../models/subscriptions.model.js";
import mongoose from "mongoose";


async function fetchSubscription(sub_id, user_id) {
    if (!mongoose.Types.ObjectId.isValid(sub_id)) {
        throw new HttpError(400, "Invalid subscription id");
    }

    const subscription = await Subscription.findById(sub_id);
    if (!subscription) {
        throw new HttpError(404, "Subscription not found");
    }

    // Verify ownership
    if (String(subscription.author) !== String(user_id)) {
        throw new HttpError(401, "You are not the owner of this subscription");
    }

    return subscription;
}


export async function getAllSubscriptions(req,res){
    const subscriptions = await Subscription.find()
    res.status(200).json({ success: true, data: subscriptions });
}

export async function getSubscription(req, res){
    try {
        const subscription = await fetchSubscription(req.params.id, req.user._id);
        res.status(200).json({ success: true, data: subscription });
    }catch(err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}

export async function addSubscription(req, res){
    let data = {...req.body}
    data['author'] = req.user._id;    //add the user
    const subscription = await Subscription(data);
    await subscription.save()
    return res.status(200).json({'success':true,'message':'the subscription has been registered successfully','data':subscription});
};


export async function editSubscription(req, res){
    try {
        const subscription = await fetchSubscription(req.params.id, req.user._id);
        //extract info
        const updates = req.body;
        for(let key in updates){
            if(key!='_id')
                subscription[key] = updates[key]
        }
        subscription.save()
        res.status(200).json({
            'success':true,
            'message': 'the subscription details have been updated successfully',
            'data':subscription,
        })
    }catch(err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};



export async function deleteSubscription(req, res){
    try {
        const subscription = await fetchSubscription(req.params.id, req.user._id);
        await Subscription.deleteOne({ _id: subscription._id });
        res.status(204).json({ message: "The subscription has been deleted successfully" });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};


export async function getUserSubscription(req, res){
    const subscriptions = await Subscription.find({'author':req.user._id})
    return res.status(200).json({'data':subscriptions})
};

export async function cancelSubscription(req, res){
    try {
        const subscription = await fetchSubscription(req.params.id, req.user._id);
        //change status
        subscription.status = 'cancelled'
        subscription.save()
        res.status(200).json({
            'success':true,
            'message': 'the subscription has been cancelled successfully',
            'data':subscription,
        })
    }catch(err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}


export async function getUpcomingRenewals(req, res){
    const subscriptions = await Subscription.find({
        author:req.user._id,
        status:'active',
        renewaldate: { $lt: new Date(), $gt: new Date(Date.now() - 7*24*60*60*1000) }
    })
    return res.status(200).json({'data':subscriptions})
};

