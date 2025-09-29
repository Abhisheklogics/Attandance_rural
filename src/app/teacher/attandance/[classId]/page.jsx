import Attendance from "@/components/Attendance";
export async function generateStaticParams() {
  try {
    const res = await fetch('https://attandance-rural.vercel.app/api/classes');
    const posts = await res.json();
    return posts.map((post) => ({ classId: String(post.classId) }));
  } catch (err) {
    console.warn("Offline fallback for generateStaticParams:", err);
   
    const fallbackClasses = Array.from({ length: 10 }, (_, i) => i + 1);
    return fallbackClasses.map((id) => ({ classId: String(id) }));
  }
}



export default async function page({ params }) {
  const { classId } =  await params;



  return (
    <div className='md:ml-[50px]'>
     
      <Attendance alldata={classId}/>
    </div>
  );
}
