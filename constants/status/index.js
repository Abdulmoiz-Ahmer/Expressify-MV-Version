//  Status codes/ Response codes

export const status = {
	//  The request has succeeded. The meaning of the success depends on the HTTP method:
	//  GET: The resource has been fetched and is transmitted in the message body.
	//  HEAD: The representation headers are included in the response without any message body.
	//  PUT or POST: The resource describing the result of the action is transmitted in the message body.
	//  TRACE: The message body contains the request message as received by the server.
	OK: 200,
	//  The request has succeeded and a new resource has been created as a result. This is typically the response sent after POST requests, or some PUT requests.
	CREATED: 201,
	//  There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
	NO_CONTENT: 204,
	//  The server could not understand the request due to invalid syntax.
	BAD_REQUEST: 400,
	//  Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
	UNAUTHORIZED: 401,
	//  This response code is reserved for future use. The initial aim for creating this code was using it for digital payment systems, however this status code is used very rarely and no standard convention exists.
	PAYMENT_REQUIRED: 402,
	//  The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401, the client's identity is known to the server.
	FORBIDDEN: 403,
	//  The server can not find the requested resource. In the browser, this means the URL is not recognized.
	NOT_FOUND: 404,
	//  The request method is known by the server but is not supported by the target resource. For example, an API may forbid DELETE-ing a resource.
	METHOD_NOT_ALLOWED: 405,
	//  This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.
	NOT_ACCEPTABLE: 406,
	//  This response is sent when a request conflicts with the current state of the server.
	CONFLICT: 409,
	//  The client has indicated preconditions in its headers which the server does not meet.
	PRE_CONDITION_FAILED: 412,
	//  This response code means the expectation indicated by the Expect request header field can't be met by the server.
	EXPECTATION_FAILED: 417,
	//  The request was well-formed but was unable to be followed due to semantic errors.
	UNPROCESSABLE_ENTITY: 422,
	//  The request failed due to failure of a previous request.
	FAILED_DEPENDENCY: 424,
	// The server has encountered a situation it doesn't know how to handle.
	SERVER_ERROR: 500,
};
