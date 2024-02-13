const { Op } = require("sequelize");
const db = require("../models");
const User = db.user.User;
const Role = db.role;
const validate = db.user.validate;
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
	try {
		// validate user
		let isValidated = validate(req.body);

		if (!!isValidated?.error) {
			return res.send({
				data: isValidated?.error?.details.map((v) => v.message),
			});
		}
        
        let userData = {
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            password:bcrypt.hashSync(req.body.password, 8)
        };

		// Creates user
		const result = await User.create(userData);

        const userRoles = req.body.roles;
        const roles = await Role.findAll();

        result.addRoles(roles);

		res.send({ data: result });
	} catch (err) {
		return res.send(err.message);
	}
};

exports.login = async (req, res) => {
    try{

        const {email, password} = req.body;

        let user = await User.findOne({
            where:{
                email:email
            }
        });

        if(!user){
            return res.send({
                error:'No user found, Please enter a valid email address'
            });
        }

        let isMatched = await bcrypt.compareSync(password, user.password);

        if(isMatched){
            let token = jwt.sign({ foo: 'bar' }, process.env.JWT_SECRET);

            return res.send({
                user,
                token
            })
        }else{
            return res.send({
                error:'Invalid email or password'
            })
        }
    }
    catch(err){
        return res.send(err.message);
    }
}
