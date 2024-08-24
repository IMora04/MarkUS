import React, { useState, createContext } from "react";

const StudiesContext = createContext();

const StudiesContextProvider = (props) => {
  const [currentStudies, setCurrentStudies] = useState({});
  const [currentCourse, setCurrentCourse] = useState({});
  const [currentSubject, setCurrentSubject] = useState({});

  return (
    <StudiesContext.Provider
      value={{
        currentStudies,
        setCurrentStudies,
        currentCourse,
        setCurrentCourse,
        currentSubject,
        setCurrentSubject,
      }}
    >
      {props.children}
    </StudiesContext.Provider>
  );
};
export { StudiesContext };
export default StudiesContextProvider;
