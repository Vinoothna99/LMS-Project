import React, { Component } from "react";
import {render} from "react-dom";
import LoginRegister from "./LoginRegister";
import Comments from "./Comments";
import Course from "./Course";
import CoursesTaken from "./CoursesTaken";
import CoursesTeaching from "./CoursesTeaching";
import CreateCourse from "./CreateCourse";
import Instructor from "./Instructor";
import Quiz from "./Quiz";
import Student from "./Student";
import Courses from "./Courses";
import Grades from "./Grades";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Redirect,
} from "react-router-dom";


export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
    <Router>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/loginregister" element={<LoginRegister />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/coursesteaching" element={<CoursesTeaching />} />
          <Route path="/coursestaken" element={<CoursesTaken />} />
          <Route path="/course" element={<Course />} />
          <Route path="/createcourse" element={<CreateCourse />} />
          <Route path="/student" element={<Student />} />
          <Route path="/instructor" element={<Instructor />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/grade" element={<Grades />} />


        </Routes>

    </Router>
    );

  }
}
