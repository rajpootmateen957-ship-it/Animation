import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./App.css";

const initialBoxes = [
  { id: "1", label: "Hello", className: "box-1" },
  { id: "2", label: "Sir",   className: "box-2" },
  { id: "3", label: "Ali",   className: "box-3" },
  { id: "4", label: "Urdu",  className: "box-4" },
  { id: "5", label: "Code",  className: "box-5" },
];

// Sortable box — sirf swap hoga, baaki move nahi karein ge
function SortableBox({ box, fallen, resetKey }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: box.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
   opacity: isDragging ? 0 : 1, // original jagah ghost hide
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      className={`box ${box.className}`}
      style={style}
      {...attributes}
      {...listeners}
      key={`${resetKey}-${box.id}`}
      initial={{ opacity: 0, y: -220 }}
      animate={
        fallen
          ? {
              opacity: 1,
             y: "60vh",
              rotate: 8,
              transition: {
                type: "spring",
                stiffness: 80,
                damping: 14,
              },
            }
          : {
              opacity: isDragging ? 0 : 1,
              y: 0,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 18,
              },
            }
      }
    >
      {box.label}
    </motion.div>
  );
}

export default function App() {
  const [boxes, setBoxes] = useState(initialBoxes);
  const [fallen, setFallen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [activeBox, setActiveBox] = useState(null); // drag overlay ke liye

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // 5px hile tab drag shuru ho
    })
  );

  const handleDragStart = (event) => {
    const box = boxes.find((b) => b.id === event.active.id);
    setActiveBox(box);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveBox(null);

    if (!over || active.id === over.id) return;

    setBoxes((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === active.id);
      const newIndex = prev.findIndex((b) => b.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleDragCancel = () => {
    setActiveBox(null); // mouse hata liya — kuch nahi hoga
  };

  const handleBtn = () => {
    if (fallen) {
      setResetKey((k) => k + 1);
      setBoxes(initialBoxes);
      setFallen(false);
    } else {
      setFallen(true);
    }
  };

  return (
    <div className="container">
      <div className="scene">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={boxes.map((b) => b.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="boxes-wrapper">
              {boxes.map((box) => (
                <SortableBox
                  key={box.id}
                  box={box}
                  fallen={fallen}
                  resetKey={resetKey}
                />
              ))}

              <motion.button
                className="fall-btn"
                onClick={handleBtn}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.93 }}
              >
                {fallen ? "↑" : "↓"}
              </motion.button>
            </div>
          </SortableContext>

          {/* Drag karte waqt floating copy */}
          <DragOverlay>
            {activeBox ? (
              <div
                className={`box ${activeBox.className} drag-overlay`}
              >
                {activeBox.label}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}