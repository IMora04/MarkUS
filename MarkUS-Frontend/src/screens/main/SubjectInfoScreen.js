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
import * as SubjectEndpoints from "../../api/SubjectEndpoints";
import * as EvaluableEndpoints from "../../api/EvaluableEndpoints";
import * as yup from "yup";
import { AuthorizationContext } from "../../context/AuthorizationContext";
import DeleteButton from "../../components/buttons/DeleteButton";
import DeleteModal from "../../components/modals/DeleteModal";
import { StudiesContext } from "../../context/StudiesContext";
import CreateModal from "../../components/modals/CreateModal";
import CancelButton from "../../components/buttons/CancelButton";
import InputItem from "../../components/InputItem";
import { Formik } from "formik";
import RNPickerSelect from "react-native-picker-select";
import DoubleButtons from "../../components/buttons/DoubleButtons";
import AppCard from "../../components/AppCard";
import EditClickable from "../../components/EditClickable";
import CreateEditButton from "../../components/buttons/CreateEditButton";

export default function CourseInfoScreen({ navigation, route }) {
  const [backendErrors, setBackendErrors] = useState();
  const [loading, setLoading] = useState(true);
  const { currentSubject, setCurrentSubject, currentCourse } =
    useContext(StudiesContext);
  const { loggedInUser } = useContext(AuthorizationContext);
  const [showDeleteSubjectModal, setShowDeleteSubjectModal] = useState(false);
  const [showDeleteEvModal, setShowDeleteEvModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [evaluableTypes, setEvaluableTypes] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: null,
    weight: null,
    evaluableTypeId: null,
    mark: null,
  });
  const [editingId, setEditingId] = useState(null);

  const editing = editingId !== null;

  useEffect(() => {
    if (!loggedInUser) {
      navigation.navigate("My studies");
    }
  }, [loggedInUser]);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(255, "Name is too long")
      .required("Name is required"),
    weight: yup
      .number()
      .typeError("Weight must be a number")
      .positive("Weight must be positive")
      .required("Weight is required"),
    mark: yup
      .number()
      .typeError("Mark must be a number")
      .positive("Mark must be positive")
      .max(10, "Mark must be between 0 and 10")
      .nullable(),
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

  useEffect(() => {
    setBackendErrors([]);
  }, [editing]);

  async function fetchOneSubject(id) {
    try {
      const fetchedSubject = await SubjectEndpoints.getDetail(id);
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
      <AppCard
        editing={editing}
        onDelete={() => {
          setEditingId(item.id);
          setShowDeleteEvModal(true);
        }}
        style={{ height: 55, justifyContent: "space-between" }}
      >
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text style={{ flex: 1 }}>
            {item.name}: {item.mark ? item.mark : "No mark yet"}
          </Text>
          <Text style={{ marginRight: editing ? "5%" : 0 }}>
            ({item.weight}%)
          </Text>
        </View>
        <Pressable
          onPress={() => {
            setInitialValues({
              name: item.name,
              weight: item.weight,
              evaluableTypeId: item.evaluableTypeId,
              mark: item.mark,
            });
            setShowCreateModal(true);
            setEditingId(item.id);
          }}
        >
          {editing && <EditClickable />}
        </Pressable>
      </AppCard>
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
      await SubjectEndpoints.remove(id);
      setShowDeleteSubjectModal(false);
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
      showMessage({
        message: "Subject could not be removed.",
        type: "error",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
    }
  };

  const removeEvaluable = async (id) => {
    try {
      await EvaluableEndpoints.remove(id);
      setShowDeleteEvModal(false);
      setEditingId(null);
      await fetchOneSubject(currentSubject.id);
      showMessage({
        message: "Evaluable succesfully removed",
        type: "success",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
    } catch (error) {
      showMessage({
        message: "Evaluable could not be removed.",
        type: "error",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
    }
  };

  const renderDoubleButtons = () => {
    if (
      (currentSubject.evaluables || [])
        .flatMap((e) => e.weight)
        .reduce((partialSum, a) => partialSum + a, 0) >= 100
    ) {
      return;
    }
    return (
      <View style={{ marginTop: 20 }}>
        <DoubleButtons
          onCreate={() => setShowCreateModal(true)}
          name={"marks"}
          editing={editing}
          onCancel={() => {
            setInitialValues({
              name: null,
              weight: null,
              evaluableTypeId: null,
              mark: null,
            });
            setEditingId(null);
          }}
          onEdit={() => {
            setEditingId(0);
          }}
          width={dimensions.window.width}
        />
      </View>
    );
  };

  const createEvaluable = async (values) => {
    setBackendErrors([]);
    try {
      values.subjectId = currentSubject.id;
      const createdEvaluable = await EvaluableEndpoints.create(values);
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

  const updateEvaluable = async (values) => {
    setBackendErrors([]);
    try {
      values.subjectId = currentSubject.id;
      const updatedEvaluable = await EvaluableEndpoints.update(
        editingId,
        values,
      );
      await fetchOneSubject(currentSubject.id);
      showMessage({
        message: `Evaluable ${updatedEvaluable.name} succesfully updated`,
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
    <View style={{ padding: 20, flex: 1 }}>
      <ScrollView>
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

        <FlatList
          scrollEnabled={false}
          data={usedEvaluableTypes}
          renderItem={renderEvaluableType}
          ListEmptyComponent={renderEmptyList}
          ListFooterComponent={renderDoubleButtons}
        />
        <DeleteButton
          name={"subject"}
          onDelete={() => setShowDeleteSubjectModal(true)}
        />
      </ScrollView>

      <DeleteModal
        isVisible={showDeleteSubjectModal}
        onCancel={() => setShowDeleteSubjectModal(false)}
        name={"subject"}
        onConfirm={() => removeSubject(currentSubject.id)}
      />
      <DeleteModal
        isVisible={showDeleteEvModal}
        onCancel={() => setShowDeleteEvModal(false)}
        name={"evaluable"}
        onConfirm={() => removeEvaluable(editingId)}
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
            onSubmit={editing ? updateEvaluable : createEvaluable}
          >
            {({ handleSubmit, setFieldValue, values }) => (
              <>
                <View style={{ marginVertical: 10 }}>
                  <InputItem name="name" label="Name:" />
                  <InputItem name="weight" label="Total weight (%):" />
                  <InputItem name="mark" label="Mark:" />

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

                <CreateEditButton onSubmit={handleSubmit} editing={editing} />

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
