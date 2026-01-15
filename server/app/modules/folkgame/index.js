const express = require("express")
const adminModel = require('../admin/models')
const folkgame = express()

folkgame.set('views',_basepath+'app/views');

//============================= LOAD RESOURCES ================================//
adminModel.findAll('adminResources',{module:'folkgame'}, 'name', {},function(result){
    if(result.length > 0){
        result.forEach((resource) => {
            folkgame.use(`/${resource.name}`,
                // helpers.base.sanitizersQuery,
                helpers.admin.authAdmin, 
                require('./routes/'+resource.name
            ));
        })
    }
})
//============================= END RESOURCES =================================//

module.exports = folkgame;
