import React from "react";
import { motion } from "framer-motion";
import "./App.css";

export default function App() {
  return (
    <div className="container">
      <motion.div
        className="box"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.2 }}
      >
        Hello Mateen 
      </motion.div>
    </div>
  );
}
