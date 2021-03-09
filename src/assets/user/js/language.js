/*global bb:true */
// global object for site-wide functions and utilities
var bb = bb ? bb : {};
$.extend(bb,{
	// language variables for translation (e.g Next, Previous, Close)
	language: {
		"labels": {
			"global": {
				"noResults": "Sorry, no results were found.",
				"removeConfirm": "Are you sure you want to remove this?",
				"removeSavedConfirm": "Are you sure you want to replace the existing item?",
				"uploadError": "There was an error with the upload, please try again",
				"genericError": "There was an error with your request, please try again",
				"warnDuplicate": "Already added to list."
			},
			"modal": {
				"error": "Sorry, there was an error with your request.",
				"close": "Close",
				"video": "Video"
			}
		}
	}
});