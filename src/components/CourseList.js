  import React, { useState, useEffect } from 'react';
  import { hasConflict, addScheduleTimes, timeParts} from '../utilities/times.js';
  import { setData, signInWithGoogle, signOut, useUserState} from '../utilities/firebase.js';
  import Course from './Course.js';
  
  const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};
  const days = ['M', 'Tu', 'W', 'Th', 'F'];

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

  const getCourseTerm = course => (
    terms[course.id.charAt(0)]
  );
  
  const getCourseNumber = course => (
    course.id.slice(1, 4)
  );


 

  // implement a radio button
  const TermButton = ({term,setTerm,checked}) => (
    <>
      <input type="radio" id={term} className="btn-check" autoComplete="off" checked={checked} onChange={() => setTerm(term)}/>
      <label class="btn btn-success m-1 p-2" htmlFor={term}>
      { term }
      </label>
    </>
  );
  

  const SignInButton = () => (
    <button className="btn btn-secondary btn-sm"
        onClick={() => signInWithGoogle()}>
      Sign In
    </button>
  );

  const SignOutButton = () => (
    <button className="btn btn-secondary btn-sm"
        onClick={() => signOut()}>
      Sign Out
    </button>
  );

  // btn-group can be used to make a row of bottons
  const TermSelector = ({term, setTerm}) => {
    const [user] = useUserState();
    return (
    <div className="btn-toolbar justify-content-between">
      <div className="btn-group">
      { 
        Object.values(terms).map(
          value => <TermButton key={value} term={value} setTerm={setTerm} checked={value === term} />
        )
      }
      </div>
      { user ? <SignOutButton /> : <SignInButton /> }
    </div>
    );
  }
    
  export default CourseList;