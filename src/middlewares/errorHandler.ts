// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../util/db'; // Import PrismaClientKnownRequestError explicitly
import { AppError } from '../util/AppError'; // Import custom AppError class

// Error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error stack trace for debugging (optional)

    // Handle specific known errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message
        });
    }

    // Handle Prisma Client errors
    if (err instanceof Error && err.message.includes('PrismaClientKnownRequestError')) {
        // Handle Prisma client known errors with status code 400
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: err.message
        });
    }

    // Default error handling
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
};
