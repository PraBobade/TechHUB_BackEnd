import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        trim: true,
    },
    address: {
        complete_address: {
            type: String,
            required: true,
            default: "N/A",
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true,
            default: "N/A"
        },
        state: {
            type: String,
            required: true,
            trim: true,
            default: "N/A"
        },
        country: {
            type: String,
            required: true,
            trim: true,
            default: "India"
        },
        pin: {
            type: String,
            required: true,
            trim: true,
            minlength: [6, "Pin must have exactly 6 characters."],
            maxlength: [6, "Pin must have exactly 6 characters."],
            default: "000000",
        }
    },
    phone: {
        type: String,
        require: true,
        default: "+910000000000",
        minlength: 13,
        maxlength: 13
    },
    role: {
        type: String,
        default: "User"
    },
    date: {
        type: String,
        default: function UpdateTime() {
            let CurrentDate = new Date();
            const day = CurrentDate.getDate().toString();
            const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(CurrentDate);
            const year = CurrentDate.getFullYear().toString();
            const hours = CurrentDate.getHours() % 12 === 0 ? 12 : CurrentDate.getHours() % 12;
            const amOrPm = CurrentDate.getHours() < 12 ? 'AM' : 'PM';
            const minutes = CurrentDate.getMinutes().toString().padStart(2, '0');
            return `${day}-${month}-${year} at ${hours}:${minutes} ${amOrPm}`;
        }
    }
});

const UserModel = mongoose.model("User", UserSchema)

export default UserModel;