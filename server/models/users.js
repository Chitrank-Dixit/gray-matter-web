import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: 'String', required: true },
    password: { type: 'String', required: true },
    username: { type: 'String', required: true },
    age: {type: 'Number', required: true},
    // add interests
    // add badgets
    // add levels
    // add related tournaments
    // add aspirations and career path (what does user want to become)
}, {timestamps: true});

export default mongoose.model('User', userSchema);