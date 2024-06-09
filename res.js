'use strict';

exports.ok = function(values,res){
    var data ={
        'status':200,
        'values':values
    };

     res.json(data);
     
}

exports.error = function( message, res) {
    var error = {
        'status':400,
        message: message
    };

    res.status(400).json({ error: error });
};