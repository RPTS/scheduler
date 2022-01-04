import React, { useState, useEffect } from 'react';
import './App.css';


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


// select a course: new list of selected courses that includes the course
// unselect a course: create a new list of selected courses that omits the course
const toggle = (x, lst) => (
  lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
);

// make a bootstrap card
const Course = ({ course, selected, setSelected }) => {
  const isSelected = selected.includes(course);
  const isDisabled = !isSelected && hasConflict(course, selected);
  const style = {
    backgroundColor: isDisabled? 'lightgrey' : isSelected ? 'lightgreen' : 'white'
  };
  return (
    <div className="card m-1 p-2" 
      style={style}
      onClick={isDisabled ? null : () =>  setSelected(toggle(course, selected))}>
      <div className="card-body">
        <div className="card-title">{ getCourseTerm(course) } CS { getCourseNumber(course) }</div>
        <div className="card-text">{ course.title }</div>
      </div>
    </div>
  );
};

const hasConflict = (course, selected) => (
  selected.some(selection => courseConflict(course, selection))
);

// parse meeting strings for each course into structured form
// to check if courses are in the same term and overlap
const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};


// add new fields to each course when the courses are first fetched
const mapValues = (fn, obj) => (
  // use Object.fromEntries to create a new object from an old one
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value)]))
);

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: mapValues(addCourseTimes, schedule.courses)
});


// define conlict
// if course conflict, disable the unselected course
const days = ['M', 'Tu', 'W', 'Th', 'F'];

const daysOverlap = (days1, days2) => ( 
  days.some(day => days1.includes(day) && days2.includes(day))
);

const hoursOverlap = (hours1, hours2) => (
  Math.max(hours1.start, hours2.start) < Math.min(hours1.end, hours2.end)
);

const timeConflict = (course1, course2) => (
  daysOverlap(course1.days, course2.days) && hoursOverlap(course1.hours, course2.hours)
);

const courseConflict = (course1, course2) => (
  getCourseTerm(course1) === getCourseTerm(course2)
  && timeConflict(course1, course2)
);


// Courselist
const CourseList = ({ courses }) => {
  // filter by term
  const [term, setTerm] = useState('Fall');
  // select course and filter by time conflicts
  const [selected, setSelected] = useState([]);

  const termCourses = Object.values(courses).filter(course => term === getCourseTerm(course));
  return (
    <>
      <TermSelector term={term} setTerm={setTerm}/>
      <div className="course-list">
        { termCourses.map(course =>
          <Course key={ course.id } course={ course }
            selected={selected} setSelected={ setSelected } 
          />)  
         }
      </div>
    </>
  );
};

// implement a radio button
const TermButton = ({term,setTerm,checked}) => (
  <>
    <input type="radio" id={term} className="btn-check" autoComplete="off" checked={checked} onChange={() => setTerm(term)}/>
    <label class="btn btn-success m-1 p-2" htmlFor={term}>
    { term }
    </label>
  </>
);

// btn-group can be used to make a row of bottons
const TermSelector = ({term,setTerm}) => (
  <div className="btn-group">
  { 
    Object.values(terms).map(value => (
      <TermButton key={value} term={value} setTerm={setTerm} checked={value === term} />
    ))
  }
  </div>
);



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