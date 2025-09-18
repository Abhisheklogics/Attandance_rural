"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function Attendance() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [matcher, setMatcher] = useState(null);
  const [recognized, setRecognized] = useState(null);


  useEffect(() => {
    const load = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
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

      startVideo();
    };
    load();
  }, []);

  const startVideo = async () => {
  try {
    
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  } catch (err) {
    console.warn("Front camera failed, falling back:", err);

 
    try {
      const fallbackStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = fallbackStream;
      }
    } catch (err2) {
      console.error("Camera error:", err2);
      alert("Could not access camera. Check permissions or HTTPS.");
    }
  }
};

  const onPlay = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !matcher) return;

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const detect = async () => {
      if (video.paused || video.ended) return;

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resized = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let bestStudent = null;

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

        ctx.font = "18px Arial";
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(box.x, box.y - 28, ctx.measureText(label).width + 10, 24);
        ctx.fillStyle = "#fff";
        ctx.fillText(label, box.x + 5, box.y - 10);

        if (matchedStudent) bestStudent = matchedStudent;
      });

     
      setRecognized(bestStudent);

      requestAnimationFrame(detect);
    };

    requestAnimationFrame(detect);
  };

  const markAttendance = async () => {
    if (!recognized) return alert("No student recognized!");
    try {
      await fetch("/api/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: recognized.name,
          roll: recognized.roll,
          className: recognized.class,
        }),
      });
      alert(`Attendance marked for ${recognized.name}`);
    } catch (err) {
      console.error("Mark attendance failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        Smart Face Attendance
      </h1>

      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700 backdrop-blur-md">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onPlay={onPlay}
          className="w-[90vw] max-w-xl aspect-video rounded-2xl bg-black"
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      <p className="mt-4 text-sm text-gray-400">
        {recognized
          ? `Recognized: ${recognized.name} (${recognized.class})`
          : "Look at the camera to detect your face."}
      </p>

      <button
        onClick={markAttendance}
        disabled={!recognized}
        className="mt-6 px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 transition-all shadow-lg"
      >
        Mark Attendance
      </button>
    </div>
  );
}
