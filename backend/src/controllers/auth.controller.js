// OAuth callback and JWT issue logic
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { getAsgardeoConfig, verifyAsgardeoToken } from '../config/asgardeo.js'
import { createOidcState, createPkceChallenge, createPkceVerifier, getJwtSecret, safeEqual, securityLog } from '../lib/security.js'
import { optionalHttpUrl, requiredText, limits } from '../lib/validation.js'

export const initiateAsgardeoLogin = (req, res) => {
    const config = getAsgardeoConfig();
    const prompt = req.query.prompt === 'select_account' ? 'select_account' : 'login';
    const state = createOidcState();
    const verifier = createPkceVerifier();
    const secure = process.env.NODE_ENV === 'production';
    res.cookie('oidc_state', state, { httpOnly: true, secure, sameSite: 'lax', maxAge: 10 * 60 * 1000, path: '/api/auth/asgardeo' });
    res.cookie('oidc_pkce', verifier, { httpOnly: true, secure, sameSite: 'lax', maxAge: 10 * 60 * 1000, path: '/api/auth/asgardeo' });

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: config.scopes,
        prompt,
        state,
        code_challenge: createPkceChallenge(verifier),
        code_challenge_method: 'S256',
    });
    res.redirect(`${config.authorizationEndpoint}?${params.toString()}`);
};

export const handleAsgardeoLogout = (req, res) => {
    const config = getAsgardeoConfig();

    const params = new URLSearchParams({
        client_id: config.clientId,
        post_logout_redirect_uri: config.redirectUri,
    });

    res.redirect(`${config.logoutEndpoint}?${params.toString()}`);
};

const isUuidString = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());

export const extractAsgardeoClaims = (payload = {}, userinfo = {}) => {
    const sub = userinfo.sub || payload.sub || '';

    const getValue = (...keys) => {
        for (const source of [userinfo, payload]) {
            if (!source || typeof source !== 'object') continue;
            for (const key of keys) {
                const val = source[key];
                if (val !== undefined && val !== null && val !== '') {
                    if (typeof val === 'string' && val.trim() !== '') return val.trim();
                    if (Array.isArray(val) && val.length > 0) {
                        const first = val[0];
                        if (typeof first === 'string' && first.trim() !== '') return first.trim();
                        if (first && typeof first === 'object' && first.value) return String(first.value).trim();
                    }
                    if (typeof val === 'object' && val.value) return String(val.value).trim();
                }
            }
        }
        return '';
    };

    // 1. Email
    let email = getValue(
        'email',
        'emailAddress',
        'email_address',
        'http://wso2.org/claims/emailaddress',
        'emails',
        'emailAddresses'
    );

    // 2. Username
    let username = getValue(
        'username',
        'userName',
        'preferred_username',
        'preferredUsername',
        'http://wso2.org/claims/username'
    );

    if (!email && username && username.includes('@')) {
        email = username;
    }

    if (!username && email) {
        username = email;
    }

    if ((!username || isUuidString(username)) && email) {
        username = email;
    }

    // 3. Name (Given Name + Family Name or Name/DisplayName)
    const firstName = getValue(
        'given_name',
        'givenName',
        'http://wso2.org/claims/givenname',
        'first_name',
        'firstName'
    );
    const lastName = getValue(
        'family_name',
        'familyName',
        'http://wso2.org/claims/lastname',
        'last_name',
        'lastName'
    );

    let constructedName = '';
    if (firstName || lastName) {
        constructedName = `${firstName} ${lastName}`.trim();
    }

    let name = constructedName || getValue(
        'name',
        'fullName',
        'full_name',
        'displayName',
        'display_name',
        'http://wso2.org/claims/fullname'
    );

    if (!name || isUuidString(name)) {
        if (username && !isUuidString(username)) {
            name = username.includes('@') ? username.split('@')[0] : username;
        } else if (email && !email.endsWith('@asgardeo.local')) {
            name = email.split('@')[0];
        }
    }

    if (!email) email = `${sub}@asgardeo.local`;
    if (!username || isUuidString(username)) username = email.includes('@') ? email.split('@')[0] : email;
    if (!name || isUuidString(name)) name = username;

    // 4. Contact Number
    const contactNumber = getValue(
        'phone_number',
        'phoneNumber',
        'mobile',
        'mobileNumber',
        'mobile_number',
        'http://wso2.org/claims/mobile',
        'phoneNumbers',
        'telephoneNumber'
    );

    // 5. Profile Picture
    const profilePic = getValue('picture', 'profilePic', 'profile_pic', 'avatar');

    return {
        sub,
        email,
        username,
        name,
        contactNumber,
        profilePic,
    };
};

export const handleAsgardeoCallback = async (req, res, next) => {
    try {
        const { code, error, error_description, state } = req.query;
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        if (error) {
            console.error('Asgardeo auth error:', error, error_description);
            return res.redirect(`${clientUrl}/login?error=${encodeURIComponent(error_description || error)}`);
        }

        if (!code || !safeEqual(state, req.cookies?.oidc_state) || !req.cookies?.oidc_pkce) {
            securityLog('auth.oidc_callback_rejected', { reason: !code ? 'missing_code' : 'invalid_state' });
            return res.redirect(`${clientUrl}/login?error=Missing authorization code`);
        }

        const config = getAsgardeoConfig();
        const tokenParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: config.redirectUri,
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code_verifier: req.cookies.oidc_pkce,
        });
        res.clearCookie('oidc_state', { path: '/api/auth/asgardeo' });
        res.clearCookie('oidc_pkce', { path: '/api/auth/asgardeo' });

        const tokenResponse = await fetch(config.tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: tokenParams.toString(),
        });

        if (!tokenResponse.ok) {
            securityLog('auth.oidc_token_exchange_failed', { status: tokenResponse.status });
            return res.redirect(`${clientUrl}/login?error=Failed to exchange token with Asgardeo`);
        }

        const tokenData = await tokenResponse.json();
        const { id_token, access_token } = tokenData;

        let payload = null;
        try {
            if (!id_token) throw new Error('Missing ID token');
            payload = await verifyAsgardeoToken(id_token);
        } catch (vErr) {
            securityLog('auth.oidc_token_rejected', { reason: vErr.message });
            return res.redirect(`${clientUrl}/login?error=Invalid identity token from Asgardeo`);
        }

        if (!payload) {
            return res.redirect(`${clientUrl}/login?error=Invalid identity token from Asgardeo`);
        }

        // Fetch UserInfo claims using access token for extra claims (phone_number, username, given_name, family_name)
        let userinfo = {};
        if (access_token && config.userinfoEndpoint) {
            try {
                const userInfoRes = await fetch(config.userinfoEndpoint, {
                    headers: { 'Authorization': `Bearer ${access_token}` }
                });
                if (userInfoRes.ok) {
                    userinfo = await userInfoRes.json();
                } else {
                    securityLog('auth.oidc_userinfo_failed', { status: userInfoRes.status });
                }
            } catch (uErr) {
                console.warn('Asgardeo UserInfo fetch warning:', uErr.message);
            }
        }

        const claims = extractAsgardeoClaims(payload, userinfo);
        const { sub, email, username, name, contactNumber, profilePic } = claims;
        const normalizedEmail = email ? email.toLowerCase().trim() : '';

        // 1. Find by asgardeoId FIRST to ensure we update the exact existing Asgardeo user
        let user = await User.findOne({ asgardeoId: sub });

        // 2. If not found by asgardeoId, check by case-insensitive email
        if (!user && normalizedEmail && !normalizedEmail.endsWith('@asgardeo.local')) {
            user = await User.findOne({
                email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
            });
        }

        // 3. If not found by email, check by case-insensitive username
        if (!user && username && !isUuidString(username)) {
            user = await User.findOne({
                username: { $regex: new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
            });
        }

        if (user) {
            let needsSave = false;
            if (!user.asgardeoId) { user.asgardeoId = sub; needsSave = true; }

            // Sync username if missing, currently UUID, or updated
            if (username && !isUuidString(username) && (isUuidString(user.username) || !user.username || user.username === sub)) {
                user.username = username;
                needsSave = true;
            } else if (username && user.username !== username && !isUuidString(username)) {
                const existingUserWithUsername = await User.findOne({ username, _id: { $ne: user._id } });
                if (!existingUserWithUsername) {
                    user.username = username;
                    needsSave = true;
                }
            }

            // Sync name if missing, currently UUID, or equal to fallback
            if (name && !isUuidString(name) && (isUuidString(user.name) || !user.name || user.name === sub || user.name === user.email?.split('@')[0])) {
                user.name = name;
                needsSave = true;
            } else if (name && user.name !== name && !isUuidString(name)) {
                user.name = name;
                needsSave = true;
            }

            // Sync email if current is placeholder @asgardeo.local or real email available
            if (email && !email.endsWith('@asgardeo.local') && (user.email.endsWith('@asgardeo.local') || (user.email.toLowerCase() !== normalizedEmail))) {
                const existingUserWithEmail = await User.findOne({
                    email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
                    _id: { $ne: user._id }
                });
                if (!existingUserWithEmail) {
                    user.email = email;
                    needsSave = true;
                }
            }

            // Sync contactNumber
            if (contactNumber && user.contactNumber !== contactNumber) {
                user.contactNumber = contactNumber;
                needsSave = true;
            }

            if (profilePic && !user.profilePic) {
                user.profilePic = profilePic;
                needsSave = true;
            }

            if (needsSave) await user.save();
        } else {
            // Comprehensive safety guard before ANY User.create call:
            // Check asgardeoId, email, and username to prevent E11000 duplicate key errors
            let existingUser = await User.findOne({ asgardeoId: sub });
            if (!existingUser && normalizedEmail && !normalizedEmail.endsWith('@asgardeo.local')) {
                existingUser = await User.findOne({
                    email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
                });
            }
            if (!existingUser && username && !isUuidString(username)) {
                existingUser = await User.findOne({
                    username: { $regex: new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
                });
            }

            if (existingUser) {
                user = existingUser;
                let needsSave = false;
                if (!user.asgardeoId) { user.asgardeoId = sub; needsSave = true; }
                if (needsSave) await user.save();
            } else {
                user = await User.create({
                    asgardeoId: sub,
                    email,
                    username,
                    name,
                    contactNumber,
                    profilePic,
                    role: 'STUDENT',
                    isNewUser: true,
                });
            }
        }

        if (user.isDisabled) {
            return res.redirect(`${clientUrl}/login?error=Account suspended. Please contact support.`);
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isNewUser: user.isNewUser,
                sub: user.asgardeoId,
            },
            getJwtSecret(),
            { expiresIn: '7d' }
        );

        res.redirect(`${clientUrl}/auth/callback#token=${encodeURIComponent(token)}`);
    } catch (err) {
        next(err);
    }
};

export const handleGoogleCallback = (req, res) => {

    const user = req.user

    if (user.isDisabled) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=Account suspended. Please contact support.`)
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            isNewUser: user.isNewUser,
        },
        getJwtSecret(),
        { expiresIn: '7d' }

    )

    res.redirect(`${process.env.CLIENT_URL}/auth/callback#token=${encodeURIComponent(token)}`)
}

export const selectRole = async (req, res, next) => {
    try {
        const { role } = req.body

        if (!['STUDENT', 'RECRUITER'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' })
        }

        const user = await User.findOneAndUpdate(
            { _id: req.user.id, isNewUser: true },
            { role, isNewUser: false },
            { new: true }
        )

        if (!user) {
            return res.status(409).json({ success: false, message: 'Role has already been selected' })
        }

        // issue a fresh token with updated role
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isNewUser: false,
            },
        getJwtSecret(),
            { expiresIn: '7d' }
        )

        res.json({ success: true, token, user })
    } catch (err) {
        next(err)
    }
}


export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const name = requiredText(req.body.name, 'Name', limits.name);
        const profilePic = optionalHttpUrl(req.body.profilePic, 'Profile picture URL');

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, profilePic },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // issue a fresh token with updated profile info
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isNewUser: user.isNewUser,
            },
        getJwtSecret(),
            { expiresIn: '7d' }
        );

        res.json({ success: true, token, user });
    } catch (err) {
        next(err);
    }
}




