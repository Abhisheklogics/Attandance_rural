
import { getUnsyncedAttendance, markAttendanceSynced } from './indexedDB.js';

export async function syncAttendanceWhenOnline() {
  if (!navigator.onLine) return;

  const unsynced = await getUnsyncedAttendance();

  for (const record of unsynced) {
    try {
      await fetch('/api/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      await markAttendanceSynced(record.id);
      console.log('✅ Attendance synced:', record);
    } catch (err) {
      console.error('❌ Sync failed for record', record, err);
    }
  }
}


// "use client";
// import { createContext, useContext, useState, useEffect } from "react";
// import en from "@/app/locales/en/home.json";
// import hi from "@/app/locales/hi/home.json";
// import pa from "@/app/locales/pa/home.json";

// const translations = { en, hi, pa };

// const LangContext = createContext();

// export function LangProvider({ children }) {
//   const [lang, setLang] = useState("en");
//   const [t, setT] = useState(en);

//   useEffect(() => {
//     const savedLang = localStorage.getItem("preferredLang") || "en";
//     setLang(savedLang);
//     setT(translations[savedLang]);
//   }, []);

//   const changeLang = (newLang) => {
//     setLang(newLang);
//     setT(translations[newLang]);
//     localStorage.setItem("preferredLang", newLang);
//   };

//   return (
//     <LangContext.Provider value={{ lang, t, changeLang }}>
//       {children}
//     </LangContext.Provider>
//   );
// }

// export function useLang() {
//   return useContext(LangContext);
// }
// import { LangProvider } from "@/context/LangContext";

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <LangProvider>{children}</LangProvider>
//       </body>
//     </html>
//   );
// }
// import { useLang } from "@/context/LangContext";

// export default function Home() {
//   const { t } = useLang();

//   return (
//     <div>
//       <h1>{t?.title}</h1>
//       <p>{t?.subtitle}</p>
//     </div>
//   );
// }

