const User = require('../models/user');
const jwt = require('jsonwebtoken');


//handle errors
const handleErrors = (err) =>{
    console.log(err.message, err.code);
    let errors = {firstname: '', lastname: '', email: '', gitHub : '', password:'', repeatPassword: ''};

    //incorrect email
    if(err.message === 'incorrect email'){
        errors.email = 'this email is not registered';
    }

     //incorrect password
    if(err.message === 'incorrect password'){
        errors.password = 'this password is not correct ';
    }

    //duplicate error code
    if(err.code === 11000){
        errors.email = 'this email is already registered';
        return errors;
    }

    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    
    return errors;
}

//jwt
const maxAge = 3* 24* 60 *60;

const createToken = (id) => {
  return jwt.sign({ id }, "net ninja secret", {
    expiresIn: maxAge,
  });
};
module.exports.signup_get = (req, res) =>{

  res.render('signup');
}

module.exports.login_get = (req, res)=>{

  res.render('login');
}

module.exports.signup_post = async (req, res)=>{
  const { firstname, lastname, email, gitHub, password, repeatPassword  } = req.body;

  try {
      const user = await User.create({firstname, lastname, email, gitHub, password, repeatPassword});
      const token = createToken(user._id);
      res.cookie('jwt', token, {httpOnly : true, maxAge: maxAge*1000});
      res.status(201).json({user : user._id});
  } catch (error) {
      const errors = handleErrors(error);
      res.status(400).json({errors});
  }
}

module.exports.login_post = async (req, res)=>{
  const { email, password } = req.body;

  try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, {httpOnly : true, maxAge: maxAge*1000});
      res.status(200).json({user : user._id});
  } catch (error) {
      const errors = handleErrors(error);
      res.status(400).json({});
  }
}

module.exports.logout_get = (req, res)=>{
  res.cookie('jwt', '', {maxAge : 1});
  res.redirect('/');
}