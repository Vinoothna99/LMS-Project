import React, { Component } from "react";
import { Card, CardContent, Typography, Button, Rating } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';


function StudentWrapper() {
  const navigate = useNavigate();
  const location = useLocation();  // Import useLocation from 'react-router-dom'

  return <Student navigate={navigate} state={location.state} />;
}

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      loading: true,
      ratings: {} // Store ratings for each course
    };
  }

  componentDidMount() {
    this.fetchCourses();
  }

  fetchCourses = async () => {
    const { username } = this.props.state; 
    try {
        const response = await fetch(`api/courses/?username=${username}`);
        if (response.status === 200) {
            const data = await response.json();
            this.setState({ 
                courses: data.courses, 
                loading: false,
                ratings: data.courses.reduce((acc, course) => ({
                    ...acc,
                    [course.id]: course.average_rating
                }), {})
            });
        } else {
            console.error('Failed to fetch courses');
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
};

handleNavigate = (path, state) => {
  this.props.navigate(path, state);
};

  joinCourse = async (courseId) => {
    const { username } = this.props.state; // Or however you get the username
    try {
        const response = await fetch('api/joincourse/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ course_id: courseId, username })
        });
        if (response.ok) {
            this.fetchCourses(); // Refresh the course list after joining
        }
    } catch (error) {
        console.error('Error joining course:', error);
    }
};

handleRatingChange = (courseId, newValue) => {
    this.setState(prevState => ({
        ratings: { ...prevState.ratings, [courseId]: newValue }
    }));
};

submitRating = async (courseId) => {
  const { username } = this.props.state; // Or however you get the username
  const rating = this.state.ratings[courseId];
  try {
      const response = await fetch('api/rate/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ course_id: courseId, username, rating })
      });
      if (response.ok) {
        this.fetchCourses();
      }
  } catch (error) {
      console.error('Error submitting rating:', error);
  }
};


  render() {
    const { username } = this.props.state;
    const { courses, loading, ratings } = this.state;
    return (
      <div>
                <Typography variant="h4" component="h1">
                    All Courses
                </Typography>
                {loading ? (
                    <p>Loading courses...</p>
                ) : (
                    courses.map(course => (
                        <Card key={course.id} style={{ margin: '20px 0' }}>
                            <CardContent>
                                <Typography variant="h5" component="h2" style={{ cursor: 'pointer' }} 
                                    onClick={() => this.handleNavigate('/course', { state: { username, courseId: course.id, courseTitle: course.title } })}>
                                    {course.title}
                                </Typography>
                                <Typography variant="body1">{course.category}</Typography>
                                <Typography variant="body1">Credits: {course.credits}</Typography>
                                <Typography variant="body1">Average Rating: {course.average_rating}</Typography>
                                <Typography variant="body1">Students: {course.no_of_students_enrolled}</Typography>
                                <Typography variant="body1">Comments: {course.no_of_comments}
                                <Button onClick={() => this.handleNavigate('/comments', {state:{ username, courseId: course.id, courseTitle: course.title }})}>
                                    View
                                </Button>
                                </Typography>
                                <Typography>
                                  <Rating
                                      value={ratings[course.id]}
                                      onChange={(event, newValue) => this.handleRatingChange(course.id, newValue)}
                                  />
                                  <Button 
                                      onClick={() => this.submitRating(course.id)} 
                                      disabled={!ratings[course.id] || ratings[course.id] <= 0}>
                                      Rate
                                  </Button>

                                </Typography>
                                <Typography>
                                  {course.enrollment_status === "Enrolled" ? (
                                      <Button>Already Enrolled</Button>
                                  ) : (
                                      <Button onClick={() => this.joinCourse(course.id)}>Join Course</Button>
                                  )}

                                </Typography>
                                <Typography variant="body1">
                                <Button onClick={() => this.handleNavigate('/quiz', {state:{ username, courseId: course.id, courseTitle: course.title }})}>
                                    Quiz
                                </Button>
                                </Typography>
                                 
                                
                                
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
    );
  }
}

export default StudentWrapper;
