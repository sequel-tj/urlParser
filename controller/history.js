import mongoose from 'mongoose';

const dataSchema = mongoose.Schema({
    question: String,
    answer: String
});

const histories = mongoose.model('histories', dataSchema);
export default histories;