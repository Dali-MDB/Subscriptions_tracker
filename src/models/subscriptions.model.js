import mongoose from "mongoose";


const SubscriptionSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
            minLength:2,
            maxLength:100,
        },
        price: {
            type: Number,
            required:[true,'the price is required'],
            min: 0,
        },
        currency: {
            type: String,
            enum: ['USD','EURO'],
            default: 'EURO',
        },
        frequency: {
            type: String,
            enum: ['daily','weekly','monthly','yearly'],
            required: [true,"you need to specify a frequency ['daily','weekly','monthly','yearly']"]
        },
        payment_method: {
            type: String,
            trim: true,
            required: true,
        },
        status: {
            type: String,
            enum : ['active','cancelled','expired'],
            default: 'active',
        },
        startdate: {
            type: Date,
            required: true,
            validate: {
                validator: (value) => value <= new Date(),
                message: "the startdate must be in the past"
            }
        },
        renewaldate: {
            type: Date,
            validate: {
                validator: function(value){
                    return value > this.startdate
                },
                message: "the renewaldate must be after the start date"
            }
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },{timestamps:true}
)


//add auto renewal date
SubscriptionSchema.pre('save',function(next){
    if(!this.renewaldate){
        let renewal = new Date(this.startdate);

        switch (this.frequency) {
            case "daily":
            renewal.setDate(renewal.getDate() + 1);
            break;
            case "weekly":
            renewal.setDate(renewal.getDate() + 7);
            break;
            case "monthly":
            renewal.setMonth(renewal.getMonth() + 1);
            break;
            case "yearly":
            renewal.setFullYear(renewal.getFullYear() + 1);
            break;
        }

        this.renewaldate = renewal;
        // Auto-update the status if renewal date has passed
        if (this.renewaldate < new Date()) {
            this.status = 'expired';
        }
        next();
    }
})

const Subscription  = mongoose.model("Subscription",SubscriptionSchema)

export default Subscription