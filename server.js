var restify = require('restify');
var Pork = require('./pork');
var libxml = require('libxmljs');
var fs = require('fs');

var api = './api.xsd';
var xsd = libxml.parseXml(fs.readFileSync(api).toString());

var porks = {};

function sendPork(req, res, next){
	var hunger = new libxml.Document();
	var xml = hunger.node('hungerapi');

	if (req.params.hasOwnProperty('id')) {
		if (porks.hasOwnProperty(req.params.id)) {
			xml.addChild(porks[req.params.id].toXml().root());
		}
	} else {
		for (id in porks) {
			xml.addChild(porks[id].toXml().root());
		}
	}

	if (req.params.hasOwnProperty('id') && xml.childNodes.length == 0) {
		res.send(404);
	} else {
		res.writeHead(200, {'Content-Type': 'application/xml'});
		res.end(hunger.toString())
	}
}

function receivePork(req, res, next){
	var pork = new Pork();
	pork.fromXml(req.body.toString(), xsd);
	if (!porks.hasOwnProperty(pork.id)) {
		porks[pork.id] = pork;
		res.send(204);
	} else {
		res.send(209);
	}
}

function updatePork(req, res, next){
	if (porks.hasOwnProperty(req.params.id)) {
		var pork = new Pork();
		pork.fromXml(req.body.toString(), xsd);
		if (req.params.id == pork.id) {
			porks[pork.id] = pork;
			res.send(204);
		} else {
			res.send(400);
		}
	} else {
		res.send(404);
	}
}

function deletePork(req, res, next){
	if (porks.hasOwnProperty(req.params.id)) {
		delete porks[req.params.id];
		res.send(204);
	} else {
		res.send(404);
	}
}

var server = restify.createServer();

server.use(restify.bodyParser());

server.get('/porks', sendPork);
server.get('/pork/:id', sendPork);
server.post('/porks', receivePork);
server.put('/pork/:id', updatePork);
server.del('/pork/:id', deletePork);

server.listen(8080);
