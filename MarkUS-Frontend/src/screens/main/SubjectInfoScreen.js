import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import * as GlobalStyles from "../../styles/GlobalStyles";
import { showMessage } from "react-native-flash-message";
import { getDetail, remove } from "../../api/SubjectEndpoints";
import { create } from "../../api/EvaluableEndpoints";
import * as EvaluableEndpoints from "../../api/EvaluableEndpoints";
import * as yup from "yup";
import { AuthorizationContext } from "../../context/AuthorizationContext";
import AddButton from "../../components/buttons/AddButton";
import DeleteButton from "../../components/buttons/DeleteButton";
import DeleteModal from "../../components/modals/DeleteModal";
import { StudiesContext } from "../../context/StudiesContext";
import CreateModal from "../../components/modals/CreateModal";
import CancelButton from "../../components/buttons/CancelButton";
import InputItem from "../../components/InputItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import RNPickerSelect from "react-native-picker-select";

export default function CourseInfoScreen({ navigation, route }) {
  const [backendErrors, setBackendErrors] = useState();
  const [loading, setLoading] = useState(true);
  const { currentSubject, setCurrentSubject, currentCourse } =
    useContext(StudiesContext);
  const { loggedInUser } = useContext(AuthorizationContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [evaluableTypes, setEvaluableTypes] = useState([]);

  useEffect(() => {
    if (!loggedInUser) {
      navigation.navigate("My studies");
    }
  }, [loggedInUser]);

  const initialValues = { name: null, weight: null, evaluableTypeId: null };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(255, "Name is too long")
      .required("Name is required"),
    weight: yup
      .number()
      .positive("Weight must be positive")
      .required("Weight is required"),
    evaluableTypeId: yup.number().required("Evaluable type is required"),
  });

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

  async function fetchOneSubject(id) {
    try {
      const fetchedSubject = await getDetail(id);
      setCurrentSubject(fetchedSubject);
      const fetchedEvaluableTypes = await EvaluableEndpoints.getAll();
      const reshapedEvaluables = fetchedEvaluableTypes.map((e) => {
        return {
          label: e.name,
          value: e.id,
        };
      });
      setEvaluableTypes(reshapedEvaluables);
      setLoading(false);
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving this subject. ${error} `,
        type: "error",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
    }
  }

  const usedEvaluableTypes = currentSubject.evaluables
    ? [...new Set(currentSubject.evaluables?.map((e) => e.type.name))]
    : [];

  useEffect(() => {
    setLoading(true);
    fetchOneSubject(route.params.id);
  }, [route]);

  const renderEvaluableType = ({ item }) => {
    return (
      <View>
        <Text style={{ fontSize: 18, marginVertical: 10 }}>{item}s</Text>
        <FlatList
          data={currentSubject.evaluables.filter((e) => e.type.name === item)}
          keyExtractor={(e) => e.id}
          renderItem={renderEvaluable}
          scrollEnabled={false}
        />
      </View>
    );
  };

  const renderEvaluable = ({ item }) => {
    return (
      <Text style={{ margin: 2 }}>
        {item.name}: {item.mark ? item.mark : "No mark yet"} ({item.weight}%)
      </Text>
    );
  };

  const renderEmptyList = () => {
    return (
      <View style={{ marginTop: 10 }}>
        <Text style={{ textAlign: "center", fontSize: 15 }}>
          No evaluables found
        </Text>
      </View>
    );
  };

  const removeSubject = async (id) => {
    try {
      await remove(id);
      setShowDeleteModal(false);
      navigation.navigate("Course info", {
        id: currentCourse.id,
      });
      setCurrentSubject({});
      showMessage({
        message: "Subject succesfully removed",
        type: "success",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
    } catch (error) {
      console.log(error);
      showMessage({
        message: "Subject could not be removed.",
        type: "error",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
    }
  };

  const renderAddButton = () => {
    if (
      (currentSubject.evaluables || [])
        .flatMap((e) => e.weight)
        .reduce((partialSum, a) => partialSum + a, 0) >= 100
    ) {
      return;
    }
    return (
      <View
        style={{ marginTop: 20, alignSelf: "center", alignItems: "center" }}
      >
        <AddButton
          onCreate={() => setShowCreateModal(true)}
          name={"evaluable"}
        />
      </View>
    );
  };

  const createEvaluable = async (values) => {
    setBackendErrors([]);
    try {
      values.subjectId = currentSubject.id;
      console.log(values);
      const createdEvaluable = await create(values);
      await fetchOneSubject(currentSubject.id);
      showMessage({
        message: `Evaluable ${createdEvaluable.name} succesfully created`,
        type: "success",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
      setShowCreateModal(false);
    } catch (error) {
      setBackendErrors(error.errors);
    }
  };

  return loading ? (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <ActivityIndicator />
    </View>
  ) : (
    <View style={{ padding: 20 }}>
      <Text
        style={{
          textAlign: "center",
          fontWeight: 600,
          fontSize: 20,
          marginBottom: 15,
        }}
      >
        {currentSubject.name}
      </Text>
      <ScrollView>
        <FlatList
          scrollEnabled={false}
          data={usedEvaluableTypes}
          renderItem={renderEvaluableType}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={{ minHeight: dimensions.window.height * 0.65 }}
          ListFooterComponent={renderAddButton}
        />

        <DeleteButton
          name={"subject"}
          onDelete={() => setShowDeleteModal(true)}
        />
      </ScrollView>
      <DeleteModal
        isVisible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        name={"subject"}
        onConfirm={() => removeSubject(currentSubject.id)}
      />
      <CreateModal
        isVisible={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          setBackendErrors();
        }}
      >
        <View
          style={{
            maxHeight: dimensions.window.width < 450 ? 500 : 680,
            width: "90%",
          }}
        >
          <Text style={{ fontSize: 15, textAlign: "center", marginBottom: 5 }}>
            Introduce new evaluable details
          </Text>
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={createEvaluable}
          >
            {({ handleSubmit, setFieldValue, values }) => (
              <>
                <View style={{ marginVertical: 10 }}>
                  <InputItem name="name" label="Name:" />
                  <InputItem name="weight" label="Total weight (%):" />

                  <Text
                    style={{
                      width: "100%",
                      textAlign: "left",
                      paddingLeft: 13,
                      marginTop: 10,
                      marginBottom: 5,
                    }}
                  >
                    Evaluable type:
                  </Text>
                  <View>
                    <RNPickerSelect
                      placeholder={{
                        label: "Select evaluable type...",
                        value: null,
                      }}
                      onValueChange={(value) => {
                        setFieldValue("evaluableTypeId", value);
                      }}
                      style={pickerSelectStyles}
                      items={evaluableTypes}
                    />
                  </View>
                </View>

                {backendErrors &&
                  backendErrors.map((error, index) => (
                    <Text key={index} style={{ color: "red" }}>
                      {error.param}: {error.msg}
                    </Text>
                  ))}

                <Pressable
                  onPress={handleSubmit}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? GlobalStyles.appGreenTap
                        : GlobalStyles.appGreen,
                    },
                    styles.actionButton,
                  ]}
                >
                  <View
                    style={[
                      {
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center",
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={"check"}
                      color={"white"}
                      size={20}
                    />
                    <Text style={styles.text}>Create</Text>
                  </View>
                </Pressable>

                <CancelButton
                  onCancel={() => {
                    setShowCreateModal(false);
                  }}
                />
              </>
            )}
          </Formik>
        </View>
      </CreateModal>
    </View>
  );
}

const styles = StyleSheet.create({
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
