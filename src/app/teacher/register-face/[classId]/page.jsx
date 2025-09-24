
import newAttendanceList from "@/components/new";


export default async function page({ params }) {
  const { classId } =  await params;



  return (
    <div>
      <h2 className=" md:ml-[-250px] text-2xl mt-20 ml-40 font-bold mb-4 text-white">Registrasition for Class {classId}</h2>
     <newAttendanceList/>
    </div>
  );
}
