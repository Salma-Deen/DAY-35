import express from "express";
import mongoose from "mongoose";
//import schema for mentor
import { Mentor } from "../schema/mentor.js";
import { Student } from "../schema/student.js";
import { v4 } from "uuid";
const mentorRouter = express.Router();
//get all mentor
mentorRouter.get("/", async (req, res) => {
    const mentor = await Mentor.find({});
    res.json(mentor);
});
//create a new mentor
mentorRouter.post("/", async (req, res) => {
    const mentorDetail = req.body;
    const mentorObj = new Mentor({
        ...mentorDetail,
        id: v4()
    });
    try {
        await mentorObj.save();
        res.json({ msg: "Mentor created successfully" })
    }
    catch (e) {
        console.log("Error in creating mentor", e);
        if (e instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ msg: "Please check the fields for mentor creation" });
        } else {
            res.status(500).json({ msg: "Internal server Error" });
        }
    }
})
//API to show all students for a paricular mentor

mentorRouter.get("/:id/students", async (req, res) => {
    const mentorId = req.params.id; // Extract mentor ID from URL

    try {
        // Check if the mentor exists
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ msg: "Mentor not found" });
        }

        // Find all students assigned to this mentor
        const students = await Student.find({ mentor: mentorId });

        res.json({
            mentor: {
                id: mentor._id,
                name: mentor.name,
                email: mentor.email
            },
            students
        });
    } catch (error) {
        console.error("Error fetching students for mentor:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});



export default mentorRouter;
