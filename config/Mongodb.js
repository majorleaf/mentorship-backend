
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
    try{
        mongoose.connection.on("error",(error)=>{
             console.error("Mongodb connection error:", error);
         })

         const url =`${process.env.MONGODB_URL }/mentorshipproject`;
         await mongoose.connect(url);
         console.log("database connected successfully")
    }catch (error) {
        console.log(error)

    }
}
export default connectDb;