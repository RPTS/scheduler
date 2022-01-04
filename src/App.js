import React from 'react';

const schedule = {
  "title": "CS Courses for 2018-2019",
  "courses": {
    "F101" : {
      "id" : "F101",
      "meets" : "MWF 11:00-11:50",
      "title" : "Computer Science: Concepts, Philosophy, and Connections"
    },
    "F110" : {
      "id" : "F110",
      "meets" : "MWF 10:00-10:50",
      "title" : "Intro Programming for non-majors"
    },
    "S313" : {
      "id" : "S313",
      "meets" : "TuTh 15:30-16:50",
      "title" : "Tangible Interaction Design and Learning"
    },
    "S314" : {
      "id" : "S314",
      "meets" : "TuTh 9:30-10:50",
      "title" : "Tech & Human Interaction"
    }
  }
};

// Banner = a = > a+100 is for named function "Banner" that takes in a parameter a
// JavaScript lets you use destructuring syntax to get values from an object
// destructuring example: ({ a, b } = { a: 10, b: 20 }) => a + b; // result is 30
// so instead of 
// const Banner = props => ( <h1> {props.title} </h1>)
// we get the following 
const Banner = ({ title }) => ( 
  <h1>{ title }</h1>
);

const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};

const getCourseTerm = course => (
  terms[course.id.charAt(0)]
);

const getCourseNumber = course => (
  course.id.slice(1, 4)
);

const Course = ({ course }) => (
  <div>
    { getCourseTerm(course) } CS { getCourseNumber(course) }: { course.title }
  </div>
);

const CourseList = ({ courses }) => (
  <div>
    { Object.values(courses).map(course => <Course key={course.id} course={ course } />) }
  </div>
);


// <Banner title={ schedule.title } /> 
// collects the attributes into a props objects, and passes that object to the function
// so React calls function Banner with object {"title": "CS Courses..."}
const App = () =>  (
  <div>
    <Banner title={ schedule.title } /> 
    <CourseList courses={ schedule.courses } />
  </div>
);

export default App;