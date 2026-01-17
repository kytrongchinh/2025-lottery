const express = require("express")
const adminModel = require('../admin/models')
const general = express()

general.set('views',_basepath+'app/views');

//============================= LOAD RESOURCES ================================//
adminModel.findAll('adminResources',{module:'general'}, 'name', {},function(result){
    if(result.length > 0){
        result.forEach((resource) => {
            general.use(`/${resource.name}`,
                // helpers.base.sanitizersQuery,
                helpers.admin.authAdmin, 
                require('./routes/'+resource.name
            ));
        })
    }
})
//============================= END RESOURCES =================================//

module.exports = general;
