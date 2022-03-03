function dateFormat() {
	//eslint-disable-next-line
	Date.prototype.format = function (format) {
		if (!this.valueOf()) return " ";
		
		const weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
		const weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
		const weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		const weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const d = this;
		
		return format.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
			switch ($1) {
				case "yyyy": return d.getFullYear(); // 년 (4자리)
				case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
				case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)
				case "dd": return d.getDate().zf(2); // 일 (2자리)
				case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
				case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)
				case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
				case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)
				case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
				case "hh":
					const h = d.getHours() % 12;
					return (h ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
				case "mm": return d.getMinutes().zf(2); // 분 (2자리)
				case "ss": return d.getSeconds().zf(2); // 초 (2자리)
				case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
				default: return $1;
			}
		});
	};
	
	//eslint-disable-next-line
	String.prototype.string = function (len) { let s = '', i = 0; while (i++ < len) { s += this; } return s; };
	//eslint-disable-next-line
	String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
	//eslint-disable-next-line
	Number.prototype.zf = function (len) { return this.toString().zf(len); };
}

export default dateFormat;


