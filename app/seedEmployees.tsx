// // seedEmployees.tsx
// import { db } from "@/firebase/config";
// import { addDoc, collection } from "firebase/firestore";
// import { useEffect } from "react";
// import { Text, View } from "react-native";
// import { employeesData } from "./employeesData";

// export default function SeedEmployees() {
//   useEffect(() => {
//     const pushData = async () => {
//       for (const employee of employeesData) {
//         try {
//           await addDoc(collection(db, "employees"), employee);
//           console.log("✅ Đã thêm:", employee.name);
//         } catch (err) {
//           console.error("❌ Lỗi:", err);
//         }
//       }
//     };
//     pushData();
//   }, []);

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Đang đẩy dữ liệu lên Firestore...</Text>
//     </View>
//   );
// }
