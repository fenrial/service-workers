var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});

const webPush = require('web-push');
const { publicKey, privateKey } = webPush.generateVAPIDKeys();
process.env.VAPID_PUBLIC_KEY = publicKey;
process.env.VAPID_PRIVATE_KEY = privateKey;

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
	console.log(
		'You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY ' +
			'environment variables. You can use the following ones:',
	);
	console.log(webPush.generateVAPIDKeys());
	return;
}

webPush.setVapidDetails(
	'http://localhost:1234',
	process.env.VAPID_PUBLIC_KEY,
	process.env.VAPID_PRIVATE_KEY,
);

app.get('/vapidPublicKey', function(req, res) {
	res.send(process.env.VAPID_PUBLIC_KEY);
});

app.post('/register', function(req, res) {
	res.sendStatus(201);
});

app.post('/sendNotification', function(req, res) {
	const subscription = req.body.subscription;
	const payload = null;
	const options = {
		TTL: req.body.ttl,
	};

	setTimeout(function() {
		webPush
			.sendNotification(subscription, payload, options)
			.then(function() {
				res.sendStatus(201);
			})
			.catch(function(error) {
				res.sendStatus(500);
				console.log(error);
			});
	}, req.body.delay * 1000);
});
