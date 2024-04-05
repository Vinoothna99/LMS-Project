import React, { Component } from "react";
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';


function InstructorWrapper() {
  const navigate = useNavigate();
  const location = useLocation();  // Import useLocation from 'react-router-dom'

  return <Instructor navigate={navigate} state={location.state} />;
}
class Instructor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      loading: true,
    };

  }
  componentDidMount() {
    this.fetchCourses();
  }

  fetchCourses = async () => {
    const { username } = this.props.state;
    try {
      const response = await fetch(`api/teaching?username=${username}`);
      if (response.status === 200) {
        const data = await response.json();
        if (data && Array.isArray(data.courses)) { // Ensure data has a courses array
            this.setState({ courses: data.courses, loading: false });
        } else {
            console.error('Unexpected data format:', data);
        }
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

  deleteCourse = async (title) => {
    if (window.confirm('Do you want to delete this course? You will lose all courses, modules, lessons, and comments associated with it.')) {
        try {
            const response = await fetch(`/api/deletecourse/?title=${title}`, { method: 'DELETE' });
            if (response.ok) {
              this.setState(prevState => ({
                courses: prevState.courses.filter(course => course.title !== title)
              })); // Refresh the list after deletion 
            } else {
                console.error('Failed to delete course');
            }
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    }
};


  render() {

    const { courses, loading } = this.state;
    const { username } = this.props.state;
    return (
      <div>
            <Typography variant="h4" component="h1">
                Courses Taught By Me
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => this.handleNavigate('/createcourse', { state: { username: username } })}
            >
                Create Course
            </Button>
            {loading ? (
                <p>No Courses</p>
            ) : (
                courses.map((course) => (
                    <Card key={course.id} style={{ margin: '20px 0' }}>
                        <CardContent>
                            <Typography variant="h5" component="h2"
                                style={{ cursor: 'pointer' }} 
                                onClick={() => this.handleNavigate('/course', {state:{ username, courseId: course.id, courseTitle: course.title }})}>
                                {course.title}
                            </Typography>
                            <Typography variant="body1">
                                Comments: {course.no_of_comments}
                                <Button onClick={() => this.handleNavigate('/comments', {state:{ username, courseId: course.id, courseTitle: course.title }})}>
                                    View
                                </Button>
                            </Typography>
                            <Typography variant="body1">
                                Students: {course.no_of_students_enrolled}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => this.deleteCourse(course.title)}>
                                Delete Course
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
  }
}
export default InstructorWrapper;