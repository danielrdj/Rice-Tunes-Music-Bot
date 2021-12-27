const os = require('os');
const fs = require('fs');
const EventEmitter = require("events"); // An event class
const emitter = new EventEmitter();

function printModule(){
    //console.log(module);
    console.log(os.totalmem());
    console.log(os.freemem());
    //let fileString = fs.readdirSync("./");
    //console.log(fileString);

    fs.readdir("$", function(err,files){
        if(err){
            console.log("There was an error ", err);
        } else {
            console.log("Result ", files);
        }
    })
}

// Registering listener
emitter.on("logging", (args) => {
    console.log("Listener Called");
    console.log(args.message);
});


/*
emitter.on("messageLogged", function(args){
    console.log("Listener Called");
    console.log(args.id);
});
*/


// Emitting a message
function emittingFunction(){ // better to encapsulate other emissions in an object
    emitter.emit("logging", {id: 69, url: "httpd://", message: "Hello There"}); //Event argument
}
emittingFunction();

//printModule();