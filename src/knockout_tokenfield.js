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

            var options = allBindings.get('tokenfieldOptions'),
                displayKey = value.displayKey;

            $element.data('tokenfield_ko_options',options);

            function source(query,sync,async){

            };

            options.typeahead =[null,{displayKey:displayKey,source:source}];


            $element.tokenfield(options); 
            $('#myField').tokenfield('setTokens', 'blue,red,white');
        },

        update: function(element, valueAccessor, allBindingsAccessor, deprecated, bindingContext) {
            var $element=$(element), options= $element.data('tokenfield_ko_options'),
                value = ko.utils.unwrapObservable(valueAccessor()) || [], displayKey = options.displayKey;

            $element.tokenfield('setTokens', $.map(value,function(el){
                return {value:el, label:ko.utils.unwrapObservable(el[displayKey])};
            }) );
        }
    };
    
}));
