import Notification from '../models/Notification.js'
import mongoose from 'mongoose'

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })

        res.json({ success: true, notifications })
    } catch (err) {
        next(err)
    }
}

export const markAsRead = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid notification id' })
        }
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isRead: true },
            { new: true }
        )

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' })
        }

        res.json({ success: true, notification })
    } catch (err) {
        next(err)
    }
}
