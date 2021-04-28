const Lesson = require('../models/Lesson.model');

// Add a lesson post 
// Route: /api
// exports.addLesson = async (req, res, next) => {
//     try {
//         const lesson = await Lesson.create(req.body);

//         return res.status(200).json({
//             success: true,
//             data: lesson
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500);
//     }
// };

// Get all lessons
// Route: /api
exports.getLessons = async (req, res, next) => {
    try {
        const lessons = await Lesson.find();

        return res.status(200).json({
            succes: true,
            count: lessons.length,
            data: lessons
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Server Error'});
    }
};