import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

function Grades() {
    const [grades, setGrades] = useState([]);
    const location = useLocation();
    const { username } = location.state;

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await fetch(`api/grades/?username=${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setGrades(data['course comments']);
                } else {
                    console.error('Failed to fetch grades');
                }
            } catch (error) {
                console.error('Error fetching grades:', error);
            }
        };

        fetchGrades();
    }, [username]);

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <Typography variant="h4" align="center" gutterBottom>
                My Grades
            </Typography>
            <List component={Paper}>
                {grades.map((grade, index) => (
                    <ListItem key={index} divider>
                        <ListItemText 
                            primary={grade.course_title} 
                            secondary={`Highest Grade: ${grade.highest_grade}`} 
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default Grades;
