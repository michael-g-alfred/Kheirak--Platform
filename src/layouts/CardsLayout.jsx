import React from "react";
import CardLayout from "./CardLayout";

export default function CardsLayout({ list, children, colNum }) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${
        colNum === 3
          ? "lg:grid-cols-3"
          : colNum === 4
          ? "lg:grid-cols-4"
          : colNum === 5
          ? "lg:grid-cols-5"
          : "lg:grid-cols-2"
      } gap-6 mt-6`}>
      {list && list.length > 0
        ? list.map((item, index) => (
            <CardLayout
              key={index}
              title={item.title}
              description={item.description}
            />
          ))
        : children}
    </div>
  );
}
