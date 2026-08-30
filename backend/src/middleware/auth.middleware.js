// Verifies JWT from Authorization header
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { getJwtSecret } from '../lib/security.js'

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token format' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
        
        // Populate server-side user data to prevent client identity spoofing
        req.user = decoded;
        
        // Verify user account status if ID is present
        if (decoded.id) {
            const dbUser = await User.findById(decoded.id).select('role isDisabled isNewUser');
            if (!dbUser) return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
            if (dbUser.isDisabled) {
                return res.status(403).json({ success: false, message: 'Account is suspended' });
            }
            // Server-derived role overrides token claim to prevent stale role privileges
            req.user.role = dbUser.role;
            req.user.isNewUser = dbUser.isNewUser;
        }

        next()
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' })
    }
}

// Public endpoints may accept a bearer token to resolve identity-dependent options
// (for example, /projects?userId=me) without making the whole endpoint private.
export const optionalAuthMiddleware = async (req, res, next) => {
    if (!req.headers.authorization) return next();
    return authMiddleware(req, res, next);
};

export default authMiddleware
