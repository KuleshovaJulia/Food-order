const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


let emailLenghtChecker = (email) => {
	if (!email){
		return false;
	} else {
		if (email.length <5 || email.length >30) {
			return false;
		} else {
			return true;
		}
	}
};

let validEmailChecker = (email) => {
	if (!email) {
		return false;
	} else {
		const regExp =  new RegExp(/^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/);
		return regExp.test(email);
	}
};

const emailValidators = [{
	validator: emailLenghtChecker,
	message: 'E-mail должен содержать от 5 до 30 символов'
},
{
	validator: validEmailChecker,
	message: 'Не правильный E-mail'
}
];

let nameLengthChecker = (name) => {
	if (!name) {
		return false;
	} else {
		if (name.length <3 || name.length >15) {
			return false;
		} else {
			return true;
		}
	}
};

let validname = (name) =>{
	if (!name) {
		return false;
	} else {
		const regExp = new RegExp (/^[a-zа-яА-ЯA-Z]+$/);
		return regExp.test(name);
	}
};

const nameValidators = [{
validator: nameLengthChecker,
message: 'Имя должно содержать от 3 до 15 символов'
}, {
	validator: validname,
	message: 'Имя пользователя, не должно иметь никаких специальных символов или пробелов'

}
];


let surnameLengthChecker = (surname) => {
	if (!surname) {
		return false;
	} else {
		if (surname.length <2 || surname.length >20) {
			return false;
		} else {
			return true;
		}
	}
};

let validsurname = (surname) =>{
	if (!surname) {
		return false;
	} else {
		const regExp = new RegExp (/^[a-zA-Zа-яА-Я]+$/);
		return regExp.test(surname);
	}
};

const surnameValidators = [{
validator: surnameLengthChecker,
message: 'Фамилия должна содержать от 2 до 20 символов'
}, {
	validator: validname,
	message: 'Фамилия пользователя, не должна иметь никаких специальных символов или пробелов'

}
];

let numberLengthChecker = (number) => {
	if (!number) {
		return false;
	} else {
		if (number.length <14 || number.length >15) {
			return false;
		} else {
			return true;
		}
	}
};
                                 ///^\(0\d{2}\) \d{3}-\d{2}-\d{2}$/
let validnumber = (number) =>{
	if (!number) {
		return false;
	} else {
		const regExp = new RegExp (/^\(0\d{2}\) \d{3}-\d{2}-\d{2}$/);
		return regExp.test(number);
	}
};

const numberValidators = [{
validator: numberLengthChecker,
message: 'Номер должен содержать 14 символов'
}, {
	validator: validnumber,
	message: 'Формат: (0XX) XXX-XX-XX'

}
];

let passwordLengthChecker = (password) => {
	if (!password) {
		return false;
	} else {
		if (password.length <8 || password.length > 30) {
			return false;
		} else {
			return true;
		}
	}
};

let validpassword = (password) => {
	if (!password) {
		return false;
	} else {
		const regExp = new RegExp (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=(.*[a-zA-Z]){4}).{8,20}/);
		return regExp.test(password);
	}
};

const passwordValidators = [{
validator: passwordLengthChecker,
message: 'Пароль должен содержать от 8 до 35 символов'
}, {
	validator: validpassword,
	message: 'В пароле должны быть цифры, символы верхнего и нижнего регистра'

}
];


const userSchema = new Schema({
name: { type: String, required: true, lowercase: true, validate: nameValidators},
surname: { type: String, required: true, lowercase: true, validate: surnameValidators},
email: { type: String, required: true, unique:true, lowercase: true, validate: emailValidators},
number: { type: String, required: true, validate: numberValidators},
password: { type: String, required: true, validate: passwordValidators },
permission: {type: String, required: true, default: 'user' }
});


userSchema.pre('save', function(next) {
	if (!this.isModified('password'))
		return next();

	bcrypt.hash(this.password, null, null, (err, hash) => {
		if (err) return next (err);
		this.password = hash;
		next();
	});
});



userSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', userSchema);