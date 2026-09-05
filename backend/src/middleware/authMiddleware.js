const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Admin = require('../models/adminModel');
const Student = require('../models/Staff'); // Student model maps to Staff collection
const cache = require('../utils/cache');

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

    // 3) High-speed user lookup with 30s cache and lean selection to avoid loading heavy arrays
    const cacheKey = `auth:user:${decoded.id}`;

    const userAuthData = await cache.fetchOrCompute(cacheKey, async () => {
        let currentUser = null;
        let userRole = decoded.role;

        if (!userRole) {
            currentUser = await Admin.findById(decoded.id).select('name email role').lean();
            if (currentUser) {
                userRole = 'admin';
            } else {
                currentUser = await Student.findById(decoded.id)
                    .select('name employeeId email role isRemoved department reportingPerson')
                    .lean();
                if (currentUser) {
                    userRole = 'student';
                }
            }
        } else {
            if (userRole === 'admin') {
                currentUser = await Admin.findById(decoded.id).select('name email role').lean();
            } else if (userRole === 'student' || userRole === 'staff') {
                currentUser = await Student.findById(decoded.id)
                    .select('name employeeId email role isRemoved department reportingPerson')
                    .lean();
                userRole = 'student'; // Normalize staff/student to 'student'
            }
        }

        if (!currentUser) return null;
        return { currentUser, userRole };
    }, 30);

    if (!userAuthData || !userAuthData.currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
        );
    }

    if (userAuthData.currentUser.isRemoved) {
        // Clear cache if user was removed
        cache.del(cacheKey);
        return next(
            new AppError(
                'This account has been removed. Please contact admin.',
                401
            )
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = userAuthData.currentUser;
    req.role = userAuthData.userRole;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    };
};
