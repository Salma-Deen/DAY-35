import express from "express";
import mongoose from "mongoose";
//import schema for mentor
import { Student } from "../schema/student.js";
import { Mentor } from "../schema/mentor.js";
import { v4 } from "uuid";
const studentRouter = express.Router();
//get all students
studentRouter.get("/", async (req, res) => {
    const student = await Student.find({});
    res.json(student);
});
//create a new student
studentRouter.post("/", async (req, res) => {
    const studentDetail = req.body;
    const studentObj = new Student({
        ...studentDetail,
        id: v4()
    });
    try {
        await studentObj.save();
        res.json({ msg: "student created successfully" })
    } 
    catch (e) {
        console.log("Error in creating a student", e);
        if (e instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ msg: "Please check the fields for student creation" });
        }else {
                res.status(500).json({ msg: "Internal server Error" });
            }
        }
    
})
//API to assign or change mentor for a particular student

studentRouter.patch("/:id/assign-mentor", async (req, res) => {
    const studentId = req.params.id; // Student ID from the URL
    const { mentorId } = req.body;  // Mentor ID from the request body

    if (!mentorId) {
        return res.status(400).json({ msg: "Mentor ID is required" });
    }

    try {
        // Find the mentor
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ msg: "Mentor not found" });
        }

        // Find the student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }

        // Update the student's mentor
        student.mentor = mentorId;
        await student.save();

        // Add the student to the mentor's students list (avoid duplicates)
        if (!mentor.students.includes(studentId)) {
            mentor.students.push(studentId);
            await mentor.save();
        }

        res.json({ 
            msg: "Mentor assigned successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                mentor: student.mentor
            }
        });
    } catch (e) {
        console.error("Error assigning mentor:", e);
        res.status(500).json({ msg: "Internal server error" });
    }
});


// API to assign multiple students to a mentor
studentRouter.post("/assign-students/:mentorId", async (req, res) => {
    const mentorId = req.params.mentorId; // Get mentor ID from the URL
    const studentIds = req.body.studentIds;  // List of student IDs to be assigned

    if (!studentIds || studentIds.length === 0) {
        return res.status(400).json({ msg: "Please provide student IDs" });
    }

    try {
        // Find the mentor by mentorId
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ msg: "Mentor not found" });
        }

        // Find students who don't already have a mentor
        const studentsWithoutMentor = await Student.find({ 
            _id: { $in: studentIds },
            mentor: null  // Only select students without a mentor
        });

        // If any of the students already have a mentor
        if (studentsWithoutMentor.length !== studentIds.length) {
            return res.status(400).json({ msg: "Some students already have a mentor" });
        }

        // Assign mentor to students
        for (let student of studentsWithoutMentor) {
            student.mentor = mentorId; // Assign the mentor
            await student.save(); // Save student
        }

        // Add students to the mentor's list
        mentor.students.push(...studentsWithoutMentor.map(student => student._id));
        await mentor.save(); // Save mentor

        res.json({
            msg: "Students successfully assigned to mentor",
            mentor: {
                id: mentor._id,
                name: mentor.name,
                email: mentor.email
            },
            students: studentsWithoutMentor
        });
    } catch (error) {
        console.error("Error assigning students:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// API to get students who don't have a mentor
studentRouter.get("/available-students", async (req, res) => {
    try {
        const studentsWithoutMentor = await Student.find({ mentor: [] });  // Find students without a mentor
        res.json({
            msg: "Available students",
            students: studentsWithoutMentor
        });
    } catch (error) {
        console.error("Error fetching available students:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});



export default studentRouter;
