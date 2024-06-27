import Joi from 'joi';
import { VerificationType } from '../interfaces/common';

export const emailVerificationValidation = (value: any) => {
    const emailVerificationSchema = Joi.object({
        email: Joi.string().email().required()
            .messages({
                'string.base': 'Email should be a valid string',
                'string.empty': 'Email is required',
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email is required'
            }),
        otp: Joi.string().pattern(/^[0-9]{4}$/).required()
            .messages({
                'string.base': 'OTP should be a valid string',
                'string.empty': 'OTP is required',
                'string.pattern.base': 'OTP must be a 4-digit number',
                'any.required': 'OTP is required'
            }),
        type: Joi.string().valid(...Object.values(VerificationType)).required() // Validate 'type' against VerificationType enum values
            .messages({
                'any.only': 'Invalid {{#label}} provided',
                'string.base': 'Type should be a valid string',
                'string.empty': 'Type is required',
                'any.required': 'Type is required'
            })
    }).messages({
        'string.base': '{{#label}} should be a valid string',
        'string.empty': '{{#label}} is required',
        'string.email': 'Please provide a valid {{#label}}',
        'string.pattern.base': '{{#label}} must be a valid pattern',
        'any.required': '{{#label}} is required'
    });

    const result = emailVerificationSchema.validate(value, { abortEarly: false });
    return result;
};