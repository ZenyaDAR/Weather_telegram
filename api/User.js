import mongoose from "mongoose";

const User = new mongoose.Schema({
    user_id:{type: String,require: true},
    user_name:{type: String,require: true},
    first_name:{type: String,require: true},
    user_city:{type: String,require: true}
})

export default mongoose.model('User', User)