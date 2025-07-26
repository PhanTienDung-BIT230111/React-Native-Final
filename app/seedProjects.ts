// // seedProjects.ts
// import { db } from "@/firebase/config";
// import { addDoc, collection, Timestamp } from "firebase/firestore";

// const seedProjects = async () => {
//   const projects = [
//     {
//       name: "Website Tuyển sinh 2025",
//       status: "Đang thực hiện",
//       client: "Trường Đại học GTVT TP.HCM",
//       progress: "65",
//       createdAt: Timestamp.now(),
//       updatedAt: Timestamp.now(),
//       deadline: Timestamp.fromDate(new Date("2025-09-01")),
//       description: "Xây dựng website giới thiệu thông tin tuyển sinh năm 2025",
//       members: ["a.nguyen@company.com", "b.tran@company.com"],
//     },
//     {
//       name: "Hệ thống quản lý học phí",
//       status: "Chờ xử lý",
//       client: "Phòng Tài chính",
//       progress: "0",
//       createdAt: Timestamp.now(),
//       updatedAt: Timestamp.now(),
//       deadline: Timestamp.fromDate(new Date("2025-12-31")),
//       description: "Tự động hóa quy trình thu học phí sinh viên",
//       members: ["c.le@company.com"],
//     },
//     {
//       name: "App điểm danh bằng khuôn mặt",
//       status: "Đã hoàn thành",
//       client: "Trung tâm CNTT",
//       progress: "100",
//       createdAt: Timestamp.now(),
//       updatedAt: Timestamp.now(),
//       deadline: Timestamp.fromDate(new Date("2025-05-01")),
//       description: "Ứng dụng AI nhận diện khuôn mặt cho điểm danh sinh viên",
//       members: ["b.tran@company.com", "d.pham@company.com"],
//     },
//     {
//       name: "Landing Page Lễ tốt nghiệp 2025",
//       status: "Đang thực hiện",
//       client: "Phòng CTCTSV",
//       progress: "40",
//       createdAt: Timestamp.now(),
//       updatedAt: Timestamp.now(),
//       deadline: Timestamp.fromDate(new Date("2025-08-15")),
//       description: "Thiết kế giao diện landing page sự kiện lễ tốt nghiệp",
//       members: ["a.nguyen@company.com"],
//     },
//     {
//       name: "Dashboard nội bộ Ban giám hiệu",
//       status: "Tạm dừng",
//       client: "Ban Giám Hiệu",
//       progress: "25",
//       createdAt: Timestamp.now(),
//       updatedAt: Timestamp.now(),
//       deadline: Timestamp.fromDate(new Date("2025-10-30")),
//       description: "Dashboard thống kê KPI toàn trường",
//       members: ["e.tu@company.com", "c.le@company.com"],
//     },
//   ];

//   try {
//     const colRef = collection(db, "projects");

//     for (const project of projects) {
//       await addDoc(colRef, project);
//       console.log("✅ Seeded:", project.name);
//     }
//   } catch (err) {
//     console.error("❌ Lỗi khi seed project:", err);
//   }
// };

// export default seedProjects;
