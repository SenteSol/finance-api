
import mongoose from 'mongoose';
const { MONGODB_URL } = process.env;
const connectionString = async () => {
    try {
        await mongoose.connect(MONGODB_URL, {})
        console.log('connected to the database');
    } catch (e) {
        console.log('database connection failed....');
        console.error(e.message);
        process.exit(1);
    }


}
export default connectionString;
