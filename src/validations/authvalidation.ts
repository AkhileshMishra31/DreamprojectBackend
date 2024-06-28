import Joi from 'joi';

export const SignupValidation = (value: any) => {

    const registrationSchema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required()
            .messages({
                'string.base': 'Username should be a valid string',
                'string.empty': 'Username is required',
                'string.min': 'Username should have at least {#limit} characters',
                'string.max': 'Username should have at most {#limit} characters',
                'any.required': 'Username is required'
            }),
        email: Joi.string().email().required()
            .messages({
                'string.base': 'Email should be a valid string',
                'string.empty': 'Email is required',
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email is required'
            }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
            .messages({
                'string.base': 'Password should be a valid string',
                'string.empty': 'Password is required',
                'string.pattern.base': 'Password must be alphanumeric with 3-30 characters',
                'any.required': 'Password is required'
            }),
        repeat_password: Joi.string().valid(Joi.ref('password')).required()
            .messages({
                'any.only': 'Passwords must match',
                'string.empty': 'Repeat password is required'
            }),
        region: Joi.string().required()
            .messages({
                'string.base': 'Region should be a valid string',
                'string.empty': 'Region is required',
                'any.required': 'Region is required'
            }),
        address: Joi.string().required()
            .messages({
                'string.base': 'Address should be a valid string',
                'string.empty': 'Address is required',
                'any.required': 'Address is required'
            }),
        referralCode: Joi.string().allow('').optional()
            .messages({
                'string.base': 'Referral code should be a valid string',
                'string.allow': 'Referral code can be empty',
            }),
        phoneNumber: Joi.string().optional()
            .messages({
                'string.base': 'Phone number should be a valid string'
            }),
    }).messages({
        'string.base': '{{#label}} should be a valid string',
        'string.empty': '{{#label}} is required',
        'string.email': 'Please provide a valid {{#label}}',
        'string.min': '{{#label}} should have at least {{#limit}} characters',
        'string.max': '{{#label}} should have at most {{#limit}} characters',
        'any.required': '{{#label}} is required',
        'string.allow': '{{#label}} should be a valid string',
        'string.optional': '{{#label}} should be optional'
    });

    const result = registrationSchema.validate(value, { abortEarly: false });
    return result;
};


export const logInSessionValidation = (value: any) => {

    const registrationSchema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30)
            .messages({
                'string.base': 'Username should be a valid string',
                'string.empty': 'Username is required',
                'string.min': 'Username should have at least {#limit} characters',
                'string.max': 'Username should have at most {#limit} characters'
            }),
        email: Joi.string().email()
            .messages({
                'string.base': 'Email should be a valid string',
                'string.empty': 'Email is required',
                'string.email': 'Email must be a valid email address'
            }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
            .messages({
                'string.base': 'Password should be a valid string',
                'string.empty': 'Password is required',
                'string.pattern.base': 'Password must be alphanumeric with 3-30 characters',
                'any.required': 'Password is required'
            })
    }).xor('username', 'email')
        .messages({
            'object.missing': 'Either username or email is required'
        });

    const result = registrationSchema.validate(value, { abortEarly: false });
    return result;
};


export const LoginValidation = (value: any) => {
    const loginSchema = Joi.object({
        loginSession: Joi.string().required()
            .messages({
                'string.base': 'Login session should be a valid string',
                'string.empty': 'Login session is required'
            }),
        email: Joi.string().email()
            .messages({
                'string.base': 'Email should be a valid string',
                'string.empty': 'Email is required',
                'string.email': 'Email must be a valid email address'
            })
    }).and('loginSession', 'email')
        .messages({
            'object.and': 'Both login session and email are required'
        });

    const result = loginSchema.validate(value, { abortEarly: false });
    return result;
};


