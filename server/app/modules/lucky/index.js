const express = require("express")
const adminModel = require('../admin/models')
const lucky = express()

lucky.set('views',_basepath+'app/views');

//============================= LOAD RESOURCES ================================//
adminModel.findAll('adminResources',{module:'lucky'}, 'name', {},function(result){
    if(result.length > 0){
        result.forEach((resource) => {
            lucky.use(`/${resource.name}`,
                helpers.base.sanitizersQuery,
                helpers.admin.authAdmin, 
                require('./routes/'+resource.name
            ));
        })
    }
})
//============================= END RESOURCES =================================//

module.exports = lucky;
