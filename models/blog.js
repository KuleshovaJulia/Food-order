const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise; 
const Schema = mongoose.Schema; 

let titleLengthChecker = (title) => {
  if (!title) {
    return false; 
  } else {
    if (title.length < 5 || title.length > 50) {
      return false; 
    } else {
      return true; 
    }
  }
};

let priceLengthChecker = (price) => {
  if (!price) {
    return false; 
  } else {
    if (price.length < 1 || price.length > 5) {
      return false; 
    } else {
      return true; 
    }
  }
};


let alphaNumericTitleChecker = (title) => {
  if (!title) {
    return false; 
  } else {

    const regExp = new RegExp(/^[а-яА-Яa-zA-Z0-9 ]+$/);
    return regExp.test(title); 
  }
};

let NumericPriceChecker = (price) => {
  if (!price) {
    return false; 
  } else {

    const regExp = new RegExp(/^[0-9 ]+$/);
    return regExp.test(price); 
  }
};



const titleValidators = [
  {
    validator: titleLengthChecker,
    message: 'Заголовок может содержать от 5 до 50 символов'
  },
  {
    validator: alphaNumericTitleChecker,
    message: 'Заголовок содержит только символы и цифры'
  }
];

const priceValidators = [
  {
    validator: priceLengthChecker,
    message: 'Цена может содержать от 1 до 5 символов'
  },
  {
    validator: NumericPriceChecker,
    message: 'Цена содержит только цифры'
  }
];


let bodyLengthChecker = (body) => {
  if (!body) {
    return false; 
  } else {
    if (body.length < 5 || body.length > 500) {
      return false; 
    } else {
      return true; 
    }
  }
};


const bodyValidators = [
  {
    validator: bodyLengthChecker,
    message: 'Может содержать от 5 до 500 символов'
  }
];




const blogSchema = new Schema({
  title: { type: String, required: true, validate: titleValidators },
  body: { type: String, required: true, validate: bodyValidators },
  price: { type: String, required: true, validate: priceValidators },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Blog', blogSchema);