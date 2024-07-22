import mongoose from 'mongoose';

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    
    //step 1:- Check if already database connection
   if(connection.isConnected){
       console.log("Already connected to database");
       return;
    }
   
    //step 2:- Create new database connection
    try {
       const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
       connection.isConnected = db.connections[0].readyState

       console.log("DB Connected Successfully");
       
    } catch (error) {
        console.log("Database connection failed", error);

        process.exit(1)
        
    }

}

export default dbConnect;