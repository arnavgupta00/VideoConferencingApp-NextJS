import "dotenv/config";
import mongoose from "mongoose" ;


const url = process.env.MONGOOSE_URL  || 'mongodb://127.0.0.1:27017';


export default async function connect() {
    await mongoose.connect(url + "/videoConference");
}

