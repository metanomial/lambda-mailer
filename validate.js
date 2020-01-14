/**
	Validate Lambda event as an SES inbound email event
	@param {object} event - Lambda event
	@throw {Error} - if the Lambda event is not an SES inbound email event
**/
exports.validate = event => {
	switch(true) {
		case event == null:
		case event.Records == null:
		case !Array.isArray(event.Records):
		case event.Records.length !== 1:
		case event.Records[0].eventSource !== 'aws:ses':
		case event.Records[0].eventVersion !== '1.0':
			throw new Error('Event is not an SES inbound email event');
	}
};
