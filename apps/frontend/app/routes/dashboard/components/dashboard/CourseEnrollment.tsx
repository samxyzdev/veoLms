// import { BarChart3 } from "lucide-react";

// import { dashboardData } from "../../data/dashboardData";

// export function CourseEnrollment() {
//   const maxValue = Math.max(
//     ...dashboardData.enrollment.map((item) => item.enrolled),
//   );

//   return (
//     <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
//             Learning activity
//           </p>

//           <h2 className="mt-1 text-lg font-extrabold text-slate-950">
//             Course Enrollment
//           </h2>

//           <p className="mt-1 text-xs text-slate-400">
//             Your course activity over the last few months
//           </p>
//         </div>

//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
//           <BarChart3 size={18} />
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="mt-8">
//         <div className="flex h-52 items-end gap-2 sm:gap-3">
//           {dashboardData.enrollment.map((item) => {
//             const height = (item.enrolled / maxValue) * 100;

//             return (
//               <div
//                 key={item.month}
//                 className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
//               >
//                 <div className="relative flex h-full w-full items-end justify-center">
//                   {/* Tooltip */}
//                   <div className="absolute -top-7 hidden rounded-md bg-slate-900 px-2 py-1 text-[9px] font-bold text-white group-hover:block">
//                     {item.enrolled}
//                   </div>

//                   <div
//                     className="w-full max-w-[30px] rounded-t-lg bg-indigo-100 transition-all duration-200 group-hover:bg-indigo-500"
//                     style={{
//                       height: `${height}%`,
//                     }}
//                   />
//                 </div>

//                 <span className="text-[10px] font-medium text-slate-400">
//                   {item.month}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }
