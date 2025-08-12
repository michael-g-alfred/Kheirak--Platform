import CardLayout from "./CardLayout";

export default function CardsLayout({
  list,
  children,
  colNum = 3,
  smEnabled = true,
}) {
  const lgCols =
    colNum === 1
      ? "lg:grid-cols-1"
      : colNum === 2
      ? "lg:grid-cols-2"
      : colNum === 3
      ? "lg:grid-cols-3"
      : colNum === 4
      ? "lg:grid-cols-4"
      : "lg:grid-cols-5";

  return (
    <div
      className={`grid grid-cols-1 ${
        smEnabled ? "sm:grid-cols-2" : ""
      } ${lgCols} gap-6 mt-6`}>
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
