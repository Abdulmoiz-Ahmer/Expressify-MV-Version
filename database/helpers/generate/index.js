function generate(callback, limit = 10, params) {
	if (params) return Array.from(Array(limit), () => callback(params));
	return Array.from(Array(limit), () => callback());
}

module.exports = {
	generate,
};
