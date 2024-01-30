import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root"));
function FunctionComponent() {
  return (
    <div
      onClick={(e) => {
        console.log("ParentNodeBubble", e);
      }}
      onClickCapture={(e) => {
        console.log("ParentNodeCapture", e);
        // e.stopPropagation();
      }}
    >
      <div>课程名称：手写React高质量源码迈向高阶开发</div>
      <div
        onClick={(e) => {
          console.log("ChildNodeBubble", e);
          e.stopPropagation();
        }}
        onClickCapture={(e) => {
          console.log("ChildNodeCapture", e);
        }}
      >
        讲师：杨艺韬
      </div>
      <div>
        电子书：
        <a style={{ color: "blue" }} href="https://www.yangyitao.com/react18">
          https://www.yangyitao.com/react18
        </a>
      </div>
    </div>
  );
}
root.render(<FunctionComponent />);
console.log("index.jsx", <FunctionComponent />);
