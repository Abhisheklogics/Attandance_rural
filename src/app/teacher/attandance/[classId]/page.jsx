import Attendance from "@/components/Attendance";



export default async function page({ params }) {
  const { classId } =  await params;



  return (
    <div className='md:ml-[-250px]'>
     
      <Attendance alldata={classId}/>
    </div>
  );
}
