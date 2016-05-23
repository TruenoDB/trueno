
/* NOTES */
/* Add failure on disconnect back to the promise */

var socket = {
  emit:function(){
    console.log("emitted",arguments);
  }
};

///**
// * Handler for the remote procedure call proxy(dynamically add functions).
// * @param {object} socket - The socket to attach the remote procedure call.
// * @return {object} A new object for the proxy handler.
// */
//_getHandler(socket) {
//
//  /* This instance object reference */
//  let self = this;
//
//  return {
//    set: function (obj, prop, value) {
//      /* Client part, this will add the function when connected to server,
//       * all functions will be bound */
//      obj[prop] = function () {
//
//        var upperArgs = arguments;
//        return new Promise(function (resolve, reject) {
//
//          /* Call the remote call residing in the server */
//          var args = Array.prototype.slice.call(upperArgs);
//          /* Add the first parameter (socket event to emit*/
//          args.unshift(prop);
//          /* Emit event */
//          socket.emit.apply(null, args);
//          /* On response
//          /* This emulates the return from the socket, it will bind the response from the server */
//          //resolve("Hi " + prop + "!");
//
//        });
//      };
//    }
//  }
//}


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
