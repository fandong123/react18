import * as React from 'react';
import { createRoot } from "react-dom/client";
function getAge(state, action) {
    switch(action.type){
        case 'add':
            return state + action.value
        default:
            return state
    }
}
function MyFunctionComponent() {
  const [number, setAge] = React.useState(0);
  React.useEffect(() => {
    console.log('useEffect >> create');
    return () => {
      console.log('useEffect >> destroy');
    }
  })
  React.useLayoutEffect(() => {
    console.log('useLayoutEffect >> create');
    return () => {
      console.log('useLayoutEffect >> destroy');
    }
  })
  return <button onClick={() => {
    setAge(number + 1)
  }}>{number}</button>
}
const root = createRoot(document.getElementById("root"));
root.render(<MyFunctionComponent />);