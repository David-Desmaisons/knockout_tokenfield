;(function(factory) {
    //CommonJS
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(require("knockout"), require("jQuery"), exports);
        //AMD
    } else if (typeof define === "function" && define.amd) {
        define(["knockout", "jQuery", "exports"], factory);
        //normal script tag
    } else {
        factory(ko, $);
    }
}(function(ko, $) {

      ko.bindingHandlers.tokenfield = {
        init: function(element, valueAccessor, allBindings) {
            var $element=$(element),  value = ko.utils.unwrapObservable(valueAccessor()) || {};

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $element.tokenfield('destroy');
            });


            $(element).tokenfield({
            delimiter: ko.tokenfield[element.id].bindings['Delimiter'], 
            allowEditing: false, 
            createTokensOnBlur: true, 
            typeahead: [null, {
                name: element.id,
                displayKey: ko.tokenfield[element.id].bindings['KeyDisplay'],
                source: (function() {
                }) }]
            }); 
        },

        update: function(element, valueAccessor, allBindingsAccessor, deprecated, bindingContext) {
        }
    };
    
}));
