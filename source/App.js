enyo.kind({
	name: "bobAT",
	kind: enyo.FittableRows,
	classes: "onyx enyo",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", //style: "text-align: center;", layoutKind: "FittableColumnsLayout",
		components: [
			//{kind: "Group", components: [
				{ kind: "onyx.Button", style: "height: 45px", name:"prefsButton", ontap:"showSettings", components: [ {kind: "onyx.Icon", src: "assets/settings.png"} ]},
				{ kind: "Image", src: "assets/toolbar-logo-45.png" },
				{ kind: "onyx.IconButton", src: "assets/toolbar-icon-sync.png", ontap: "load" }
			//]}
		]},
		{kind: "Signals", ondeviceready: "deviceready"},
		{kind: "enyo.Scroller", fit: true, classes: "bobat", components: [
			{
				name: "loading",
				classes: "onyx-scrim enyo-fit onyx-scrim-translucent",
				kind: "onyx.Popup",
				centered: true,
				modal: true,
				floating: true,
				scrim: true,
				scrimWhenModal: true,
				autoDismiss: false,
				style: "background: #eee;color: black;",
				components: [
					{kind: "onyx.Spinner", classes: "onyx-light"}
				]
			},
			{
				name: "settingsPopup",
				classes: "onyx-scrim enyo-fit onyx-scrim-translucent",
				kind: "onyx.Popup",
				centered: true,
				modal: true,
				floating: true,
				//scrim: true,
				//scrimWhenModal: true,
				autoDismiss: false,
				// onShow: "popupShown",
				// onHide: "popupHidden",
				components: [
					{kind: "onyx.InputDecorator", style: "background-color: #ffffff", components: [
						{ name: "phoneNmbr", kind: "onyx.Input", value: '', placeholder: "Phone number", onchange: "numberChanged"}
					]},
					{kind: "onyx.InputDecorator", style: "background-color: #ffffff", components: [
						{ name: "pwd", kind: "onyx.Input", value: '', placeholder: "Password", type: 'password', onkeydown: "searchOnEnter"/*, onchange: "pwdChanged"*/}
					]},
					{tag: "br"},
					{kind: "onyx.Button", content: "Close", ontap: "closeSettingsPopup"},
					{kind: "onyx.Button", content: "Save", ontap: "saveAndCloseSettingsPopup"}
				]
			},
			{kind: "onyx.Groupbox", showing: false, classes: "bobat-groupbox", name: "costManagerContainer", components: [
				{kind: "onyx.GroupboxHeader", content: "Cost manager"}
			]},			
			{ tag: "br" },
			{kind: "onyx.Groupbox", showing: false, classes: "bobat-groupbox", name: "clientInfoContainer", components: [
				{kind: "onyx.GroupboxHeader", content: "Client info"}
			]},
			{name: "error", allowHtml: true, content: "", style: "padding: 8px;"}
		]}
	],
	deviceReady: function() {
		// respond to deviceready event
		enyo.log('ready');
	},
	rendered: function() {
		this.inherited(arguments);

		if(this.getNumber() && this.getPwd()) {
			this.load();
		} else {
			this.showSettings();
		}
	},
	load: function(inSender, inEvent) {
		this.$.loading.show();
		var number = this.getNumber();
		var pwd = this.getPwd();

		var data = JSON.parse('{\"id\":\"' + number + '\",\"pwd\":\"' + pwd + '\"}');
		var stringData = JSON.stringify(data);

		var request = new enyo.Ajax({
			url: "https://fuelaustria.eu01.aws.af.cm/bobAT/",
			method: "POST",
			timeout: 10000,
			contentType: "raw",
			handleAs: "json", //options are "json", "text", or "xml"
			postBody: stringData
		});

		request.error(this, this.dataError);
		request.response(this, this.dataResponse);

		request.go();

	},
	dataResponse: function (inSender, inResponse) {
		//iterate over client info
		var clientInfo = inResponse.data.clientInfo;
		var costManager = inResponse.data.costManager;

		this.$.clientInfoContainer.destroyComponents();
		this.$.costManagerContainer.destroyComponents();

		for(var key in clientInfo){
			var attrName = key;
			var attrValue = clientInfo[key];
			this.$.clientInfoContainer.createComponent({ kind: "BobatRow", label: attrName, field: attrValue });
		}

		for(var key in costManager){
			var attrName = key;
			var attrValue = costManager[key];
			this.$.costManagerContainer.createComponent({ kind: "BobatRow", label: attrName, field: attrValue });
		}

		this.$.costManagerContainer.setShowing(true);
		this.$.clientInfoContainer.setShowing(true);

		this.$.clientInfoContainer.render();
		this.$.costManagerContainer.render();

		this.$.loading.hide();
	},
	dataError: function (inSender, inError) {
		this.$.error.setContent('Error ' + inError + ', ' + inSender.xhrResponse.body);
		this.$.loading.hide();
	},
	showSettings: function(inSender, inEvent) {
		var number = this.getNumber();
		var pwd = this.getPwd();

		this.$.phoneNmbr.setValue(number);
		this.$.pwd.setValue(Base64.decode(pwd));

		this.$.settingsPopup.show();
	},
	closeSettingsPopup: function(inSender, inEvent) {
		this.$.settingsPopup.hide();
	},
	saveAndCloseSettingsPopup: function (inSender, inEvent) {
		var number = this.$.phoneNmbr.getValue();
		var pwd = Base64.encode(this.$.pwd.getValue());

		localStorage.setItem('bobAT_number', number);
		localStorage.setItem('bobAT_pwd', pwd);

		this.$.phoneNmbr.setValue('');
		this.$.pwd.setValue('');

		this.$.settingsPopup.hide();
		this.load();
	},
	getNumber: function() {
		return localStorage.getItem('bobAT_number');
	},
	getPwd: function() {
		return localStorage.getItem('bobAT_pwd');
	},
	searchOnEnter: function(inSender, inEvent) {
		if (inEvent.keyCode === 13) {
			this.saveAndCloseSettingsPopup();
			return true;
		}
	},
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
});
searchOnEnter: function(inSender, inEvent) {
		if (inEvent.keyCode === 13) {
			this.load();
			return true;
		}
	},
	

*/



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