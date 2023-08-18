import mongoose from 'mongoose'

const ConnectToMongoDB = async (Url) => {
    try {
        await mongoose.connect(Url).then(() => {
            // console.log(`Connected to Database Successfully...!`)
        })
    } catch (error) {
        console.log(`Server is Down, Can't Connect to MongoDB......!`, error);
    }
}

export default ConnectToMongoDB