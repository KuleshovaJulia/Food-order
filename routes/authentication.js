const User = require('../models/user');

module.exports = (router) => {


	router.post('register',(req, res) =>{
		res.send('hello world');
	});

	return router;
}