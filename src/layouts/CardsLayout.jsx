import React from "react";
import CardLayout from "./CardLayout";

export default function CardsLayout({ list, children, colNum, fixedCol }) {
  return (
    <div
      className={`grid ${
        fixedCol
          ? `grid-cols-${fixedCol}`
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-" +
            (colNum === 3 ? "3" : colNum === 4 ? "4" : colNum === 5 ? "5" : "2")
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
