const express = require('express')
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser');
const cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
	if (err)
		{console.log ('could not connect to db: ', err);
	}
	else {
		console.log(config.secret);
		console.log('connected to db: ' + config.db);
	}
});


app.use(cors({ 
	origin: 'http://localhost:4200' 
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json())
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);

// respond with "hello world" when a GET request is made to the homepage
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname +'/client/dist/index.html'));
});

app.listen(8080, () =>{
	console.log('Listening on port 8080');
});