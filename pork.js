var libxml = require('libxmljs');

function Pork(){
	this.id = '';
	this.type = '';
	this.deliciousness = '';
}

Pork.prototype.toXml = function(){
	var xml = new libxml.Document();
	xml.node('pork')
		.node('id', this.id).parent()
		.node('type', this.type).parent()
		.node('deliciousness', this.deliciousness);
	return xml;
};

exports = module.exports = Pork;
