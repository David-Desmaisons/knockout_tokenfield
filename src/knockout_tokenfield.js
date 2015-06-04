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

        function updater(state,cb){
            if (state.updating)
                return;

            state.updating=true;
            cb();
            state.updating=false;
        }

      ko.bindingHandlers.tokenfield = {
        init: function(element, valueAccessor, allBindings) {
            var $element=$(element),  value= valueAccessor(),
                tokens = value.tokens, options = allBindings.get('tokenfieldOptions'), state ={updating:false},
                display = options.display, tokenoptions = value.predefined,
                tokenFactory =value.tokenFactory || function(){return null;},
                counterCount = 0, finder = options.finder, typeaheadSource;

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $element.tokenfield('destroy');
            });

            $element.data('tokenfield_ko_options',options);
            $element.data('tokenfield_ko_state',state);

            if (!finder){
                var localsource = new Bloodhound({
                    datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.label);},
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    local: $.map(tokenoptions,function(el){return {value:el,label:el[display]};})
                });

                localsource.initialize();

                typeaheadSource =localsource.ttAdapter();
            }
            else{
                typeaheadSource = function (query, syncResults, asyncResults){
                    finder(query).then(function(val){
                        asyncResults($.map(val,function(el){return {value:el,label:el[display]};}));
                    });
                };
            }

            options.typeahead =[options.typeahead || null,{displayKey:'label',source:typeaheadSource}];


            $element.tokenfield(options)
            .on('tokenfield:createtoken', function (e) {
                if ((state.updating) || (e.fromSelection))
                    return true;

                //set temp label
                e.attrs.value = counterCount;

                var created = (function(count){
                    return tokenFactory(e.attrs.label,function(res){
                        $.each($element.tokenfield('getTokens'),function(index,element){
                            if (element.value===count){
                                if (res===null){

                                }
                                else{
                                    element.value=res;
                                    element.label = res[display];
                                }
                            }
                        });
                    });
                    })(counterCount++);

                if (created===null)
                    e.preventDefault();
                else if (typeof(created) != 'undefined'){
                     e.attrs.value = created;
                }
            })
            .on('tokenfield:createdtoken', function (e) {
                updater(state,function(){
                    var value = e.attrs.value;
                    if (value){
                        tokens.push(value);
                        console.log(value);
                    }
                });
            })
            .on('tokenfield:editedtoken', function (e) {
            })
            .on('tokenfield:edittoken', function (e) {
            })
            .on('tokenfield:removetoken', function (e) {
                 updater(state,function(){
                    tokens.splice($(e.relatedTarget).index(),1);
                });
            }).
            on('tokenfield:sortedtoken', function (e) {
                updater(state,function(){
                    var element = tokens()[e.oldPosition];
                    tokens.splice(e.oldPosition,1);
                    tokens.splice(e.newPosition,0,element);
                });
            });
        },

        update: function(element, valueAccessor, allBindingsAccessor, deprecated, bindingContext) {
            var $element=$(element), options= $element.data('tokenfield_ko_options'),
                value = ko.utils.unwrapObservable(valueAccessor()) || [], display = options.display;

             console.log('update');

            updater($element.data('tokenfield_ko_state'),function(){

                $element.tokenfield('setTokens', $.map(value.tokens(),function(el){
                    return {value:el, label:ko.utils.unwrapObservable(el[display])};
                }) );
            });
        }
    };
    
}));
