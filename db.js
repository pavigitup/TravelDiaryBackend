const mongoose = require('mongoose');

const uri = 'mongodb+srv://pavithrag:pavithra123@mern-blog.zlzmfaw.mongodb.net/traveldiary';

const initializeDB = async (app) => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB Atlas');
        app.listen(3004, () => { 
            console.log(`Server is running on port http://localhost:3004`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error.message);
        process.exit(1); 
    }
};

module.exports = initializeDB;
