import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField, Typography } from '@mui/material';

function CreateCourse() {
    const [course, setCourse] = useState({
        title: '',
        category: '',
        credits: '',
        user_id: '',
        modules: []
    });

    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state?.username; // Or retrieve username from your state management

    const addModule = () => {
        setCourse({
            ...course,
            modules: [
                ...course.modules,
                { module_number: course.modules.length + 1, module_name: '', lessons: [] }
            ]
        });
    };

    const addLesson = (moduleIndex) => {
        const updatedModules = [...course.modules];
        updatedModules[moduleIndex].lessons.push({
            lesson_number: updatedModules[moduleIndex].lessons.length + 1,
            lesson_name: '',
            lesson_url: ''
        });
        setCourse({ ...course, modules: updatedModules });
    };

    const handleChange = (e, moduleIndex, lessonIndex, field) => {
        if (moduleIndex === undefined) {
            setCourse({ ...course, [field]: e.target.value });
        } else {
            const updatedModules = [...course.modules];
            if (lessonIndex === undefined) {
                updatedModules[moduleIndex][field] = e.target.value;
            } else {
                updatedModules[moduleIndex].lessons[lessonIndex][field] = e.target.value;
            }
            setCourse({ ...course, modules: updatedModules });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const courseData = { ...course, user_id: username }; // Include username in the payload
        try {
            const response = await fetch('/api/createcourse/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData)
            });
            if (response.ok) {
                navigate(-1); // Navigate back to the previous page
            }
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    return (
        <div>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>Create a Course</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Title"
                    value={course.title}
                    onChange={(e) => handleChange(e, undefined, undefined, 'title')}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    label="Category"
                    value={course.category}
                    onChange={(e) => handleChange(e, undefined, undefined, 'category')}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    label="Credits"
                    type="number"
                    value={course.credits}
                    onChange={(e) => handleChange(e, undefined, undefined, 'credits')}
                    sx={{ marginBottom: 2 }}
                />
                {course.modules.map((module, moduleIndex) => (
                    <div key={module.module_number}>
                        <TextField
                            label={`Module ${module.module_number} Name`}
                            value={module.module_name}
                            onChange={(e) => handleChange(e, moduleIndex, undefined, 'module_name')}
                            sx={{ marginBottom: 2 }}
                        />
                        {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.lesson_number}>
                                <TextField
                                    label={`Lesson ${lesson.lesson_number} Name`}
                                    value={lesson.lesson_name}
                                    onChange={(e) => handleChange(e, moduleIndex, lessonIndex, 'lesson_name')}
                                    sx={{ marginBottom: 1 }}
                                />
                                <TextField
                                    label={`Lesson ${lesson.lesson_number} URL`}
                                    value={lesson.lesson_url}
                                    onChange={(e) => handleChange(e, moduleIndex, lessonIndex, 'lesson_url')}
                                    sx={{ marginBottom: 2 }}
                                />
                            </div>
                        ))}
                        <Button onClick={() => addLesson(moduleIndex)} sx={{ marginBottom: 2 }}>Add Lesson</Button>
                    </div>
                ))}
                <Button onClick={addModule} sx={{ marginBottom: 2 }}>Add Module</Button>
                <Button type="submit" variant="contained">Submit</Button>
            </form>
        </div>
    );
}

export default CreateCourse;
