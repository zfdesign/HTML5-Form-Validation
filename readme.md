# HTML5 form validation jQuery plugin
Grab, modify, apply, enjoy...


## Description

A JavaScript, jQuery plugin for client side HTML5 form validation. Link to the 
[Web site](http://zfdesign.github.com/HTML5-Form-Validation/) dedicated to this pugin. 

This HTML5 Form validation plugin is _free_ and hopefully it will be found easy 
to use and implement on your Web site under MIT [License](#license). 
Please quote the plugin author wherever possible and refer to the documentation. 

This plugin adheres to HTML5 Forms specification to _gracefully degrade_ to browser 
buitin validation. It supresses the compliant browsers default validation messages, 
allowing the user to specify container for individual error messages or to
group error messages in a single container at a suitable place on the page.
It employs "data-" attributes to provide functionality and bind warning messages. 
It will also work with older browsers and non HTML5 Form documents, remember to test.
Do not assume it will just work. 

The Web developer is in control over validation executions, with function call-backs 
for Validation events. It has a debug mode and a way that allows to access features 
and enble debugging in production code. 


##List of supported validation checks 

* Required attribute [(standard)](http://www.whatwg.org/specs/web-apps/current-work/multipage/common-input-element-attributes.html#the-required-attribute)
* Minimum length through custom "data-minlength" attribute (can be set by the developer)
* Maxlength attribute [(standard)](http://www.whatwg.org/specs/web-apps/current-work/multipage/common-input-element-attributes.html#the-maxlength-attribute)
* Pattern attribute [(standard)](http://www.whatwg.org/specs/web-apps/current-work/multipage/common-input-element-attributes.html#the-pattern-attribute)
* Custom validation rules
* Date: Day, Month and Year

Ref. [www.whatwg.org Client side form validation](http://www.whatwg.org/specs/web-apps/current-work/multipage/forms.html#client-side-form-validation) 

Those are provided out of the box, but feel free to tweak and modify for your needs. 
Fork on GitHub and/or submit your suggestions for improvements. The author has 
already a few tweaks in his mind. Finding the time for it all is difficult. 

Enough talking lets get started...


# Use cases

Here are a few examples from the [Web site](http://zfdesign.github.com/HTML5-Form-Validation/) dedicated to this pugin. 

* [Login form](http://zfdesign.github.com/HTML5-Form-Validation/examples/login.html)
* [Registration form](http://zfdesign.github.com/HTML5-Form-Validation/examples/register.html)
* Custom error appearance 
** [Single error container for all form fields](http://zfdesign.github.com/HTML5-Form-Validation/examples/register.html#SingleErrorContainer)
** Multiple groups of error containers - [Card details example](http://zfdesign.github.com/HTML5-Form-Validation/examples/card-details.html)


# Implementation 

## Simple
It could is a simple as: 

* Include jQuery and ZFValidateForm.js
* Set Input attributes (requires use of custom "data-" attributes)
* Add a JavaScript line: 

	$('formSelector').ZFValidateForm(); 


## With 'options'

It is similar as above, but when needed the user can customise some of the defaults. 
A simple example is the [Card details example](http://zfdesign.github.com/HTML5-Form-Validation/examples/card-details.html). 


### Options reference: 

* defaultErrorMessage: 		'* Incorrect input', 		// Default Error message if one not found
* errorClassName: 			'error', 					// Error class attribute value - NOT jQuery selector 
* errorWrapToggleClass: 	'showError', 				// Error class attribute value - NOT jQuery selector 
* singleErrorContainer: 	'.formValidationError', 	// All Error messages in a Single container - jQuery Selector
* useSingleErrorContainer: 	false, 						// Enable all Error messages in a single container
* useCustomErrorContainer: 	false, 						// Enable all Error messages in the custom container specified in 'data-error-container'
* errorInsertBeforeField:  	false,               		// Place Error message before validated field (does NOT apply when "errorClassName" element is Input sibling, NOR when useSingleErrorContainer = true)
* hideErrorOnClearedInput: 	true, 						// Hide Error messages when Input is cleared by the user
* disableBrowserValidation:	true, 						// Disable HTML5 Browser validation (should be set to 'true') 

// events
* validateOnKeyup: 			false, 						// Validate Field onKeyup event
* validateOnBlur: 			false, 						// Validate Field onBlur event
* validateOnChange: 		true, 						// Validate Field onChange event
* validateOnLoad: 			false, 						// Validate Form on Document load and return "isFormValid"
* validateInputType: 		false, 						// Validate Field Type (NOT IN USE reserved for future)
* validateCustomRules:		true,						// Validates fields with attribute data-custom-validity='{"type": "expiryDate", "arguments": {"key": "value"}}'
* onDemandValidate: 		false, 						// TRUE: will give access to: $.fn.ZFValidateForm.onDemandValidate() Method - validates the Form with callback options, returns "isFormValid"

// callbacks
* onFieldValid: 			function(){}, 				// onChange and onKeyup Field Valid Callback (runs onChange and onKeyup to avoid performance issues)
* onFieldNotValid: 			function(){}, 				// onChange and onKeyup Field NOT Valid Callback (runs onChange and onKeyup to avoid performance issues)
* onFormValid: 				function(){}, 				// on Submit and Form Valid Callback
* onFormInvalid: 			function(){}, 				// on Submit and Form NOT Valid Callback

// field attributes
* minLength: 				1, 								// default minimum length to validate against if no minLengthAttribute value is provided
* maxLength: 				256, 						// default maximum length to validate against if no "maxlength" Attribute value is provided
* minLengthAttribute: 		'data-minlength', 			// Attribute name for minimum required length 
* minLengthMessage: 		'data-minlength-message',	// Error message on minimum length validation fail
* maxLengthMessage: 		'data-maxlength-message',	// Error message on "maxlength" validation fail
* requiredMessage: 			'data-required-message',	// Error message on "required" validation fail
* patternMessage: 			'data-pattern-message',		// Error message on "pattern" validation fail
* matchAttribute: 			'data-match-field',			// Attribute name for field matching values - jQuery Selector
* matchMessage: 			'data-match-message',		// Error message on "field match" validation fail

// Debug mode
debugMode: false  										// Displays messages in the Console



Remeber Client side validation does enfoce business logic, it is there to suggest, 
help and guide the user through sometimes mundaine form submission. 


## Browser support 

At the time of writing the plugin is found to be working well and stable in the most popular 
desktop browsers (Chrome, Firefox, Safari, Opera) in Windows, Mac OS, iOS and Android, it is 
the imperative that you test for the platfoms you intend to support.

The browser landscape changes everyday with updates pushed and new ones being available. 
Many variations depending on hardware vary especially on Mobile devices are present. Although 
intention is for updates and bug fixes to be made regularly and as per requests, the author 
cannot take responsibility for implementations. 


## Dependencies 

Assumes basic JavaScript understanding. 
jQuery 1.7 and above is recommended (works with some earlier versions)

Requires that user to be able to specify custom "data-" attributes in the markup. 


## Disclaimer 

Since this is free to use software developed in my spare time it comes with no worranties 
and the author would not take any responsibility for implementations. 

Client side Form validation is to aid the user with filLing in a Form, warn them before 
an aditional HTTP request is made where the business logic validation rules should apply.


## License

MIT License  
Copyright (c) ZFDesign  

