import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import HeaderWithAvatar from "../../components/HomeComponent/HeaderWithAvatar";
import ProjectOverview from "../../components/ProjectComponent/ProjectOverview";
import { FontAwesome } from "@expo/vector-icons";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import SearchBar from "../../components/SearchBar";
import ProjectCard from "../../components/ProjectComponent/ProjectCard";
import StatusFilter from "@/components/ProjectComponent/StatusFilter";
enum ProjectStatus {
  pending = "Chờ xử lý",
  inProgress = "Đang thực hiện",
  completed = "Đã hoàn thành",
  cancelled = "Đã hủy",
}
export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  client?: string;
  progress: string;
  createAt?: Date;
  updateAt?: Date;
  deadline?: Date;
  description?: string;
  members?: Array<string>;
};
export default function projects() {
  const navigation = useNavigation();
  const [projectCount, setProjectCount] = useState(0);
  // search logic
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchProject, setSearchProject] = useState<string>("");
  // const [filter, setFilter] = useState(projects);

  const filterData = projects.filter((item) => {
    return item.name.toLowerCase().includes(searchProject.toLowerCase());
  });

  // Thêm state:
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");

  // Lọc dữ liệu:
  const filteredProjects = projects.filter((p) => {
    if (selectedStatus === "Tất cả") return true;
    return p.status === selectedStatus;
  });

  // const [filterProject, setFilterProject] = useState<Project[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "projects"));
      setProjectCount(snapshot.size);

      const docs: Project[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          status: data.status,
          progress: data.progress,
          deadline: data.deadline?.toDate(),
          client: data.client,
          description: data.description,
          members: data.members || [],
          createAt: data.createdAt?.toDate(),
          updateAt: data.updatedAt?.toDate(),
        };
      });

      setProjects(docs);
    };

    fetchData();
  }, []);

  // log projects khi projects thay đổi
  useEffect(() => {
    console.log("Projects:", projects);
  }, [projects]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Dự án"
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        <ProjectOverview
          iconName="folder"
          color="#000"
          label="Tổng dự án"
          total="20"
          // sau lay du lieu tu firebase
          bgColor="#fff"
        />
        <ProjectOverview
          iconName="clock-o"
          color="#000"
          label="Đang thực hiện"
          total="10"
          bgColor="#fff"
        />
      </View>

      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.button}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <FontAwesome name="plus" size={20} color="#fff" />
            <Text style={styles.buttonText}>Tạo dự án mới</Text>
          </View>
        </TouchableOpacity>
        {/* Search Bar */}
        <SearchBar
          placeholder="Tìm kiếm dự án"
          searchProject={searchProject}
          setSearchProject={setSearchProject}
        />

        <FlatList
          data={filterData}
          keyExtractor={(item) => item.id}
          style={{}}
          renderItem={({ item }) => <ProjectCard item={item} />}
        />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  cardContainer: {
    backgroundColor: "#f3f4f6",
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
