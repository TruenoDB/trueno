
/* NOTES */
/* Add failure on disconnect back to the promise */

var socket = {
  emit:function(){
    console.log("emitted",arguments);
  }
};

var handler = {
   set: function(obj, prop, value) {
    /* Client part, this will add the function when connected to server, all functions will be bound */
    obj[prop] = function(){
       
      var upperArgs = arguments;
      
       return new Promise(function(resolve, reject){
         
         /* Call the remote call residing in the server */
         var args = Array.prototype.slice.call(upperArgs);
         args.unshift(prop);
         socket.emit.apply(null,args);
         
         /* This emulates the return from the socket, it will bind the response from the server */
         setTimeout(function(){
           resolve("Hi " + prop + "!");
         },1000);
       });
    };
  }
};

var rpc = {};
rpc.rfn = new Proxy({},handler);

/* On Server */
rpc.rfn.hello = function(args){
  return "Hi there "+ args;
};

/* On Client */
rfn.hello("victor").then(
  function(result){

    console.log(results);

  }, 
  function(error){

    console.log(error);

});
