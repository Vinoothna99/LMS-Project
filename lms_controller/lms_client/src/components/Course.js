import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Card, CardContent } from '@mui/material';

function Course() {
    const location = useLocation();
    const { courseTitle } = location.state;
    const [modulesData, setModulesData] = useState([]);

    useEffect(() => {
        async function fetchModules() {
            const response = await fetch(`api/modules/?title=${courseTitle}`);
            if (response.ok) {
                const data = await response.json();
                const modulesAndLessons = data['course modules and lessons'];

                // Group lessons by module
                const modules = modulesAndLessons.reduce((acc, item) => {
                    acc[item.module_number] = acc[item.module_number] || {
                        module_number: item.module_number,
                        module_name: item.module_name,
                        lessons: []
                    };
                    acc[item.module_number].lessons.push({
                        lesson_number: item.lesson_number,
                        lesson_name: item.lesson_name,
                        lesson_url: item.lesson_url
                    });
                    return acc;
                }, {});

                // Convert the modules object back to an array
                setModulesData(Object.values(modules));
            } else {
                console.error('Failed to fetch modules');
            }
        }

        fetchModules();
    }, [courseTitle]);

    return (
        <div>
            <Typography variant="h4" component="h1">{courseTitle}</Typography>
            {modulesData.map((module) => (
                <Card key={module.module_number} sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h5" component="h2">{module.module_name}</Typography>
                        {module.lessons.map((lesson, index) => (
                            <div key={index}>
                                <Typography>Lesson {lesson.lesson_number}: {lesson.lesson_name}</Typography>
                                <a href={lesson.lesson_url} target="_blank" rel="noopener noreferrer">{lesson.lesson_url}</a>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default Course;
