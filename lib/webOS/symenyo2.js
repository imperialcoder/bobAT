document.addEventListener("keydown", function(event) {
    if (event.keyCode === 17) {
		window.hacks_symKeyTarget = event.target;
		new PalmServiceBridge().call("palm://com.palm.applicationManager/launch", "{\"id\": \"com.palm.systemui\", \"params\": {\"action\": \"showAltChar\"}}");
	}
});
window.hacks_sendFakeKey = function(type, charCode) {
	var e = document.createEvent("Events");
	e.initEvent(type, true, true);

	e.keyCode = charCode;
	e.charCode = charCode;
	e.which = charCode;

	window.hacks_symKeyTarget.dispatchEvent(e);
	return e;
};

if (!window.Mojo)
	window.Mojo = {};
window.Mojo.relaunch = function(event) {
	var altCharSelected = JSON.parse(PalmSystem.launchParams).altCharSelected;
	if (!altCharSelected) {
		return false;
	}

	var selection, newEvent, charCode;
	// Put the text into the editable element
	selection = window.getSelection();
	// make sure there are any available range to index as
	// getRangeAt does not protect against that
	if (selection && selection.rangeCount > 0 && selection.getRangeAt(0)) {
		document.execCommand("insertText", true, altCharSelected);
	}

	// Fire off our fake events
	charCode = altCharSelected.charCodeAt(0);
	window.hacks_sendFakeKey("keydown", charCode);
	window.hacks_sendFakeKey("keypress", charCode);
	window.hacks_sendFakeKey("keyup", charCode);
	//Event.stop(event);
};