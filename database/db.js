import mongoose from 'mongoose';

const URL = "mongodb://localhost:27017";

export const Connection = async (username, password) => {
    try {
        await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.uynq8l7.mongodb.net/urlParser?retryWrites=true&w=majority`, {useUnifiedTopology: true});
        console.log("connected to database successfully!!");
        
    } catch (error) {
        console.log("error :", error.message);
    }
}