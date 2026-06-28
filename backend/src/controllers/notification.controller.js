import Notification from '../models/Notification.js'

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })

        res.json({ success: true, notifications })
    } catch (err) {
        next(err)
    }
}
