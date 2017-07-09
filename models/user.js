var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
Name: { type: String, required: true},
Surname: { type: String, required: true},
Email: { type: String, required: true, unique:true, lowercase: true},
Number: { type: String, required: true, unique:true, lowercase: true}
});
module.exports = mongoose.model('User', userSchema);