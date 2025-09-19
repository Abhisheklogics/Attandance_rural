'use client'

import { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

function page() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
 const router = useRouter();
  const [student, setStudent] = useState({ name: "", roll: "", class: "" });
  const [loading, setLoading] = useState(false);
  const [embeddingsArray, setEmbeddingsArray] = useState([]);

 
useEffect(() => {
  const load = async () => {
    try {
      toast.loading("Loading face detection models...");

      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"), 
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ]);

      toast.dismiss();
      toast.success("Models loaded!");
      startVideo();
    } catch (err) {
      toast.error("Failed to load models.");
      console.error(err);
    }
  };

  load();
}, []);


 
  
    function startVideo(){
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        toast.error("Camera error");
        console.error(err);
      });
  };


  useEffect(() => {
    const draw = async () => {
      if (videoRef.current && canvasRef.current) {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 })
          )
          .withFaceLandmarks();
        faceapi.matchDimensions(canvasRef.current, {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        });
        const resized = faceapi.resizeResults(detections, {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        });
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        faceapi.draw.drawDetections(canvasRef.current, resized);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      }
      requestAnimationFrame(draw);
    };
    draw();
  }, []);

 


  const capturePhoto = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        toast.error("Face not detected. Try again with better lighting.");
        return;
      }

      const embedding = Array.from(detection.descriptor);

     
      if (
        embeddingsArray.some(
          (e) => faceapi.euclideanDistance(e, embedding) < 0.35
        )
      ) {
        toast("Please move slightly for a different angle.", { icon: "↔️" });
        return;
      }

      const updatedEmbeddings = [...embeddingsArray, embedding];
      setEmbeddingsArray(updatedEmbeddings);
      toast.success(`Photo captured! (${updatedEmbeddings.length}/2)`);

    if (embeddingsArray.length + 1 === 2) {
        
        const payload = { ...student, embeddings: [...embeddingsArray, embedding] };
        const res = await fetch("/api/register-student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        alert(data.message || " Student registered successfully!");
        setEmbeddingsArray([]);
          setStudent('');
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(" Error capturing photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 sm:px-6">
  <Toaster position="top-right" />

  <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
    Student Face Registration
  </h1>

  {/* Video and Canvas Container */}
  <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-md mb-6">
    <video
      ref={videoRef}
      autoPlay
      crossOrigin="anonymous"
      width={640}
      height={480}
      muted
      className="w-full h-auto rounded-2xl"
    />
    <canvas
      ref={canvasRef}
      width={640}
      height={480}
      className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-2xl"
    />
  </div>

  {/* Student Form */}
  <form
    className="w-full max-w-md flex flex-col gap-4 bg-white shadow-lg rounded-2xl p-6"
    onSubmit={(e) => e.preventDefault()}
  >
    <input
      type="text"
      placeholder="Name"
      value={student.name}
      onChange={(e) => setStudent({ ...student, name: e.target.value })}
      required
      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
    />
    <input
      type="text"
      placeholder="Roll Number"
      value={student.roll}
      onChange={(e) => setStudent({ ...student, roll: e.target.value })}
      required
      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
    />
    <input
      type="text"
      placeholder="Class"
      value={student.class}
      onChange={(e) => setStudent({ ...student, class: e.target.value })}
      required
      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
    />
    <button
      type="button"
      onClick={capturePhoto}
      disabled={loading}
      className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-300 ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 active:scale-95"
      }`}
    >
      {loading
        ? "Capturing..."
        : `Capture Photo (${embeddingsArray.length}/2)`}
    </button>
  </form>
</div>
  );
}

export default page; 
