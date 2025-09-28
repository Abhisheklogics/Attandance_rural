import Attendance from "@/components/Attendance";
export async function generateStaticParams() {
  // yahan data fetch karo
  const res = await fetch('http://localhost:3000/api/classes');
  const posts = await res.json();

  return posts.map((post) => ({
    classId: String(post.classId), // yahan URL param key ho
  }));
}



export default async function page({ params }) {
  const { classId } =  await params;



  return (
    <div className='md:ml-[-250px]'>
     
      <Attendance alldata={classId}/>
    </div>
  );
}
