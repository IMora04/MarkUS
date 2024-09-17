import React, { useState, createContext } from "react";

const StudiesContext = createContext();

const StudiesContextProvider = (props) => {
  const [currentStudies, setCurrentStudies] = useState({});
  const [currentCourse, setCurrentCourse] = useState({});
  const [currentSubject, setCurrentSubject] = useState({});
  const [loading, setLoading] = useState(false);

  const computeSubjectAvg = (subject) => {
    return subject.evaluables
      .map((e) => (e.mark * e.weight) / 100)
      .reduce((acc, cv) => acc + cv, 0);
  };

  const computeTopSubjects = (subjects) => {
    return subjects
      ?.sort(function (a, b) {
        return computeSubjectAvg(a) - computeSubjectAvg(b);
      })
      .slice(-5)
      .map((s) => {
        return {
          label: s.shortName,
          value: computeSubjectAvg(s),
          credits: s.credits,
        };
      });
  };

  const courseTopSubjects = computeTopSubjects(currentCourse.subjects);

  const studiesTopSubjects = computeTopSubjects(
    currentStudies.courses?.flatMap((c) => c.subjects),
  );

  return (
    <StudiesContext.Provider
      value={{
        currentStudies,
        setCurrentStudies,
        currentCourse,
        setCurrentCourse,
        currentSubject,
        setCurrentSubject,
        courseTopSubjects,
        studiesTopSubjects,
        loading,
        setLoading,
      }}
    >
      {props.children}
    </StudiesContext.Provider>
  );
};
export { StudiesContext };
export default StudiesContextProvider;
