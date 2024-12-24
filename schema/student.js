import { model, Schema } from "mongoose";

const studentSchema = new Schema({
    name: {
        type: String, // Corrected from "string" to String
        required: true
    },
    email: {
        type: String, // Corrected from "string" to String
        required: true
    },
    mentor: {
        type: Array, // Corrected from "string" to String
        default:[]
    }
});

// Export the model with a distinct name
export const Student = model("Student", studentSchema, "students");
