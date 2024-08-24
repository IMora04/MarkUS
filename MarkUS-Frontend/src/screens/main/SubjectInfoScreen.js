import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import * as GlobalStyles from "../../styles/GlobalStyles";
import { showMessage } from "react-native-flash-message";
import { getDetail, remove } from "../../api/SubjectEndpoints";
import * as yup from "yup";
import { AuthorizationContext } from "../../context/AuthorizationContext";
import AddButton from "../../components/buttons/AddButton";
import DeleteButton from "../../components/buttons/DeleteButton";
import DeleteModal from "../../components/modals/DeleteModal";

export default function CourseInfoScreen({ navigation, route }) {
  const [backendErrors, setBackendErrors] = useState();
  const [loading, setLoading] = useState(true);
  const [currentSubject, setCurrentSubject] = useState({});
  const { loggedInUser } = useContext(AuthorizationContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!loggedInUser) {
      navigation.navigate("My studies");
    }
  }, [loggedInUser]);

  const validationSchema = yup.object().shape({});

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

  const evaluableTypes = currentSubject.evaluables
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
        <View
          style={{ marginTop: 20, alignSelf: "center", alignItems: "center" }}
        >
          <AddButton onCreate={() => {}} name={"evaluable"} />
        </View>
      </View>
    );
  };

  const removeSubject = async (id) => {
    try {
      await remove(id);
      setShowDeleteModal(false);
      navigation.navigate("Course info", {
        id: route.params.currentCourse.id,
      });
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
          data={evaluableTypes}
          renderItem={renderEvaluableType}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={{ minHeight: dimensions.window.height * 0.65 }}
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
    </View>
  );
}

const styles = StyleSheet.create({});
