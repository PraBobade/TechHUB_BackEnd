import mongoose from 'mongoose'

const ConnectToMongoDB = async () => {
    const UserName = `bobadepradip18`;
    // const Password = `urMnpR60AfzfuZmp`; 
    const Password = 'Boba1808'
    const DataBase = `TechHUB`;
    const MongoDBAtlasURL = `mongodb+srv://bobadepradip18:H6IxhtekmpXQW62Y@cluster0.s2qirqb.mongodb.net/${DataBase}?retryWrites=true&w=majority`
    try {
        await mongoose.connect(MongoDBAtlasURL).then(() => {
            console.log("Connected to Database Successfully......!");
        })
    }
    catch (err) {
        console.log("Server is Down, Can't Connect To MongoDB.....!!!!");
        console.log(err);
    }
}

export default ConnectToMongoDB