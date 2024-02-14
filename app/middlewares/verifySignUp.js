const db = require('../models');
const Role = db.role;
const User = db.user.User;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
    let user = await User.findOne({
        where:{
            email:req.body.email
        }
    });

    if(user){
        return res.status(400).send({
            message:user
        })
    }

    next();
}

checkRoleExisted = async(req, res, next) => {

    let userRoles = req.body.roles;

    const roles = await Role.findAll();
    // console.log(roles, 'rolesroles')
    for(let i = 0; i < userRoles.length; i++){
        let role = roles[i].name;
        // console.log(role, 'rolerolerole')
        if(!userRoles.includes(role)){
            // return res.status(400).send({
            //     message:'User role is not availabel'
            // })
        }
    }

    next();

}

const verifySignup = {
    checkDuplicateUsernameOrEmail,
    checkRoleExisted
}

module.exports = verifySignup;

