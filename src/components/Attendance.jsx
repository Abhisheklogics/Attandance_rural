"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useRouter } from "next/navigation";

export default function Attendance() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [matcher, setMatcher] = useState(null);
  const [recognizedList, setRecognizedList] = useState([]);
  const [facingMode, setFacingMode] = useState("user"); 
  const [detecting, setDetecting] = useState(false);
  const [inputSize, setInputSize] = useState(160); 
  const router = useRouter();
 useEffect(() => {
    function getAdaptiveInput() {
      const width = window.innerWidth;
      if (width < 768) {
        return 160; 
      }
      return 224; 
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

      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data);

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
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Camera error:", err));
  };

  const stopVideo = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
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
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: inputSize, scoreThreshold: 0.5 }))
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

        ctx.strokeStyle = matchedStudent ? "#22c55e" : "#ef4444";
        ctx.lineWidth = 3;
        ctx.strokeRect(box.x, box.y, box.width, box.height);

        const label = matchedStudent
          ? `${matchedStudent.name} (${matchedStudent.class})`
          : "Unknown";

        ctx.font = "16px Arial";
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(box.x, box.y - 24, ctx.measureText(label).width + 10, 20);
        ctx.fillStyle = "#fff";
        ctx.fillText(label, box.x + 5, box.y - 8);

        if (matchedStudent) recognized.push(matchedStudent);
      });

      setRecognizedList(recognized);

      requestAnimationFrame(detect);
    };

    requestAnimationFrame(detect);
  };


  const markAttendance = async () => {
    if (!recognizedList.length) return alert("No students recognized!");

    try {
      await Promise.all(
        recognizedList.map((stu) =>
          fetch("/api/mark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: stu.name,
              roll: stu.roll,
              className: stu.class,
            }),
          })
        )
      );
      alert(`Attendance marked for: ${recognizedList.map((s) => s.name).join(", ")}`);
      router.push("/ShowAllStudents");
    } catch (err) {
      console.error("Mark attendance failed:", err);
    }
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
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <button
          onClick={() => setFacingMode((prev) => (prev === "user" ? "environment" : "user"))}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition shadow-lg"
        >
           Switch Camera
        </button>

        <button
          onClick={markAttendance}
          disabled={!recognizedList.length}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 transition shadow-lg"
        >
           Mark Attendance
        </button>
      </div>

      <div className="mt-4 text-center text-gray-400 text-sm sm:text-base">
        {recognizedList.length
          ? `Recognized: ${recognizedList.map((s) => s.name).join(", ")}`
          : "Look at the camera. Multiple faces can be detected."}
      </div>
    </div>
  );
}
