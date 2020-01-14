const AWS = require('aws-sdk');
const Email = require('./Email');
const { validate } = require('./validate');
const { forward } = require('./forward');
const { deduplicate } = require('./deduplicate');

/**
	S3 service interface
	@type {AWS.S3}
	@see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
**/
const s3 = new AWS.S3({ signatureVersion: 'v4' });

/**
	SES service interface
	@type {AWS.SES}
	@see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html
**/
const ses = new AWS.SES;

/**
	Lambda event handler
	@param {object} event - Lambda event
**/
exports.handler = async event => {

	// Validate SES inbound mail event
	validate(event);

	// Map recipients to forwarding addresses and deduplicate
	const recipients = event.Records[0].ses.receipt.recipients
		.map(forward)
		.filter(deduplicate);

	// Fetch email contents
	const object = await s3.getObject({
		Bucket: '<bucket name>',
		Key: '<prefix>' + event.Records[0].ses.mail.messageId
	}).promise();

	// Create an email interface from text contents
	const email = new Email(object.Body.toString());

	// Add Reply-To header if missing
	if(!email.headers.has('reply-to')) email.headers.add('reply-to', email.headers.get('from').value);

	// Replace From header with source address
	const displayName = email.headers.get('from').fromDisplay || '';
	email.headers
		.remove('from')
		.add('from', displayName.trim() + ' <no-reply@your-domain.com>');

	// Remove old headers for SES to regenerate
	email.headers
		.remove('return-path')
		.remove('sender')
		.remove('message-id')
		.remove('dkim-signature');

	// Send email through SES
	await ses.sendRawEmail({
		Destinations: recipients,
		Source: 'no-reply@your-domain.com',
		RawMessage: {
			Data: email.toString()
		}
	}).promise();
};
