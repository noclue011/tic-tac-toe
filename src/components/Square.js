import React from "react";
import '../index.css';

  //Square components are controlled components, since Board has full control over them
  //This is a function component, which is a simpler way to write components that only contain render() methods and don't have their own state
function Square(props) {
    return (
        <button className = "square" onClick = {props.onClick}
        style = {{backgroundColor: props.style}}>
            {props.value}
        </button>
    );
}

export default Square;