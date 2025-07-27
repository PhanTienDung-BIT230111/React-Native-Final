import StatusFilter from "@/components/StatusFilter";
import { db } from "@/firebase/config";
import { FontAwesome } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderWithAvatar from "../../../components/HomeComponent/HeaderWithAvatar";
import ProjectCard from "../../../components/ProjectComponent/ProjectCard";
import ProjectOverview from "../../../components/ProjectComponent/ProjectOverview";
import SearchBar from "../../../components/SearchBar";

const statuses = [
  "Tất cả",
  "Đang thực hiện",
  "Đã hoàn thành",
  "Chờ xử lý",
  "Tạm dừng",
];
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

  const [employees, setEmployees] = useState<any[]>([]);
  const [projectCount, setProjectCount] = useState(0);
  // search logic
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchProject, setSearchProject] = useState<string>("");
  // const [filter, setFilter] = useState(projects);

  const filterProjectBySearch = projects.filter((item) => {
    return item.name.toLowerCase().includes(searchProject.toLowerCase());
  });

  // Thêm state:
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");

  // Lọc dữ liệu:
  const filteredProjectsByTag = projects.filter((p) => {
    if (selectedStatus === "Tất cả") return true;
    return p.status === selectedStatus;
  });
  const filterData = searchProject
    ? filterProjectBySearch
    : filteredProjectsByTag;

  // const addProject = async () => {
  //   try {
  //     const newProject = {
  //       name: "Landing page sự kiện UTH 2025",
  //       status: "Hoàn thành",
  //       client: "Trường Đại học GTVT TP.HCM",
  //       progress: "100",
  //       createdAt: Timestamp.now(),
  //       updatedAt: Timestamp.now(),
  //       deadline: Timestamp.fromDate(new Date("2025-05-01")),
  //       description: "Thiết kế giao diện landing page đẹp mắt",
  //       members: ["em@example.com"],
  //     };

  //     await addDoc(collection(db, "projects"), newProject);
  //     console.log("🟢 Thêm thành công!");
  //   } catch (error) {
  //     console.error("🔴 Lỗi khi thêm dự án:", error);
  //   }
  // };
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
      const snapshotEmployee = await getDocs(collection(db, "employees"));
      const docsEmployee = snapshotEmployee.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(docsEmployee);
    };

    fetchData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Dự án "
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);
  return (
    <FlatList
      style={styles.container}
      data={filterData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProjectCard
          item={item}
          onPress={() => {
            router.push({
              pathname: "/projects/[id]",
              params: { id: item.id },
            });
            console.log("Project ID:", item.id);
          }}
        />
      )}
      ListEmptyComponent={
        <Text style={{ padding: 20 }}>Không có dự án nào</Text>
      }
      ListHeaderComponent={
        <>
          <View style={styles.cardContainer}>
            <ProjectOverview
              iconName="folder"
              color="#000"
              label="Tổng dự án"
              total={projectCount.toString()}
              bgColor="#fff"
            />
            <ProjectOverview
              iconName="clock-o"
              color="#000"
              label="Đang thực hiện"
              total={projects
                .filter((p) => p.status === ProjectStatus.inProgress)
                .length.toString()}
              bgColor="#fff"
            />
          </View>

          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/projects/new")}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <FontAwesome name="plus" size={20} color="#fff" />
                <Text style={styles.buttonText}>Tạo dự án mới</Text>
              </View>
            </TouchableOpacity>

            <SearchBar
              placeholder="Tìm kiếm dự án"
              searchProject={searchProject}
              setSearchProject={setSearchProject}
            />
            <StatusFilter
              statuses={statuses}
              selected={selectedStatus}
              onSelect={setSelectedStatus}
            />
          </View>
        </>
      }
    />
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
