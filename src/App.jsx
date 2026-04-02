import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

const boxes = [
  { id: 1, label: "Hello", className: "box-1" },
  { id: 2, label: "Sir",   className: "box-2" },
  { id: 3, label: "Ali",   className: "box-3" },
  { id: 4, label: "box",  className: "box-4" },
  { id: 5, label: "Code",  className: "box-5" },
];

export default function App() {
  const [fallen, setFallen] = useState(false);
  const [key, setKey] = useState(0);

  const handleBtn = () => {
    if (fallen) {
      setKey(k => k + 1);
      setFallen(false);
    } else {
      setFallen(true);
    }
  };

  return (
    <div className="container">
      <div className="scene">

        <div className="boxes-wrapper">
          {boxes.map((box, i) => (
            <motion.div
              key={`${key}-${box.id}`}
              className={`box ${box.className}`}
              initial={{ opacity: 0, y: -220 }}
              animate={fallen
                ? { opacity: 1, y: "calc(100vh - 220px)", rotate: 10 }
                : { opacity: 1, y: 0, rotate: 0 }
              }
              transition={{
                type: "spring",
                stiffness: fallen ? 80 : 260,
                damping: fallen ? 14 : 18,
                delay: i * 0.12,
              }}
              whileHover={!fallen ? { scale: 1.08, rotate: 2 } : {}}
            >
              {box.label}
            </motion.div>
          ))}

          
          <button className="fall-btn" onClick={handleBtn}>
            {fallen ? "↑" : "↓"}
          </button>
        </div>

      </div>
    </div>
  );
}