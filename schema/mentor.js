import { model, Schema } from "mongoose";

const mentorSchema = new Schema({
    name: {
        type: String, // Corrected from "string" to String
        required: true
    },
    email: {
        type: String, // Corrected from "string" to String
        required: true
    },
    students: {
        type: Array,
        default: []
    },
    
});

// Export the model with a distinct name
export const Mentor = model("Mentor", mentorSchema, "mentors");
