// Parses req, calls inspections.service, shapes HTTP response

const inspectionsService = require('./inspections.service');
const asyncHandler = require('../../shared/utils/async-handler');

const schedule = asyncHandler(async (req, res) => {
    const { bookingId, scheduledAt, notes } = req.body;
    const userId = req.user.userId;
    const inspection = await inspectionsService.scheduleInspection({
        bookingId,
        scheduledAt,
        notes,
        userId
    });
    res.status(201).json({
        success: true,
        data: inspection
    });
});

const confirm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const inspection = await inspectionsService.confirmInspection(id, userId);
    res.status(200).json({
        success: true,
        data: inspection
    });
});

const complete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const inspection = await inspectionsService.completeInspection(id, userId);
    res.status(200).json({
        success: true,
        data: inspection
    });
});

const cancel = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const inspection = await inspectionsService.cancelInspection(id, userId);
    res.status(200).json({
        success: true,
        data: inspection
    });
});

const getByBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const inspections = await inspectionsService.getInspectionsByBookingId(bookingId);
    res.status(200).json({
        success: true,
        data: inspections
    });
});

module.exports = {
    schedule,
    confirm,
    complete,
    cancel,
    getByBooking
};
