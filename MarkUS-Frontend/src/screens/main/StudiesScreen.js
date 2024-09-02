import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  Switch,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { AuthorizationContext } from "../../context/AuthorizationContext";
import { getAll, create, update, remove } from "../../api/StudiesEndpoints";
import { showMessage } from "react-native-flash-message";
import * as GlobalStyles from "../../styles/GlobalStyles";
import { FlatList } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";
import CreateModal from "../../components/modals/CreateModal";
import { ErrorMessage, Formik } from "formik";
import InputItem from "../../components/InputItem";
import * as yup from "yup";
import StudiesCard from "../../components/StudiesCard";
import DeleteModal from "../../components/modals/DeleteModal";
import DoubleButtons from "../../components/buttons/DoubleButtons";
import CancelButton from "../../components/buttons/CancelButton";
import CreateEditButton from "../../components/buttons/CreateEditButton";

export default function StudiesScreen({ navigation, route }) {
  const { loggedInUser } = useContext(AuthorizationContext);
  const [studies, setStudies] = useState([]);
  const isFocused = useIsFocused();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [backendErrors, setBackendErrors] = useState();
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const editing = editingId !== null;

  const [initialValues, setInitialValues] = useState({
    name: null,
    credits: null,
    description: null,
    logo: null,
    hasTrimesters: false,
    years: null,
  });
  const validationSchema = yup.object().shape({
    name: yup.string().max(255, "Name too long").required("Name is required"),
    credits: yup
      .number()
      .typeError("The number of credits must be a number")
      .positive("The number of credits must be positive")
      .integer("The number of credits must be integer")
      .required("The number of credits is required"),
    description: yup.string().nullable().max(255, "Description is too long"),
    logo: yup.string().nullable(),
    hasTrimesters: yup.boolean(),
    years: yup
      .number()
      .typeError("The number of credits must be a number")
      .positive("The number of years must be positive")
      .integer("The number of years must be integer")
      .required("The number of years is required"),
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
  }, [showCreateModal]);

  async function fetchStudies() {
    if (!isFocused) {
      return;
    }
    if (!loggedInUser) {
      navigation.navigate("My studies");
      setStudies([]);
      return;
    }
    try {
      const fetchedStudies = await getAll();
      setStudies(fetchedStudies);
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
    setLoading(true);
    fetchStudies();
    setLoading(false);
  }, [isFocused, loggedInUser]);

  const createStudies = async (values) => {
    setBackendErrors([]);
    try {
      const createdStudies = await create(values);
      showMessage({
        message: `Studies ${createdStudies.name} succesfully created`,
        type: "success",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
      setShowCreateModal(false);
      navigation.navigate("Studies info", { id: createdStudies.id });
    } catch (error) {
      setBackendErrors(error.errors);
    }
  };

  const updateStudies = async (values) => {
    setBackendErrors([]);
    try {
      const updatedStudies = await update(editingId, values);
      showMessage({
        message: `Studies ${updatedStudies.name} succesfully updated`,
        type: "success",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
      setShowCreateModal(false);
      fetchStudies();
      setInitialValues({
        name: null,
        credits: null,
        description: null,
        logo: null,
        hasTrimesters: false,
        years: null,
      });
      setEditingId(null);
    } catch (error) {
      setBackendErrors(error.errors);
    }
  };

  const removeStudies = async (id) => {
    try {
      await remove(id);
      setShowDeleteModal(false);
      fetchStudies();
      setEditingId(null);
      showMessage({
        message: "Studies succesfully removed",
        type: "success",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
    } catch (error) {
      console.log(error);
      showMessage({
        message: "Studies could not be removed.",
        type: "error",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
    }
  };

  const renderHomeButtons = () => {
    return (
      <DoubleButtons
        width={dimensions.window.width}
        editing={editing}
        name="studies"
        onCreate={() => {
          setShowCreateModal(true);
        }}
        onEdit={() => {
          setEditingId(0);
        }}
        onCancel={() => {
          setInitialValues({
            name: null,
            credits: null,
            description: null,
            logo: null,
            hasTrimesters: false,
            years: null,
          });
          setEditingId(null);
        }}
      />
    );
  };

  const onSubmit = async (values) => {
    return editing ? await updateStudies(values) : await createStudies(values);
  };

  return loading ? (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <ActivityIndicator />
    </View>
  ) : (
    <View style={{ margin: 20, marginTop: 10 }}>
      {loggedInUser ? (
        <>
          {dimensions.window.width > 450 && (
            <View style={{ height: 40 }}>{renderHomeButtons()}</View>
          )}

          <FlatList
            style={{ marginVertical: 10 }}
            data={studies}
            scrollEnabled={false}
            renderItem={({ item }) => {
              return (
                <StudiesCard
                  onPress={
                    editing
                      ? () => {
                          setInitialValues({
                            name: item.name,
                            credits: item.credits,
                            description: item.description,
                            logo: item.logo,
                            hasTrimesters: item.hasTrimesters,
                            years: item.years,
                          });
                          setShowCreateModal(true);
                          setEditingId(item.id);
                        }
                      : () => {
                          navigation.navigate("Studies info", { id: item.id });
                        }
                  }
                  onDelete={() => {
                    setShowDeleteModal(true);
                    setEditingId(item.id);
                  }}
                  item={item}
                  editing={editing}
                />
              );
            }}
            keyExtractor={(item) => item.id.toString()}
          />

          {dimensions.window.width <= 450 && renderHomeButtons()}

          <CreateModal
            isVisible={showCreateModal}
            onCancel={() => setShowCreateModal(false)}
          >
            <View
              style={{
                maxHeight: dimensions.window.width < 450 ? 550 : 680,
                width: "90%",
              }}
            >
              <Text
                style={{ fontSize: 15, textAlign: "center", marginBottom: 5 }}
              >
                Introduce new studies details
              </Text>

              <Formik
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
              >
                {({ handleSubmit, setFieldValue, values }) => (
                  <>
                    <ScrollView>
                      <View>
                        <InputItem name="name" label="Name:" />
                        <InputItem name="credits" label="Number of credits:" />
                        <InputItem name="description" label="Description:" />
                        <InputItem name="years" label="Duration (in years):" />

                        <Text style={{ marginLeft: 13, marginTop: 10 }}>
                          It uses:
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            marginVertical: 5,
                            marginBottom: 5,
                            alignItems: "center",
                            alignSelf:
                              dimensions.window.width < 450
                                ? "center"
                                : "flex-start",
                          }}
                        >
                          <Text>Semesters</Text>
                          <Switch
                            trackColor={{
                              false: GlobalStyles.appOrangeTap,
                              true: GlobalStyles.appOrangeTap,
                            }}
                            thumbColor={GlobalStyles.appWhiteTap}
                            value={values.hasTrimesters}
                            style={{ marginHorizontal: 5 }}
                            onValueChange={(value) =>
                              setFieldValue("hasTrimesters", value)
                            }
                          />
                          <ErrorMessage
                            name={"hasTrimesters"}
                            render={(msg) => <Text>{msg}</Text>}
                          />
                          <Text>Trimesters</Text>
                        </View>

                        {backendErrors &&
                          backendErrors.map((error, index) => (
                            <Text key={index} style={{ color: "red" }}>
                              {error.param}-{error.msg}
                            </Text>
                          ))}
                      </View>
                    </ScrollView>

                    <CreateEditButton
                      editing={editing}
                      onSubmit={handleSubmit}
                    />

                    <CancelButton onCancel={() => setShowCreateModal(false)} />
                  </>
                )}
              </Formik>
            </View>
          </CreateModal>

          <DeleteModal
            isVisible={showDeleteModal}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={() => removeStudies(editingId)}
            name={"studies"}
          />
        </>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Text style={{ fontSize: 15 }}>You are not logged in!</Text>
          <Pressable
            style={{
              padding: 10,
              backgroundColor: "white",
              borderRadius: 10,
              margin: 10,
            }}
            onPress={() => {
              navigation.navigate("AuthStack");
            }}
          >
            <Text style={{ fontSize: 20 }}>Log In</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
