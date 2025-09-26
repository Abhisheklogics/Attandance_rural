"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

import {getAllStudentsOffline ,saveAttendanceOffline} from  '@/lib/indexedDB'

import { useRouter } from "next/navigation";

export default  function Attendance({ alldata }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [matcher, setMatcher] = useState(null);
  const [recognizedList, setRecognizedList] = useState([]);
  const [facingMode, setFacingMode] = useState("user");
  const [detecting, setDetecting] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [inputSize, setInputSize] = useState(160);
  const router = useRouter();
let data;
  useEffect(() => {
    function getAdaptiveInput() {
      return window.innerWidth < 768 ? 160 : 224;
    }
    setInputSize(getAdaptiveInput());
  }, []);

  useEffect(() => {
    const load = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ]);
if (navigator.onLine) {
  const res = await fetch(`/api/students?class=${alldata}`);
   data = await res.json();
  setStudents(data);
} else {
 data = await getAllStudentsOffline(alldata); 
  console.log('Locally fetched successfully');
  setStudents(data);
}


      const labeled = data.map((stu) => {
        const descriptors = stu.embeddings.map((emb) => new Float32Array(emb));
        return new faceapi.LabeledFaceDescriptors(stu.name, descriptors);
      });
      setMatcher(new faceapi.FaceMatcher(labeled, 0.5));

      startVideo(facingMode);
    };
    load();
    return () => stopVideo();
  }, [facingMode]);

  const startVideo = (mode) => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: mode } })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Camera error:", err));
  };

  const stopVideo = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((track) => track.stop());
  };

  const takeSnapshot = (video) => {
    const snapshotCanvas = document.createElement("canvas");
    snapshotCanvas.width = video.videoWidth;
    snapshotCanvas.height = video.videoHeight;
    const ctx = snapshotCanvas.getContext("2d");
    ctx.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
    return snapshotCanvas.toDataURL("image/png");
  };

 const onPlay = async () => {
  if (!videoRef.current || !matcher || detecting) return;
  setDetecting(true);

  const video = videoRef.current;
  const canvas = canvasRef.current;
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  const detect = async () => {
    if (video.paused || video.ended) {
      setDetecting(false);
      return;
    }

    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resized = faceapi.resizeResults(detections, displaySize);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const recognized = [];
    resized.forEach((det) => {
      const best = matcher.findBestMatch(det.descriptor);
      const matchedStudent = students.find((s) => s.name === best.label);
      const box = det.detection.box;

      ctx.strokeStyle = matchedStudent ? "#12439eff" : "#ef4444";
      ctx.lineWidth = 3;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      const label = matchedStudent ? `${matchedStudent.name} (${matchedStudent.class})` : "Unknown";
      ctx.font = "16px Arial";
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(box.x, box.y - 24, ctx.measureText(label).width + 10, 20);
      ctx.fillStyle = "#fff";
      ctx.fillText(label, box.x + 5, box.y - 8);

      if (matchedStudent) recognized.push(matchedStudent);
    });

    setRecognizedList(recognized);

    
    if (!attendanceMarked && recognized.length > 0) {
      setAttendanceMarked(true);

      const snapshot = takeSnapshot(video);
      stopVideo();

      try {
      if (navigator.onLine) {
       
  await fetch("/api/mark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            students: recognized.map((stu) => ({
              name: stu.name,
              roll: stu.roll,
              className: stu.class,
            })),
            timestamp: new Date().toISOString(),
          }),
        });

        alert(`Attendance marked for: ${recognized.map((s) => s.name).join(", ")}`);
        router.push("/teacher/show-attandance");
        }else{
          await saveAttendanceOffline({
             students: recognized.map((stu) => ({
      name: stu.name,
      roll: stu.roll,
      className: stu.class,
    })),
    timestamp: new Date().toISOString(),
          })
           alert("Offline attendance saved. Will sync when online ✅");
           router.push("/teacher/show-attandance");
        }
      
      } catch (err) {
        console.error("Mark attendance failed:", err);
      }

      return; 
    }

    if (!attendanceMarked) requestAnimationFrame(detect);
  };

  requestAnimationFrame(detect);
};

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-6 px-2">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent text-center">
        Smart Face Attendance
      </h1>

      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-md mb-6">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onPlay={onPlay}
          className="w-full h-auto rounded-2xl"
        />
        <canvas ref={canvasRef} width={640} height={480} className="absolute top-0 left-0 w-full h-full" />
      </div>

      <div className="mt-4 text-center text-gray-400 text-sm sm:text-base">
        {recognizedList.length
          ? `Recognized: ${recognizedList.map((s) => s.name).join(", ")}`
          : "Look at the camera. Multiple faces can be detected."}
      </div>
    </div>
  );
}



// Here’s a detailed breakdown of every function and important part in your Attendance component so you can fully understand and customize it:

// 1. Component Definition
// export default function Attendance({ alldata }) { ... }


// Purpose: The main React component for the attendance system.

// Props:

// alldata: The class or batch identifier used to fetch student data.

// 2. useRef Hooks
// const videoRef = useRef(null);
// const canvasRef = useRef(null);


// videoRef → Points to the <video> element displaying the camera feed.

// canvasRef → Points to the <canvas> overlay used for drawing bounding boxes and labels.

// 3. useState Hooks
// State	Purpose
// students	Holds student records fetched from /api/students.
// matcher	Holds a FaceMatcher instance for comparing detected faces to known faces.
// recognizedList	Stores the list of currently recognized students.
// facingMode	Determines camera direction: "user" (front) or "environment" (rear).
// detecting	Prevents starting detection multiple times at once.
// attendanceMarked	Ensures attendance is marked only once per session.
// inputSize	Adaptive input resolution for the face detector (smaller for mobile).
// 4. Adaptive Input Size
// useEffect(() => {
//   function getAdaptiveInput() {
//     return window.innerWidth < 768 ? 160 : 224;
//   }
//   setInputSize(getAdaptiveInput());
// }, []);


// Purpose: Sets face detection resolution based on screen size.

// Why: Smaller input size on mobile improves performance.

// 5. Model Loading and Student Fetching
// useEffect(() => {
//   const load = async () => {
//     await Promise.all([
//       faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//       faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//       faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//     ]);

//     const res = await fetch(`/api/students?class=${alldata}`);
//     const data = await res.json();
//     setStudents(data);

//     const labeled = data.map((stu) => {
//       const descriptors = stu.embeddings.map((emb) => new Float32Array(emb));
//       return new faceapi.LabeledFaceDescriptors(stu.name, descriptors);
//     });
//     setMatcher(new faceapi.FaceMatcher(labeled, 0.5));

//     startVideo(facingMode);
//   };
//   load();
//   return () => stopVideo();
// }, [facingMode]);

// Steps:

// Loads Models: Downloads the TinyFaceDetector, Landmark, and Recognition models from /models.

// Fetches Students: Gets student embeddings (face data) from the backend.

// Creates LabeledFaceDescriptors: Converts embeddings into FaceAPI format.

// Initializes Matcher: FaceMatcher compares detected faces with known embeddings (0.5 is the distance threshold).

// Starts Camera: Calls startVideo.

// Cleanup: Stops the video stream when the component unmounts or facing mode changes.

// 6. startVideo
// const startVideo = (mode) => {
//   navigator.mediaDevices
//     .getUserMedia({ video: { facingMode: mode } })
//     .then((stream) => {
//       if (videoRef.current) videoRef.current.srcObject = stream;
//     })
//     .catch((err) => console.error("Camera error:", err));
// };


// Purpose: Requests camera access and streams it to <video>.

// Key Point: facingMode toggles between front and back cameras.

// 7. stopVideo
// const stopVideo = () => {
//   const stream = videoRef.current?.srcObject;
//   if (stream) stream.getTracks().forEach((track) => track.stop());
// };


// Purpose: Stops all tracks to release the camera.

// When: Called on unmount or after attendance is marked.

// 8. takeSnapshot
// const takeSnapshot = (video) => {
//   const snapshotCanvas = document.createElement("canvas");
//   snapshotCanvas.width = video.videoWidth;
//   snapshotCanvas.height = video.videoHeight;
//   const ctx = snapshotCanvas.getContext("2d");
//   ctx.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
//   return snapshotCanvas.toDataURL("image/png");
// };


// Purpose: Captures the current video frame as a base64 PNG image.

// Usage: Stores a proof image when marking attendance.

// 9. onPlay (Face Detection Entry Point)
// const onPlay = async () => {
//   if (!videoRef.current || !matcher || detecting) return;
//   setDetecting(true);

//   const video = videoRef.current;
//   const canvas = canvasRef.current;
//   const displaySize = { width: video.videoWidth, height: video.videoHeight };
//   faceapi.matchDimensions(canvas, displaySize);

//   const detect = async () => {
//     if (video.paused || video.ended) {
//       setDetecting(false);
//       return;
//     }

//     const detections = await faceapi
//       .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold: 0.5 }))
//       .withFaceLandmarks()
//       .withFaceDescriptors();

//     const resized = faceapi.resizeResults(detections, displaySize);
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     const recognized = [];
//     resized.forEach((det) => {
//       const best = matcher.findBestMatch(det.descriptor);
//       const matchedStudent = students.find((s) => s.name === best.label);
//       const box = det.detection.box;

//       ctx.strokeStyle = matchedStudent ? "#12439eff" : "#ef4444";
//       ctx.lineWidth = 3;
//       ctx.strokeRect(box.x, box.y, box.width, box.height);

//       const label = matchedStudent ? `${matchedStudent.name} (${matchedStudent.class})` : "Unknown";
//       ctx.font = "16px Arial";
//       ctx.fillStyle = "rgba(0,0,0,0.5)";
//       ctx.fillRect(box.x, box.y - 24, ctx.measureText(label).width + 10, 20);
//       ctx.fillStyle = "#fff";
//       ctx.fillText(label, box.x + 5, box.y - 8);

//       if (matchedStudent) recognized.push(matchedStudent);
//     });

//     setRecognizedList(recognized);

//     if (!attendanceMarked && recognized.length && recognized.length === students.length) {
//       setAttendanceMarked(true);
//       const snapshot = takeSnapshot(video);
//       stopVideo();
//       try {
//         await Promise.all(
//           recognized.map((stu) =>
//             fetch("/api/mark", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 name: stu.name,
//                 roll: stu.roll,
//                 className: stu.class,
//                 timestamp: new Date().toISOString(),
//                 snapshot,
//               }),
//             })
//           )
//         );
//         alert(`Attendance marked for: ${recognized.map((s) => s.name).join(", ")}`);
//         router.push("/teacher/show-attandance");
//       } catch (err) {
//         console.error("Mark attendance failed:", err);
//       }
//       return;
//     }

//     if (!attendanceMarked) requestAnimationFrame(detect);
//   };

//   requestAnimationFrame(detect);
// };

// Step-by-Step Flow:

// Checks Preconditions: Stops if matcher is not ready or detection is already running.

// Sets Canvas Size: Matches the video feed for drawing bounding boxes.

// detect() Loop:

// Detects all faces → gets landmarks and descriptors.

// Resizes results for accurate overlay.

// Draws boxes (strokeRect) and labels (fillText).

// Finds matches with matcher.findBestMatch.

// Pushes matched students to recognized.

// Marks Attendance Automatically: If all students are recognized, takes a snapshot, stops video, and POSTs attendance data.

// Continues Loop: Uses requestAnimationFrame for smooth detection until attendance is marked.

// 10. markAttendance (Manual Button Trigger)
// const markAttendance = async () => {
//   if (!recognizedList.length || attendanceMarked) return alert("No students recognized or already marked!");
//   setAttendanceMarked(true);

//   const snapshot = takeSnapshot(videoRef.current);
//   stopVideo();

//   try {
//     await Promise.all(
//       recognizedList.map((stu) =>
//         fetch("/api/mark", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             name: stu.name,
//             roll: stu.roll,
//             className: stu.class,
//             timestamp: new Date().toISOString(),
//             snapshot,
//           }),
//         })
//       )
//     );
//     alert(`Attendance marked for: ${recognizedList.map((s) => s.name).join(", ")}`);
//     router.push("/teacher/show-attandance");
//   } catch (err) {
//     console.error("Mark attendance failed:", err);
//   }
// };


// Purpose: Lets the teacher manually confirm attendance instead of waiting for automatic detection.

// Flow: Uses recognizedList, stops video, and sends data to /api/mark.

// 11. UI Controls

// Switch Camera Button: Toggles between front and back cameras.

// Mark Attendance Button: Disabled if no faces or already marked.

// Status Text: Shows recognized names or a hint for the user.

// ✅ How to Customize

// Change detection sensitivity: Modify new faceapi.FaceMatcher(labeled, 0.5) → lower for stricter matching.

// Add per-student logging: Inside recognized.forEach, send intermediate logs to your backend.

// Change bounding box colors or styles: Edit ctx.strokeStyle, ctx.fillStyle, or font properties.

// Disable auto-marking: Remove the if (!attendanceMarked && recognized.length === students.length) block and rely only on markAttendance.

// Add audio feedback: Play a sound when a student is recognized.