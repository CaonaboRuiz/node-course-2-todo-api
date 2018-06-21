const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '(VALUE) is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// Override Mongoose.Schema.toJSON standard method
// is used when a schema is converted and returned as JSON value
// To hide jwt properties from the schema we override
// the standard method (toJSON) by creating this function.
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);  // exclude password, tokens
};

UserSchema.methods.generateAuthToken = function() {
    var user = this;  // Instance methods
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access: access, token: token});  // concat([{access, token}]);  //

    return user.save().then(() => {
        return token;
    });
};

// Model method using .statics is an object 
// which everything you add to it turns into a Model method  
UserSchema.statics.findByToken = function (token) {  
    var User = this;   // Model methods with capital User
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject('Invalid token rejected');
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,      // use ' ' for tokens[].token when '.' value
        'tokens.access': 'auth' 
    });
};

// Mongoose Middleware EVENTS Pre save to hash password when change
UserSchema.pre('save', function (next) {
    var user = this;

    // check if password was modified true/false
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
        
    } else {
        next();
    }
});

var User = mongoose.model('user', UserSchema);

module.exports = {User};