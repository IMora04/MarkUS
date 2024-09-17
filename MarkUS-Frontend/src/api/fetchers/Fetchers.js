import { showMessage } from "react-native-flash-message";
import { useContext } from "react";
import { StudiesContext } from "../../context/StudiesContext";
import * as CourseEndpoints from "../CourseEndpoints";
import * as StudiesEndpoints from "../StudiesEndpoints";
import * as GlobalStyles from "../../styles/GlobalStyles";

export default function Fetchers() {
  const { setCurrentCourse, setLoading, setCurrentStudies } =
    useContext(StudiesContext);

  async function fetchCourse(id) {
    try {
      const fetchedCourse = await CourseEndpoints.getDetail(id);
      setCurrentCourse(fetchedCourse);
      setLoading(false);
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving this course. ${error} `,
        type: "error",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
    }
  }

  async function fetchOneStudies(id) {
    try {
      setLoading(true);
      const fetchedStudies = await StudiesEndpoints.getDetail(id);
      setCurrentStudies(fetchedStudies);
      setLoading(false);
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving studies. ${error} `,
        type: "error",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
    }
  }

  return {
    fetchCourse,
    fetchOneStudies,
  };
}
