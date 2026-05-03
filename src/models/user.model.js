import mongoose from "mongoose";
import Subscription from "./subscriptions.model.js";

const UserSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: [true,"the username is reqired"],
            trim: true,
        },
        email: {
            type: String,
            required: [true,"the email is reqired"],
            trim:true,
            unique: true,
            lowecase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
            index: true
        },
        password: {
            type:String,
            required: [true,"the password is required"],
            minLength: 8,
            select: false,   //hide in display (write only)
        }
    },{ timestamps: true },
)



//a middleware for cascade delete
UserSchema.pre("remove",async (next)=>{
   try {
    await Subscription.deleteMany({ author: this._id });
    next();
  } catch (err) {
    next(err);
  }
})

const User = mongoose.model("User",UserSchema)

export default User;