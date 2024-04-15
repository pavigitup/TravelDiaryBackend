const mongoose = require('mongoose');

const diaryEntrySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    photos: [String] 
});

const DiaryEntry = mongoose.model('DiaryEntry', diaryEntrySchema, 'diaryEntry');

module.exports = DiaryEntry;
