import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = "mongodb+srv://foodsync:foodsyncpakistan123@foodsync.j0pshvy.mongodb.net/FoodsyncDB?retryWrites=true&w=majority&appName=foodsync";
        const conn = await mongoose.connect(uri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
