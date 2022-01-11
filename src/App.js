import React, { useState, useEffect } from 'react';
import './App.css';
import { hasConflict, addScheduleTimes } from './utilities/times.js';
import CourseList from './components/CourseList';
import { useData } from './utilities/firebase.js';


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

const days = ['M', 'Tu', 'W', 'Th', 'F'];

// const App = () => {
//   const [schedule, loading, error] = useData('/', addScheduleTimes); 
  
//   if (error) return <h1>{error}</h1>;
//   if (loading) return <h1>Loading the schedule...</h1>

//   return (
//     <div className="container">
//       <Banner title={ schedule.title } />
//       <CourseList courses={ schedule.courses } />
//     </div>
//   );
// };



// <Banner title={ schedule.title } /> 
// collects the attributes into a props objects, and passes that object to the function
// so React calls function Banner with object {"title": "CS Courses..."}
const App = () =>  {

  // we used array destructuring to assign the array value to schedule, setSchedule
  // if useState() no initial value, state variable begin as undefined
  // use !schedule to check for that before we load the schedule for the first time
  const [schedule, setSchedule] = useState();
  const url = 'https://courses.cs.northwestern.edu/394/data/cs-courses.php';

  // get the schedule JSON data and store it using the setSchedule() function
  // useEffect: run function only on updates where specific state variables have changed
  // pass an array of those variables as the second argument
  // React runs the function only when the component is first added
  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await fetch(url);
      if (!response.ok) throw response;
      const json = await response.json();
      setSchedule(addScheduleTimes(json));
    }
    fetchSchedule();
  }, []);


  if (!schedule) return <h1>Loading schedule...</h1>;

  return (
    <div className="container">
      <Banner title={ schedule.title } /> 
      <CourseList courses={ schedule.courses } />
    </div>
  );
};

export default App;