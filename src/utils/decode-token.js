import jwt from 'jsonwebtoken';

export const decodeToken = (req) => {
    const keys = process.env;
    const token = req.headers.authorization.split(' ')[1];
    return jwt.verify(token, keys.JWT_SECRET);
};
