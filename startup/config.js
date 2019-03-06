const config = require('config');

module.exports = function (){
        
    if(!config.get('jwtPrivateKey')){
        console.error("FATAL ERROR: No key found ");
        process.exit(1);
    }
    
}