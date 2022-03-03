export function convertInterparkBookDateWithDelimiter(yyyymmdd, delimiter = "-") {
	return yyyymmdd.replace(/(\d{4})(\d{2})(\d{2})/, `$1${delimiter}$2${delimiter}$3`);
};
export function parseQueryVariable(querystring, variable) {
	const query = querystring.substring(1);
	const vars = query.split('&');
	for (let i = 0; i < vars.length; i++) {
		const pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) === variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	return null;
}