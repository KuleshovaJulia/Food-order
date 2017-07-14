const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database'); 

module.exports = (router) => {


	router.post('/register',(req, res) =>{

		if(!req.body.name) {
			res.json ({ success: false, message:  'Введите name'});
		} else{
			if (!req.body.surname) {
				res.json ({ success: false, message:  'Введите surname'});
			}
			else{
				if (!req.body.email) {
				res.json ({ success: false, message:  'Введите email'});
			}
			else{ 
				if (!req.body.number) {
				res.json ({ success: false, message:  'Введите number'});
			}
			else{
					if (!req.body.password) {
				res.json ({ success: false, message:  'Введите password'});
			}
					else{
						let user = new User({
					name: req.body.name.toLowerCase(),
					surname: req.body.surname.toLowerCase(),
					email: req.body.email.toLowerCase(),
					number: req.body.number,
					password: req.body.password

				});
					user.save((err) => {
					if (err) {
							if(err.code === 11000){
								res.json({ success: false, message: 'Пользователь с указанным адресом уже существует'
							});
							} else{
								if (err.errors) {
									if (err.errors.email) {
										res.json({ success: false, message: err.errors.email.message });
									}  else{
										if (err.errors.name) {
											res.json({ success: false, message: err.errors.name.message });
										} else {
											if (err.errors.surname) {
												res.json({ success: false, message: err.errors.surname.message });
											} else{
												if (err.errors.number) {
													res.json({ success: false, message: err.errors.number.message });
												} else{
													if (err.errors.password) {
													res.json({ success: false, message: err.errors.password.message });
													} else {
													  res.json({ success: false, message: err });
													}
												}
										  	}
										}
									}
								}else {
										res.json({ success: false, message: 'Ошибка: ', err });
									}
								}
						} else {
						res.json ({ success: true, message: 'Пользователь зарегистрирован'});
					}
				});
			   }
			}

			}

			}
		}
	});


 router.post('/login', (req, res) => {
 	if(!req.body.email){
 		res.json({ success: false, message: 'Пользователь с таким E-mail не зарегистрирован'});
 	}  else {
 		if (!req.body.password) {
 			res.json({ success: false, message: 'Не правильный пароль'});
 		} else {
 			User.findOne({ email: req.body.email.toLowerCase() }, (err, user) => {
 				if (err) {
 					res.json({ success:false, message: err});
 				} else {
 					if (!user) {
 						res.json({ success: false, message: 'Пользователь с таким E-mail не зарегистрирован'});
 					}  else{
 						const validpassword = user.comparePassword(req.body.password);
 						if (!validpassword) {
 							res.json({ success:false, message: 'Не правильный пароль'});
 						}  else {
 							const token = jwt.sign({ userId: user._id }, config.secret, {expiresIn: '24h' });
 							res.json({ success: true, message: 'Готово!', token: token, user: {name: user.name} });
 						}
 					}
 				}
 			});
 		}
 	}
});


  router.use((req, res, next) => {
  	const token = req.headers['authorization']; 
  	 if (!token) {
      res.json({ success: false, message: 'Что-то пошло не так)' }); 
    } else {
    	jwt.verify(token, config.secret, (err, decoded) => {
    	  if (err) {
          res.json({ success: false, message: 'Все ок: ' + err }); 
          } else {
          req.decoded = decoded; 
          next(); 
        }
    	});
    }
  });



 router.get('/profile', (req, res) => {
 	 User.findOne({ _id: req.decoded.userId }).select('name surname email number').exec((err, user) => {
 	 	if (err) {
          res.json({ success: false, message: err }); 
        } else {
        	if (!user) {
            res.json({ success: false, message: 'E-mail не найден' }); 
          } else {
            res.json({ success: true, user: user }); 
          }
        }
 	 });
 });

	return router;
}