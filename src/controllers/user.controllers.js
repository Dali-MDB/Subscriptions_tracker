import User from "../models/user.model.js";
import mongoose from "mongoose";

export async function getAllUsers(req,res){
    try{
    const users = await User.find();
    return res.status(200).send(users)
    }catch(error){
        console.log(`an error occured when fetching the users ${error.message}`)
        throw new HttpError(500, "An error occurred while fetching the users");
    }
}

export async function getUser(req,res){
    try{
    const  id  = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user id" });
    }
    const user = await User.findById(id)
    if(!user){
        res.status(404).json({'message':'the user that you are looking for does not exist'})
    }
    return res.status(200).json({'data':user})
    }catch(error){
        console.log(`an error occured when fetching the user ${error.message}`)
        throw new HttpError(500, "An error occurred while fetching the user");
    }
}


export async function editUser(req,res){
    try{
    const  id  = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user id" });
    }
    const user = await User.findById(id)
    if(!user){
        res.status(404).json({'message':'the user that you are looking for does not exist'})
    }
    //we get the current user
    let cur_user = req.user
    if(String(cur_user._id) != String(user._id)){
        return res.status(401).json({'message':'you are not allowed to modify the data of other users'})
    }

    //we update the data
    let updates = {...req.body}
    
    for(const key in updates){
        if(key!='password' && key!='_id')
            user[key] = updates[key]
    }
    user.save()
    return res.status(200).json({
        'success':true,
        'message': 'the user has been updated successfully',
        'data': user
    })
    }catch(error){
        console.log(`an error occured when editing the user ${error.message}`)
        throw new HttpError(500, "An error occurred while editing the user");
    }
}

export async function deleteUser(req,res){
    try{
    const  id  = req.params.id;
    //we get the current user
    let cur_user = req.user
    if(String(cur_user._id) != String(id)){
        return res.status(401).json({'message':'you are not allowed to delete this account'})
    }

    await User.deleteOne({'_id':id})
    return res.status(204).json({'message':'the user has been deleted successfully'})
    }catch(error){
        console.log(`an error occured when deleting the user ${error.message}`)
        throw new HttpError(500, "An error occurred while deleting the user");
    }
};
