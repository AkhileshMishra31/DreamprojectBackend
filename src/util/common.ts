const crypto = require('crypto');
const bcrypt = require('bcrypt');
export function generateReferralCode(username: string, length = 8) {
    // Ensure username is not too short
    const userPart = username.substring(0, 3).toUpperCase();

    // Generate a random string
    const randomPart = crypto.randomBytes(length)
        .toString('base64')
        .substring(0, length)
        .replace(/\+/g, '0')
        .replace(/\//g, '0');

    // Combine the parts
    return `${userPart}${randomPart}`;
}


export function generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomBytes(1)[0] % digits.length;
        otp += digits[randomIndex];
    }
    return otp;
}

export function hashPassword(password: string, saltRounds: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (saltErr: Error | null, salt: string | undefined) => {
            if (saltErr) {
                reject(saltErr); // Reject the promise on error
                return; // Ensure function exits after rejecting
            }
            bcrypt.hash(password, salt as string, (hashErr: Error | null, hashedPassword: string | undefined) => {
                if (hashErr) {
                    reject(hashErr); // Reject the promise on error
                    return; // Ensure function exits after rejecting
                }
                resolve(hashedPassword as string); // Resolve with hashed password
            });
        });
    });
}

export function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err: Error | null, isMatch: boolean) => {
            if (err) {
                reject(err); // Reject the promise on error
                return; // Ensure function exits after rejecting
            }
            resolve(isMatch); // Resolve with the comparison result
        });
    });
}

export function generateSessionString(): string {
    // Generate a random buffer and convert it to a base64 string
    const sessionString = crypto.randomBytes(22).toString('base64');
    // Replace non-url-safe characters and truncate to 30 characters
    return sessionString.replace(/\+/g, '0').replace(/\//g, '0').substring(0, 30);
}
