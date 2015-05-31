
$( document ).ready(function() {

  var vm ={
    tokens : ko.observableArray([{name:'David',id:2},{name:'Claudia',id:1},{name:'Mateus',id:3}])

  };

  ko.applyBindings(vm);

  // $('#tokenfield-simple').tokenfield({sortable:true});

  //   $('#tokenfield').tokenfield({
  //   autocomplete: {
  //     source: [{label:'red',value:0 },'blue','green','yellow','violet','brown','purple','black','white'],
  //     minLength: 2,
  //     delay: 100,
     
  //   }, sortable:true,showAutocompleteOnFocus: true})
  //   .on('tokenfield:createtoken', function (e) {
  //   })
  //   .on('tokenfield:createdtoken', function (e) {
  //   })
  //   .on('tokenfield:edittoken', function (e) {
  //   })
  //   .on('tokenfield:removedtoken', function (e) {
  //   });

  //   var engine = new Bloodhound({
  //     local: [{label:0,value: 'red'}, {label:1,value: 'blue'}, {label:2,value: 'green'} , {value: 'yellow'}, {value: 'violet'}, {value: 'brown'}, {value: 'purple'}, {value: 'black'}, {value: 'white'}],
  //     datumTokenizer: function(d) {
  //       return Bloodhound.tokenizers.whitespace(d.value);
  //     },
  //     queryTokenizer: Bloodhound.tokenizers.whitespace
  //   });

  //   engine.initialize();

  //   $('#tokenfield-typeahead').tokenfield({
  //     typeahead: [null, { source: engine.ttAdapter() }],
  //     sortable:true
  //   });
});
