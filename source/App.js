enyo.kind({
	name: "App",
	kind: "FittableRows",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", content: "bobAT"},
		{kind: "Signals", ondeviceready: "deviceready"},
		{kind: "enyo.Scroller", fit: true, components: [
			{kind: "onyx.InputDecorator", components: [
				{ name: "phoneNmbr", kind: "onyx.Input", value: '', placeholder: "Phone number", onchange: "numberChanged"}
			]},
			{kind: "onyx.InputDecorator", components: [
				{ name: "pwd", kind: "onyx.Input", value: '', placeholder: "Password", type: 'password', onkeydown: "searchOnEnter", onchange: "pwdChanged"}
			]},
			{name: "response", content: "", style: "padding: 8px;"}
		]},
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.Button", content: "Log in", ontap: "login"}
		]}
	],
	deviceReady: function() {
		// respond to deviceready event
		enyo.log('ready');
	},
	login: function(inSender, inEvent) {
		var number = this.$.phoneNmbr.getValue();
		var pwd = Base64.encode(this.$.pwd.getValue());

		var data = JSON.parse('{\"id\":\"' + number + '\",\"pwd\":\"' + pwd + '\"}');
		var stringData = JSON.stringify(data);

		var request = new enyo.Ajax({
			url: "https://fuelaustria.eu01.aws.af.cm/bobAT/",
			method: "POST",
			contentType: "raw",
			handleAs: "text", //options are "json", "text", or "xml"
			postBody: stringData
		}).error(this, function(inSender, inError) {
			this.$.response.setContent(inError);
		}).response(this, function(inSender, inResponse) {
			this.$.response.setContent(inResponse);
		});
		
		request.go();
		
	},
	searchOnEnter: function(inSender, inEvent) {
		if (inEvent.keyCode === 13) {
			this.login();
			return true;
		}
	}
});

/*enyo.kind({
	name: "App",
	kind: "Panels",
	fit: true,
	components: [
		{name: "MyStartPanel"},
		{name: "MyMiddlePanel"},
		{name: "MyLastPanel"}
	]
});*/

var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
			Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = Base64._keyStr.indexOf(input.charAt(i++));
			enc2 = Base64._keyStr.indexOf(input.charAt(i++));
			enc3 = Base64._keyStr.indexOf(input.charAt(i++));
			enc4 = Base64._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = 0, c1 = 0, c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c1 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
				i += 2;
			}
			else {
				c1 = utftext.charCodeAt(i+1);
				c2 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
				i += 3;
			}

		}
		return string;
	}
};