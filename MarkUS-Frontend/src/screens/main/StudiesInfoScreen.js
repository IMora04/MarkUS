import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { AuthorizationContext } from "../../context/AuthorizationContext";
import { getAll, getDetail } from "../../api/StudiesEndpoints";
import { create, update } from "../../api/CourseEndpoints";
import { showMessage } from "react-native-flash-message";
import * as GlobalStyles from "../../styles/GlobalStyles";
import { useIsFocused } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { ProgressCircle } from "react-native-svg-charts";
import CreateModal from "../../components/modals/CreateModal";
import { Formik } from "formik";
import InputItem from "../../components/InputItem";
import * as yup from "yup";
import AddButton from "../../components/buttons/AddButton";
import TopSubjects from "../../components/TopSubjects";
import RNPickerSelect from "react-native-picker-select";
import CancelButton from "../../components/buttons/CancelButton";
import { StudiesContext } from "../../context/StudiesContext";
import EditClickable from "../../components/EditClickable";
import CreateEditButton from "../../components/buttons/CreateEditButton";

export default function StudiesInfoScreen({ navigation, route }) {
  const { loggedInUser } = useContext(AuthorizationContext);
  const { currentStudies, setCurrentStudies, studiesTopSubjects } =
    useContext(StudiesContext);
  const [studiesNames, setStudiesNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendErrors, setBackendErrors] = useState();
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(route.params.id);
  const [editingCourse, setEditingCourse] = useState(null);

  const editing = editingCourse !== null;

  const availableCredits = editing
    ? currentStudies.credits -
      currentStudies.courses
        ?.map((c) => c.credits)
        .reduce((acc, cv) => acc + cv, 0) +
      editingCourse.credits
    : currentStudies.credits -
      currentStudies.courses
        ?.map((c) => c.credits)
        .reduce((acc, cv) => acc + cv, 0);

  const [initialValues, setInitialValues] = useState({
    credits: null,
    number: null,
  });
  const validationSchema = yup.object().shape({
    number: yup
      .number()
      .typeError("The course year must be a number")
      .positive("The course year must be positive")
      .integer("The course year must be integer")
      .max(
        currentStudies.years,
        "The course year must be between 1 and " + currentStudies.years,
      )
      .required("The course year is required"),
    credits: yup
      .number()
      .typeError("The number of credits must be a number")
      .positive("The number of credits must be positive")
      .integer("The number of credits must be integer")
      .max(
        availableCredits,
        "The number of credits must be between 1 and " + availableCredits,
      )
      .required("The number of credits is required"),
  });

  const isFocused = useIsFocused();

  const courseMapper = {
    1: "First",
    2: "Second",
    3: "Third",
    4: "Fourth",
    5: "Fifth",
    6: "Sixth",
    7: "Seventh",
  };

  const windowDimensions = Dimensions.get("window");
  const screenDimensions = Dimensions.get("screen");

  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setDimensions({ window, screen });
      },
    );
    return () => subscription?.remove();
  });

  useEffect(() => {
    if (Platform.OS === "ios") {
      fetchOneStudies(route.params.id);
    }
  }, [route]);

  useEffect(() => {
    setBackendErrors([]);
    if (!showModal) {
      setInitialValues({
        credits: null,
        number: null,
      });
      setTimeout(() => {
        setEditingCourse(null);
      }, 200);
    }
  }, [showModal]);

  async function fetchOneStudies(id) {
    try {
      setLoading(true);
      const fetchedStudies = await getDetail(id);
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

  useEffect(() => {
    async function fetchStudies() {
      if (!isFocused) {
        return;
      }
      if (!loggedInUser) {
        setStudiesNames([]);
        navigation.navigate("My studies");
        return;
      }
      try {
        const fetchedStudies = await getAll();
        const fetchedStudiesReshaped = fetchedStudies.map((e) => {
          return {
            label: e.name,
            value: e.id.toString(),
          };
        });
        setStudiesNames(fetchedStudiesReshaped);
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving studies. ${error} `,
          type: "error",
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle,
        });
      }
    }
    setLoading(true);
    fetchStudies();
    setLoading(false);
  }, [isFocused, loggedInUser]);

  let stats =
    Object.keys(currentStudies).length !== 0
      ? {
          completion:
            currentStudies.courses.filter((c) => c.status === "taken").length /
            currentStudies.years,
          subjects: currentStudies.courses.flatMap((c) => c.subjects),
          takenSubjects: currentStudies.courses
            .filter((c) => c.status === "taken")
            .flatMap((c) => c.subjects),
        }
      : {};

  stats = {
    ...stats,
    provisionalAvg: (
      stats.subjects?.reduce((acc, cv) => acc + cv.credits * cv.avgMark, 0) /
        stats.subjects?.reduce((acc, cv) => acc + cv.credits, 0) || 0
    ).toFixed(2),
    officialAvg: (
      stats.subjects?.reduce(
        (acc, cv) => acc + cv.credits * cv.officialMark,
        0,
      ) / stats.subjects?.reduce((acc, cv) => acc + cv.credits, 0) || 0
    ).toFixed(2),
    provisionalTakenAvg: (
      stats.takenSubjects?.reduce(
        (acc, cv) => acc + cv.credits * cv.avgMark,
        0,
      ) / stats.takenSubjects?.reduce((acc, cv) => acc + cv.credits, 0) || 0
    ).toFixed(2),
    officialTakenAvg: (
      stats.takenSubjects?.reduce(
        (acc, cv) => acc + cv.credits * cv.officialMark,
        0,
      ) / stats.takenSubjects?.reduce((acc, cv) => acc + cv.credits, 0) || 0
    ).toFixed(2),
  };

  const renderCourse = ({ item }) => {
    return (
      <View style={styles.coursesCard}>
        <Pressable
          style={{ margin: 10 }}
          onPress={() => {
            navigation.navigate("Course info", { id: item.id });
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ flex: 1 }}>{courseMapper[item.number]} course</Text>
            <Pressable
              onPress={() => {
                setInitialValues({
                  credits: item.credits,
                  number: item.number,
                });
                setShowModal(true);
                setEditingCourse(item);
              }}
            >
              <EditClickable hideText={true} />
            </Pressable>
          </View>
        </Pressable>
      </View>
    );
  };

  const renderEmptyCourses = () => {
    return (
      <>
        <View style={[styles.coursesCard, { alignItems: "center" }]}>
          <View style={{ margin: 10 }}>
            <Text style={{ textAlign: "center" }}>
              No courses found ({currentStudies.years} expected). Do you want to
              add a new course to {currentStudies.name}?
            </Text>
          </View>
        </View>
        <View
          style={{ marginTop: 10, alignSelf: "center", alignItems: "center" }}
        >
          <AddButton name="course" onCreate={() => setShowModal(true)} />
        </View>
      </>
    );
  };

  const renderStudiesSelector = () => {
    return (
      <View>
        <RNPickerSelect
          onValueChange={(value) => {
            setSelected(value);
            if (Platform.OS !== "ios" && currentStudies.id !== value) {
              setLoading(true);
              fetchOneStudies(value);
            }
          }}
          onClose={() => {
            fetchOneStudies(selected);
          }}
          items={studiesNames}
          placeholder={{}}
          value={selected}
          style={pickerSelectStyles}
        />
      </View>
    );
  };

  const renderDashboard = () => {
    return (
      <View
        style={{
          flexDirection: "column",
          marginTop: 20,
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            paddingHorizontal: "10%",
            width: dimensions.window.width < 450 ? "100%" : null,
          }}
        >
          {currentStudies.courses?.flatMap((c) => c.subjects).length === 0 ? (
            <View style={{ marginHorizontal: "-7%" }}>
              <Text>Start adding subjects to see stats of your studies</Text>
            </View>
          ) : (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: "-7%",
                }}
              >
                {renderProgressCircle()}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16 }}>
                    Average mark (overall): {stats.officialAvg}
                  </Text>
                  <Text style={{ fontSize: 16 }}>
                    Average mark (taken): {stats.officialTakenAvg}
                  </Text>
                </View>
              </View>
              <View>
                <TopSubjects
                  width={dimensions.window.width}
                  topSubjects={studiesTopSubjects}
                />
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  const renderProgressCircle = () => {
    return (
      <View
        style={{
          minHeight: 100,
          minWidth: 100,
          justifyContent: "center",
          marginRight: 20,
          marginVertical: 10,
        }}
      >
        <View
          style={{
            position: "absolute",
            alignSelf: "center",
            height: 100,
            width: 80,
            justifyContent: "center",
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 20 }}>
            {stats.completion * 100 || 0}%
          </Text>
        </View>
        <ProgressCircle
          style={{
            minHeight: dimensions.window.width > 450 ? 200 : 100,
            minWidth: dimensions.window.width > 450 ? 200 : 100,
          }}
          progress={stats.completion || 0}
          progressColor={GlobalStyles.appPurple}
          strokeWidth={dimensions.window.width > 450 ? 12 : 8}
        />
      </View>
    );
  };

  const renderCoursesHeader = ({ item }) => {
    return (
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 16 }}>See individual courses:</Text>
      </View>
    );
  };

  const renderCourses = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: "10%" }}>
          <FlatList
            data={currentStudies.courses}
            renderItem={renderCourse}
            style={{ flexGrow: 0, marginTop: 20 }}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={renderEmptyCourses}
            ListHeaderComponent={renderCoursesHeader}
          />
          {currentStudies &&
          currentStudies.courses &&
          currentStudies.courses.length !== 0 ? (
            <View
              style={{
                marginTop: 10,
                alignSelf: "center",
                alignItems: "center",
              }}
            >
              <Text>
                {currentStudies.courses.length}/{currentStudies.years} courses
                added.
              </Text>
              {currentStudies.courses.length !== currentStudies.years && (
                <AddButton
                  name="course"
                  onCreate={() => setShowModal(true)}
                  style={{ marginTop: 10 }}
                />
              )}
            </View>
          ) : (
            <></>
          )}
        </View>
      </View>
    );
  };

  const createCourse = async (values) => {
    setBackendErrors([]);
    try {
      values.studiesId = currentStudies.id;
      const createdCourse = await create(values);
      showMessage({
        message: `${courseMapper[createdCourse.number]} course succesfully created`,
        type: "success",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
      setShowModal(false);
      await fetchOneStudies(route.params.id);
    } catch (error) {
      setBackendErrors(error.errors);
    }
  };

  const updateCourse = async (values) => {
    setBackendErrors([]);
    try {
      values.studiesId = editingCourse.studiesId;
      const updatedCourse = await update(editingCourse.id, values);
      showMessage({
        message: `${courseMapper[updatedCourse.number]} course succesfully updated`,
        type: "success",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
      setShowModal(false);
      await fetchOneStudies(route.params.id);
    } catch (error) {
      setBackendErrors(error.errors);
    }
  };

  return loading ? (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <ActivityIndicator />
    </View>
  ) : (
    <ScrollView>
      <View style={{ padding: 20 }}>
        {renderStudiesSelector()}
        <View
          style={{
            flexDirection: dimensions.window.width > 450 ? "row" : "column",
          }}
        >
          {renderDashboard()}
          {renderCourses()}
        </View>
        <CreateModal
          isVisible={showModal}
          onCancel={() => {
            setShowModal(false);
          }}
        >
          <View
            style={{
              maxHeight: dimensions.window.width < 450 ? 500 : 680,
              width: "90%",
            }}
          >
            <Text
              style={{ fontSize: 15, textAlign: "center", marginBottom: 5 }}
            >
              Introduce new course details
            </Text>
            <Formik
              validationSchema={validationSchema}
              initialValues={initialValues}
              onSubmit={editing ? updateCourse : createCourse}
            >
              {({ handleSubmit, setFieldValue, values }) => (
                <>
                  <View style={{ marginVertical: 10 }}>
                    <InputItem name="number" label="Course number (year):" />
                    <InputItem name="credits" label="Number of credits:" />
                  </View>

                  {backendErrors &&
                    backendErrors.map((error, index) => (
                      <Text key={index} style={{ color: "red" }}>
                        {error.param}: {error.msg}
                      </Text>
                    ))}

                  <CreateEditButton editing={editing} onSubmit={handleSubmit} />

                  <CancelButton
                    onCancel={() => {
                      setShowModal(false);
                    }}
                  />
                </>
              )}
            </Formik>
          </View>
        </CreateModal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  coursesCard: {
    backgroundColor: "white",
    marginVertical: 5,
    borderRadius: 10,
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    margin: 8,
    padding: 10,
    alignSelf: "center",
    flexDirection: "column",
    width: "50%",
  },
  text: {
    fontSize: 16,
    color: "white",
    alignSelf: "center",
    marginLeft: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    backgroundColor: "white",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white",
  },
  inputWeb: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
  },
});
