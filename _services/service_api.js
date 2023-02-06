class Service_API {
	constructor() {}
	
	get(url, callback = {}) {
		let xhttp = new XMLHttpRequest();
		
		xhttp.onreadystatechange = function() {
			if (this.readyState != 4  || this.status != 200) {
				return;
			}
			let response = this.responseText;
			
		
			if ((typeof callback) !== 'function' || response == "") {
				return;
			}
			
			callback(response);
		};
		
		xhttp.open("GET", url, false);
		// xhttp.setRequestHeader('Token', CookieService.getCookie('token'));
		xhttp.setRequestHeader('Cache-Control', 'no-cache');
		// xhttp.setRequestHeader('Content-Type', contentType);
		xhttp.send();
	}
	
	post(url, obj = {}, callback = {}) {		
		let xhttp = new XMLHttpRequest();
		
		xhttp.onreadystatechange = function() {
			if (this.readyState != 4  || this.status != 200) {
				return;
			}
			let response = this.responseText;
		
			if ((typeof callback) !== 'function' || response == "") {
				return;
			}
						
			callback(response);		
		};
	
		xhttp.open("POST", url , false);
		// xhttp.setRequestHeader('Token', CookieService.getCookie('token'));
		xhttp.setRequestHeader('Cache-Control', 'no-cache');
		// xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.send(JSON.stringify(obj));
	}
} 