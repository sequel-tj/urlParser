import mongoose from 'mongoose';

const URL = "mongodb://localhost:27017";

export const Connection = async () => {
    try {
        await mongoose.connect(URL + "/urlparser", {useUnifiedTopology: true});
        console.log("connected to database successfully!!");
        
    } catch (error) {
        console.log("error :", error.message);
    }
}