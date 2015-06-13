;(function(factory) {
    //CommonJS
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(require("knockout"), require("jQuery"), require("Async_Queue"), exports);
        //AMD
    } else if (typeof define === "function" && define.amd) {
        define(["knockout", "jQuery", "Async_Queue", "exports"], factory);
        //normal script tag
    } else {
        factory(window.ko, window.$, window.Async_Queue);
    }
}(function(ko, $) {

        function updater(state,cb){

            state.queue.enQueue( function(){
                if (state.updating)
                    return;

                state.updating=true;
                cb();
                state.updating=false;
            });
        }

      ko.bindingHandlers.tokenfield = {
        init: function(element, valueAccessor, allBindings) {
            var $element=$(element),  value= valueAccessor(),
                tokens = value.tokens, options = allBindings.get('tokenfieldOptions'), state ={updating:false, queue : new Async_Queue()},
                display = options.display, tokenoptions = value.predefined,
                tokenFactory = value.tokenFactory, 
                finder = options.finder, typeaheadSource;

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

                var found=false;
  
                $.each(tokenoptions ||[], function(index,element){
                    if (element[display]==e.attrs.label){
                        e.attrs.value = element;
                        found=true;
                        return false;
                    }
                });

                if (found) return true;

                var created = tokenFactory(e.attrs.label);

                if (!!created){
                     e.attrs.value = created.value;
                     e.attrs.label = created.label;
                }
            })
            .on('tokenfield:createdtoken', function (e) {
                updater(state,function(){

                    var value = e.attrs.value;

                    if (state.editing){
                        tokens.splice(state.editing.index,1,value);
                        state.editing=null;
                    }
                    else{
                        tokens.push(value);
                    }
                });
            })
            .on('tokenfield:editedtoken', function (e) {
            })
            .on('tokenfield:edittoken', function (e) {
                state.editing={ attrs: e.attrs, index: $(e.relatedTarget).index()};
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
            var $element=$(element), options= $element.data('tokenfield_ko_options'),state = $element.data('tokenfield_ko_state'),
                value = ko.utils.unwrapObservable(valueAccessor()) || [], display = options.display;

             console.log('update');

             if (state.updating)
                    return;

            updater(state,function(){

                $element.tokenfield('setTokens', $.map(value.tokens(),function(el){
                    return {value:el, label:ko.utils.unwrapObservable(el[display])};
                }) );
            });
        }
    };
    
}));
