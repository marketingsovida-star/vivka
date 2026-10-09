import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "@/pages/home";
import { ControlPage } from "@/pages/control";
import { NightPage } from "@/pages/night";
import { SacPage } from "@/pages/sac";

/* Rola para o topo ao trocar de rota; respeita âncoras (#produtos, #faq...). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/control" element={<ControlPage />} />
        <Route path="/night" element={<NightPage />} />
        <Route path="/sac" element={<SacPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
