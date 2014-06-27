/*
jQuery (client side) HTML5 Form validation plug-in  
	1. Form elements must meet W3C specification in well formness and validity 
	2. The plug-in provides an abstraction of the Validation constraints (http://dev.w3.org/html5/spec/constraints.html) 
	3. Giving the ability to display custom error messages set by "data-" attributes 
*/

;(function ($, window, document, undefined) {

	if(!$.ZFD) $.ZFD = {}; 
	if(!$.ZFD.ValidateForm) $.ZFD.ValidateForm = {};
	var _VF = $.ZFD.ValidateForm; // shorthand

	var isFormValid = false, isFieldValid = false;

    $.fn.ZFValidateForm = function(args) {

        var defaults = {
            defaultErrorMessage: 	'* Incorrect input', 	    // Default Error message if one not found
            errorClassName: 		'error', 					// Error class attribute value - NOT jQuery selector
            errorWrapToggleClass: 	'showError', 				// Error class attribute value - NOT jQuery selector
            singleErrorContainer: 	'.formValidationError',     // All Error messages in a Single container - jQuery Selector
            useSingleErrorContainer: false, 					// Enable all Error messages in a single container
            useCustomErrorContainer: false, 					// Enable all Error messages in the custom container specified in 'data-error-container'
            errorInsertBeforeField:  false,                     // Place Error message before validated field (does NOT apply when "errorClassName" element is Input sibling, NOR when useSingleErrorContainer = true)
            hideErrorOnClearedInput: true, 						// Hide Error messages when Input is cleared by the user
            disableBrowserValidation:true, 						// Disable HTML5 Browser validation (should be set to 'true')
            // events
            validateOnKeyup: 		false, 						// Validate Field onKeyup event
            validateOnBlur: 		false, 						// Validate Field onBlur event
            validateOnChange: 		true, 						// Validate Field onChange event
            validateOnLoad: 		false, 						// Validate Form on Document load and return "isFormValid"
            validateInputType: 		false, 						// Validate Field Type (NOT IN USE reserved for future)
            validateCustomRules:	true,						// Validates fields with attribute data-custom-validity='{"type": "expiryDate", "arguments": {"key": "value"}}'
            onDemandValidate: 		false, 						// TRUE: will give access to: $.fn.ZFValidateForm.onDemandValidate() Method - validates the Form with callback options, returns "isFormValid"
            // callbacks
            onFieldValid: 			function(){}, 				// onChange and onKeyup Field Valid Callback (runs onChange and onKeyup to avoid performance issues)
            onFieldNotValid: 		function(){}, 				// onChange and onKeyup Field NOT Valid Callback (runs onChange and onKeyup to avoid performance issues)
        onFormValid: 				function(){}, 				// on Submit and Form Valid Callback
            onFormInvalid: 			function(){}, 				// on Submit and Form NOT Valid Callback
            // field attributes
            minLength:              1, 							// default minimum length to validate against if no minLengthAttribute value is provided
            maxLength:              256, 						// default maximum length to validate against if no "maxlength" Attribute value is provided
            minLengthAttribute:     'data-minlength', 			// Attribute name for minimum required length
            minLengthMessage: 	    'data-minlength-message',	// Error message on minimum length validation fail
            maxLengthMessage: 	    'data-maxlength-message',	// Error message on "maxlength" validation fail
            requiredMessage: 		'data-required-message',	// Error message on "required" validation fail
            patternMessage: 		'data-pattern-message',		// Error message on "pattern" validation fail
            matchAttribute: 		'data-match-field',			// Attribute name for field matching values - jQuery Selector
            matchMessage: 			'data-match-message',		// Error message on "field match" validation fail
            // IE Fix
            isIE: new RegExp('MSIE|Trident').test(navigator.userAgent), // Is this IE
            // Debug mode
            debugMode:              false  						// Displays messages in the Console
          };

        var o = _VF.options = $.extend({}, defaults, args);

        // cached values
        var el, elId, $elParent, elValue, elLength, errorNode, validationEvent,

            $baseSelector = this,
            isInputsObj = areInputsSelected(),
            $FormFields = (isInputsObj) ? $baseSelector : (o.validateInputType) ? $baseSelector.find(':input') : $baseSelector.find('[required]'), // Extend: $.fn.ZFValidateForm.eachSelector.extend(this, data('FormFields'))
            fieldsLength = $FormFields.length,
            $Form = ($baseSelector.is('form')) ? $baseSelector : $baseSelector.parents('form');


        function getIdentity(element) {
            var identifier = ($(element).attr('id') !== undefined && $(element).attr('id').length > 0) ? $(element).attr('id') : $(element).attr('name');
            return identifier;
        }

        // TODO: refactor...
        function areInputsSelected() {
            var result = true;
            $baseSelector.each(function() {
                result = ($(this).is(':input')) ? result : false;
            });
            return result;
        }

        // Show/Hide Functions
        var showError = function(identity, $Parent, thatErrNode, errMsg) {
            var classValue = thatErrNode.replace( /^\.{0,1}/g , ''),
                htmlStr = ['<span class="', classValue, ' ', identity, '">', errMsg, '</span>'].join('');

            // Error messages in custom 'data-error-container' - jQuery selector
            if (o.useCustomErrorContainer && $('#' + identity).data('error-container') !== undefined) {
                var errContainer = $('#' + identity).data('error-container'), // Expects jQ Selector value
                    $custContainerChild = $(errContainer).children('.' + identity);

                if ($custContainerChild.length > 0) {
                    $custContainerChild.text(errMsg).show();
                } else {
                    $(errContainer).append(htmlStr);
                }
                $(errContainer).addClass(o.errorWrapToggleClass).show();
            }
            
            // Error messages appear in a single container 
            else if (o.useSingleErrorContainer) {
                var $singleContainerChild = $(o.singleErrorContainer).children('.' + identity);

                if ($singleContainerChild.length > 0) {
                    $($singleContainerChild).text(errMsg).show();
                } else {
                    $(o.singleErrorContainer).append(htmlStr);
                }
                $(o.singleErrorContainer).addClass(o.errorWrapToggleClass).show();
            } 
            
            else {
                // Expects Error message container for each field within the Input parent node
                if ($Parent.children(thatErrNode).length > 0) {
                    $Parent.addClass(o.errorWrapToggleClass).children(thatErrNode).html(errMsg).show();
                } else {

                    $Parent.addClass(o.errorWrapToggleClass);
                    if (o.errorInsertBeforeField) {
                        $(htmlStr).insertBefore('#' + identity).show();
                    } else {
                        $(htmlStr).insertAfter('#' + identity).show();
                    }
                }
            }
        },

        hideError = function(identity, $Parent, thatErrNode) {
            // Custom 'data-error-container' - jQuery selector
            if (o.useCustomErrorContainer && $('#' + identity).data('error-container') !== undefined) {
                var errContainer = $('#' + identity).data('error-container'), // Expects jQ Selector value
                    $custContainerChild = $(errContainer).children('.' + identity);
                if ($custContainerChild.length > 0) {
                    $custContainerChild.hide();
                    if ($(errContainer).find("." + o.errorClassName + ":visible").length === 0) {
                        $(errContainer).removeClass(o.errorWrapToggleClass).hide();
                    }
                }
            }
            // Single container Error message
            else if (o.useSingleErrorContainer) {
                var $singleContainerChild = $(o.singleErrorContainer).children('.' + identity);

                if ($singleContainerChild.length > 0) {
                    $singleContainerChild.hide();
                    if ($(o.singleErrorContainer).find("." + o.errorClassName + ":visible").length === 0) {
                        $(o.singleErrorContainer).removeClass(o.errorWrapToggleClass).hide();
                    }
                }
            }
            else {
                $Parent.removeClass(o.errorWrapToggleClass).children(thatErrNode).hide();
            }
        },

        // Validation functions
        requiredCheck = function() {
            var requiredMsg = $(el).attr(o.requiredMessage),
                errorMessage = (requiredMsg !== undefined && requiredMsg.length > 0) ? requiredMsg : o.defaultErrorMessage;

            // Modern Browsers (faster)
            if (el.willValidate && el.validity.valueMissing && !(isIE && el.nodeName === 'SELECT')) { // IE updates 'el.validity.valueMissing' after 'onchange' event has completed and fails here
                isFieldValid = false;
                showError(elId, $elParent, errorNode, errorMessage);
            } // Older browsers
            else if (elLength === 0) {
                isFieldValid = false;
                showError(elId, $elParent, errorNode, errorMessage);
            }
            else {
                isFieldValid = true;
                hideError(elId, $elParent, errorNode);
            }
        },

        minlenthCheck = function () {
            var minLengthAttr = $(el).attr(o.minLengthAttribute), 
                minLength = (minLengthAttr && minLengthAttr.length > 0) ? minLengthAttr : o.minLength, 
                errMinMsg = $(el).attr(o.minLengthMessage), 
                errorMessage = (errMinMsg !== undefined && errMinMsg.length > 0) ? errMinMsg : o.defaultErrorMessage; // !== undefined
                
                if(o.debugMode) { $.error('\n\tZFValidateForm DebugMode log:  \n\t\t Event: '+ o.minLengthAttribute + ' validation \n\t\t Element: ' + elId + ' \n\t\t Field validity: ' + isFieldValid +' \n\t\t minlength value: ' + minLength  + ' \n\t\t Error message: ' + errorMessage); }

            
            // Modern Browsers
            if(el.willValidate && el.validity.rangeUnderflow) {
                isFieldValid = false;
                showError(elId, $elParent, errorNode, errorMessage);
            } // Older browsers
            else if (elLength < minLength) {
                isFieldValid = false;
                showError(elId, $elParent, errorNode, errorMessage);
            }
            else {
                isFieldValid = true;
                hideError(elId, $elParent, errorNode);
            }
        },

        maxlenthCheck = function () {
            var maxLengthAttr = $(el).attr('maxlength'), 
                maxLength = (maxLengthAttr && maxLengthAttr.length > 0) ? maxLengthAttr : o.maxLength, 
                errMaxMsg = $(el).attr(o.maxLengthMessage), 
                errorMessage = (errMaxMsg !== undefined && errMaxMsg.length > 0) ? errMaxMsg : o.defaultErrorMessage;
                
                if(o.debugMode) { $.error('\n\tZFValidateForm DebugMode log:  \n\t\t Event: maxlength validation \n\t\t Element: ' + elId + ' \n\t\t Field validity: ' + isFieldValid +' \n\t\t maxlength value: ' + maxLength  + ' \n\t\t Error message: ' + errorMessage); }

            // Modern Browsers
            if(el.willValidate && el.validity.rangeOverflow) {
                isFieldValid = false;
                showError(elId, $elParent, errorNode, errorMessage);
            } // Older browsers
            else if (elLength > maxLength) {
                isFieldValid = false;
                showError(elId, $elParent, errorNode, errorMessage);
            }
            else {
                isFieldValid = true;
                hideError(elId, $elParent, errorNode);
            }
        },        
        
        patternCheck = function() {
            var patternErr = $(el).attr(o.patternMessage), 
                errMsg = (patternErr !== undefined && patternErr.length > 0) ? patternErr : o.defaultErrorMessage;
            // Modern Browsers
            if (el.willValidate) {
                if (el.validity.patternMismatch) {
                    isFieldValid = false;
                    showError(elId, $elParent, errorNode, errMsg);

                    if(o.debugMode) { $.error('\n\tZFValidateForm DebugMode log:  \n\t\t Event: New Browser validation \n\t\t Element: ' + elId +' \n\t\t Field validity: ' +!el.validity.valid); }
                }
            } // Older browsers
            else {
                var patternAttr = $(el).attr('pattern'),
                    pattern = (patternAttr && patternAttr.length > 0) ? patternAttr : null;

                if (pattern !== null) {
                    if (new RegExp(pattern).test(elValue)) {
                        isFieldValid = true;
                        hideError(elId, $elParent, errorNode);
                    } else {
                        isFieldValid = false;
                        showError(elId, $elParent, errorNode, errMsg);
                    }

                if(o.debugMode) { $.error('\n\tZFValidateForm DebugMode log:  \n\t\t Event: Pattern validation (OLD) \n\t\t Pattern: ' + new RegExp(pattern).test(elValue) + '\n\t\t Element: ' + elId +' \n\t\t Field validity: ' + isFieldValid); }  
                }

            }
        },

        matchInput = function() {
            var $el = $(el),
            		matchAttribute = $el.attr(o.matchAttribute),
        				matchErr = $el.attr(o.matchMessage), 
                errMsg = (matchErr !== undefined && matchErr.length > 0) ? matchErr : o.defaultErrorMessage;

                if ( $(matchAttribute).val() === $el.val() ) {
                    isFieldValid = true;
                    hideError(elId, $elParent, errorNode);
                } else {
                    isFieldValid = false;
                    showError(elId, $elParent, errorNode, errMsg);
                }

                if(o.debugMode) { $.error('\n\tZFValidateForm DebugMode log:  \n\t\t Event: Field Match validation \n\t\t Validated Field value: ' + $el.val() + '\n\t\t Did not match: ' + $(matchAttribute).val()); }  


        };



        // Validate
        var validateField = _VF.validateField = function(myElement, errContainer, fnCallback) { // exposed by $.ZFD.ValidateForm.validateField(field, errorContainer) 
            isFieldValid = true;

            el = myElement,
            elId = getIdentity(el),
            $elParent = $(el).parent(),
            elValue = $(el).val(),
            elLength = elValue.length,
            errorNode = (errContainer === undefined) ? '.' + o.errorClassName : errContainer;

            // validation checks
            // REQUIRED
            if ($(el).attr('required') !== undefined && $(el).attr('required') !== false) { // jQuery 1.4 returns boolean
                requiredCheck();
            }

            // MINLENGTH
            if (isFieldValid && $(el).attr(o.minLengthAttribute) !== undefined) { // undefined 
                minlenthCheck();
            }

            // MAXLENGTH
            if (isFieldValid && ($(el).attr('maxlength') !== undefined && $(el).attr('maxlength') !== -1)) { // jQuery 1.4 returns -1
                maxlenthCheck();
            }

            // PATTERN
            if (isFieldValid && $(el).attr('pattern') !== undefined && $(el).attr('pattern').length > 0) { // jQuery 1.4 returns ""
                patternCheck();
            }
			
						// MATCH FIELD VALUE
						if (isFieldValid && $(el).attr(o.matchAttribute) !== undefined && $(el).attr(o.matchAttribute).length > 0) { // jQuery 1.4 returns ""
                matchInput();
            }

            // CUSTOM RULES
            if (o.validateCustomRules) {
                // Expiry date
                if (isFieldValid && $(el).data('customValidity') === "expiryDate") {
                    validateExpiryDate(el);
                }
            }

            // Callback
            if ($.isFunction(fnCallback)) {
                fnCallback(isFieldValid);
            }

            if(o.debugMode) { $.error('\n\tZFValidateForm DebugMode log:  	\n\t\t Function: validateField \n\t\t Element: ' + elId + '\n\t\t Field validity: ' + isFieldValid); }

            return isFieldValid;

        }; // End Field validation


        // Bind Events
        function bindEvent(eName) {
            //unbind namespace events to stop multiple instances of bindings // TODO: use destroy function
            $FormFields.unbind(eName + '.ZFValidateForm');
            //bind namespace events
            $FormFields.bind(eName + '.ZFValidateForm', function(event) {

                var myEl = event.target; // returns DOM Element

                // hideErrorOnClearedInput
                if (o.hideErrorOnClearedInput && $(myEl).val().length === 0) {
                    hideError(getIdentity(myEl), $(myEl).parent(), '.' + o.errorClassName);
                } 
                else {
                    validateField(myEl);
                }

                // Callbacks
                if (isFieldValid && $.isFunction(o.onFieldValid)) {
                    o.onFieldValid(myEl);
                }
                if (!isFieldValid && $.isFunction(o.onFieldNotValid)) {
                    o.onFieldNotValid(myEl);
                }

             // Debug Mode
						if(o.debugMode) { $.error('\n\tZFValidateForm DebugMode log: \n\t\t Event: ' + eName + ': \n\t\t Element: ' + getIdentity(myEl) + " \n\t\t Field validity: " + isFieldValid); } 

            });
        }

        // FORM onKeyup event
        if (o.validateOnKeyup) {
            validationEvent = "keyup";
            bindEvent(validationEvent);
        }

        // FORM onBlur event
        if (o.validateOnBlur && !o.validateOnKeyup) {
            validationEvent = "blur";
            bindEvent(validationEvent);
        }

        // FORM onChange event
        if (o.validateOnChange && !o.validateOnBlur && !o.validateOnKeyup) {
            validationEvent = "change";
            bindEvent(validationEvent);
        }


        // Form Validation
        var validateForm = _VF.validateForm = function() {
            validationEvent = "submit";
            isFormValid = true;
            for (var i = 0; i < fieldsLength; i += 1) {
                validateField($FormFields[i]);
                isFormValid = (isFieldValid) ? isFormValid : false;
                //updateObjects({'isFieldValid': isFieldValid} , {'isFormValid': isFormValid});
            }

            // Callbacks
            if (isFormValid && $.isFunction(o.onFormValid)) {
                o.onFormValid();
            }
            if (!isFormValid && $.isFunction(o.onFormInvalid)) {
                o.onFormInvalid();
            }

						// Debug Mode:  /!\ alert to pause the form submission 
						if(o.debugMode) { alert('Form validity: ' + isFormValid); }

            return isFormValid;
        };

        // FORM onSubmit event
        //$Form.bind('submit.ZFValidateForm', function() {
        $Form.submit(function(e) { 
        	e.preventDefault(); 
        	validateForm();
        	if (isFormValid) { 
        		e.target.submit(); 
        	} else {
        		return false;
        	}
      	});

        // Disable HTML5 Browser built-in validation
        if (o.disableBrowserValidation) {
            var ifForm = ($Form) ? $Form : '';
            $(ifForm + '[type=submit]').attr('formnovalidate', '');
        }

		/* 
		var updateObjects = function(objects) {
			var args, // = isArray. ... .arguments.split(','), // Arguments passed
				argsLength = args.length;
			if(!_VF[args(name)]) { _VF[args(name)] = {} } 
			_VF[args(name)] = args(value); // assign value 
		}
		// */


        // TODO: Validate Custom Rules (export into external JS AMD module, only load if necessary) // if(o.validateCustomRules)
        // Card Expiry Date Validation 
        // minimum required values Month and Year; Day will be set to last day of the Month if not provided
        var today = new Date(),
            expDate = new Date(),
            expDateDefaults = {
                Year: "data-expiry-year",                   // Required Number or Attribute name (containing Number or jQuery Selector)
                Month: "data-expiry-month",                 // Required as above
                Day: "data-expiry-day",                     // as above
                requiredMessage: "data-required-message",   // Error message on "required" validation fail
                expiredMessage: "data-expired-message"      // Error message on "past date" validation fail
            };

        function validateExpiryDate(myEl, dateOptions) { // USE: validateExpiryDate({Year: 2014, Month: "#myID || myAttribute", Day: undefined, errorMessage: "Date not Valid!"}) 
            var ops = (dateOptions === undefined) ? { } : dateOptions;

            for (var index in expDateDefaults) {
                if (ops[index] === undefined) ops[index] = expDateDefaults[index];
            }

            var errorRequired = (ops.requiredMessage !== undefined && ops.requiredMessage.length > 0) ? $(myEl).attr(ops.requiredMessage) : o.defaultErrorMessage,
                errorExpired  = (ops.expiredMessage !== undefined  && ops.expiredMessage.length > 0)  ? $(myEl).attr(ops.expiredMessage)  : o.defaultErrorMessage,
                getDateDecimal = function(datePart, partType) {
                    var datePartInt = undefined;

                    if (datePart !== undefined) {
                        var $datePartAttr = $(myEl).attr(datePart);

                        // if Number
                        if ($.isNumeric(datePart)) {
                            datePartInt = parseInt(datePart, 10);
                        } 
                        // or Attribute
                        else if ($datePartAttr !== undefined && $datePartAttr.length > 0) {
                            // Attribute value as Number
                            if ($.isNumeric($datePartAttr)) {
                                datePartInt = parseInt($datePartAttr, 10);
                            }
                            // Attribute value as jQ Selector
                            else if ($($datePartAttr).length > 0 && $.isNumeric($($datePartAttr).val())) {
                                datePartInt = parseInt($($datePartAttr).val(), 10);
                            }
                        } 
                    } 

                    if (datePartInt !== undefined) {
                        if (partType === "year" && datePartInt.toString().length === 2) {
                            datePartInt += 2000; // to invalidate user 2 digit year input use: data-minlength or pattern check
                        } else if (partType === "month") {
                            if (datePartInt < 1 || datePartInt > 12) {
                                datePartInt = undefined;
                            } else {
                                datePartInt -= 1;
                            }
                        } else if (partType === "day") {
                            if (datePartInt < 1 || datePartInt > 31) {
                                datePartInt = undefined;
                            }
                        }
                    }
                    return datePartInt;
                },
                getLastDay = function() {
                    var lastDay = new Date(expYear, expMonth + 1, 0);
                    return lastDay.getDate();
                },
                expYear  = getDateDecimal(ops.Year, "year"),
                expMonth = getDateDecimal(ops.Month, "month"),
                expDay 	 = getDateDecimal(ops.Day, "day");


            if (expYear === undefined || expMonth === undefined) { 
                isFieldValid = false;
                // Hide Error onChange or onKeyup for Invalid Date
                if (o.hideErrorOnClearedInput && (validationEvent === "keyup" || validationEvent === "change" || validationEvent === "blur")) {
                    hideError(elId, $elParent, errorNode);
                } else {
                    showError(elId, $elParent, errorNode, errorRequired); 
                }
            }
            else { // Validate
                if (expDay === undefined) {
                    expDay = getLastDay();
                }
                expDate.setFullYear(expYear, expMonth, expDay);
                if (today < expDate) {
                    isFieldValid = true;
                    hideError(elId, $elParent, errorNode);
                } else {
                    isFieldValid = false;
                    showError(elId, $elParent, errorNode, errorExpired);
                }
            }

			// Debug Mode
			if(o.debugMode) { $.error("Today: " + today + "\nExpiry Date: " + expDate); }
        } //validateExpiryDate END


		
		/* 
		*  PUBLIC functions:
		*  Use: $.ZFD.ValidateForm.onDemandValidate();
		*/

		// onDemand form validation
		if(o.onDemandValidate) {

			_VF.onDemandValidate = function(uDemand) {
				var demands = {
						beforeValidation: false,  	// Function
						isValid: false,				// Function
						notValid: false, 			// Function
						doSubmit: false				// Boolean
					},
					d = $.extend(demands, uDemand);

				if ($.isFunction(d.beforeValidation)) { d.beforeValidation(); }
					
				validateForm();
				if (isFormValid && $.isFunction(d.isValid)) {
					d.isValid();
					if (d.doSubmit) { $Form.submit(); }
				}
					
				if(!isFormValid && $.isFunction(d.notValid)) { d.notValid(); }
					
				// Debug Mode
				if(o.debugMode) { $.error('\n\tZFValidateForm DebugMode log: \n\t\t Event: onDemandValidate \n\t\t Form validity: ' + isFormValid); }

				return isFormValid;
			};
		}
        

		_VF.destroy = function() {
			setTimeout( function() { // change to if exists
			    var eventsList = ["keyup", "blur", "change"];
                for(var i in eventsList) {
			        $FormFields.unbind(eventsList[i] + '.ZFValidateForm');
                }
				$Form.unbind('submit.ZFValidateForm');
			}, 500);

			if(o.debugMode) { $.error("ZFValidateForm Destroy call!"); } // debugMode: true needs to be set in this file
		};
		
		return $FormFields;
  };

})(jQuery, window, document);