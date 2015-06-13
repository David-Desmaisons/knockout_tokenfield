
$( document ).ready(function() {

  var globalcount=6, vm ={
    tokens : ko.observableArray([{name:'David',id:2},{name:'Claudia',id:1},{name:'Mateus',id:3}]),
    possibilities : [{name:'David',id:2},{name:'Claudia',id:1},{name:'Mateus',id:3},{name:'Amanda',id:0},{name:'Novo',id:5}],
    factory : function(label){
      return {label:label, value:{name:label,id:globalcount++}}; 
    }

  };

  ko.applyBindings(vm);
});
