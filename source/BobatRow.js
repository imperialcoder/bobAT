enyo.kind({
	name: "BobatRow",
	published: {
		"label": "",
		"field": ""
	},
	components: [
		{kind: "FittableColumns", noStretch: true, components: [
			{ name: "label", classes: "row-label" },
			{ name: "field", fit: true, classes: "row-field" }
		]}
    ],
	create: function () {
		this.inherited(arguments);

		this.labelChanged();
		this.fieldChanged();
	},
	labelChanged: function (oldValue) {
		this.$.label.setContent(this.getLabel());
	},
	fieldChanged: function(oldValue) {
		this.$.field.setContent(this.getField());
	}
});