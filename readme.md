# HTML5 form validation jQuery plugin
Grab, modify, apply, enjoy...


## Description

A JavaScript, jQuery plugin for client side HTML5 form validation.

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

Enough talking lets get you started...

# Use cases

* Login form
* Registration form
* Custom error appearance 
* Single error container for all form fields
* Multiple groups of error containers
* Card details form

*TODO: features*
* compare two fields

# Implementation 

*// TODO:* details to follow...

## Options

*// TODO:* details to follow...

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

Assumes basic javaScript understanding. 
jQuery 1.7 and above is recommended (works with earlier some versions)

Requires that user to be able to specify custom "data-" attributes in the markup. 

## Disclaimer 

Since this is free to use software developed in my spare time it comes with no worranties 
and the author would not take any responsibility for implementations. 

Client side Form validation is to aid the user with filLing in a Form, warn them before 
an aditional HTTP request is made where the business logic validation rules should apply.

## License

MIT License  
Copyright (c) ZFDesign  

