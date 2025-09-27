"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LangSwitcher() {
  const router = useRouter();
  const [lang, setLang] = useState("en");

 useEffect(() => {
  if (typeof window !== "undefined") {
    const savedLang = localStorage.getItem("preferredLang") || "en";
    setLang(savedLang);
  }
}, []);


  const changeLang = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    localStorage.setItem("preferredLang", newLang);

   
    window.location.reload();
    
  };

  return (
    <select
      onChange={changeLang}
      value={lang}
      className="mb-6 px-3 py-2 rounded bg-gray-800 text-white"
    >
      
      <option value="hi">हिंदी</option>
      <option value="pa">ਪੰਜਾਬੀ</option>
      <option value="en">English</option>
    
    </select>
  );
}
