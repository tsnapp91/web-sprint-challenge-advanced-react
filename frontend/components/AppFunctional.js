import React, { useState } from "react";
import axios from "axios";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState("");

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.

    const cordMap = {
      0: "(1,1)",
      1: "(2,1)",
      2: "(3,1)",
      3: "(1,2)",
      4: "(2,2)",
      5: "(3,2)",
      6: "(1,3)",
      7: "(2,3)",
      8: "(3,3)",
    };
    return cordMap[index];
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setIndex(initialIndex);
    setMessage(initialMessage);
    setSteps(initialSteps);
    setEmail(initialEmail);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function move(direction) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.

    switch (direction) {
      case "left":
        if (index !== 0 && index !== 3 && index !== 6) {
          setSteps(steps + 1);
          setIndex(index - 1);
          setMessage(initialMessage);
        } else {
          setMessage("You can't go left");
        }
        break;
      case "right":
        if (index !== 2 && index !== 5 && index !== 8) {
          setSteps(steps + 1);
          setIndex(index + 1);
          setMessage(initialMessage);
        } else {
          setMessage("You can't go right");
        }
        break;
      case "up":
        if (index > 2) {
          setSteps(steps + 1);
          setIndex(index - 3);
          setMessage(initialMessage);
        } else {
          setMessage("You can't go up");
        }
        break;
      case "down":
        if (index < 6) {
          setSteps(steps + 1);
          setIndex(index + 3);
          setMessage(initialMessage);
        } else {
          setMessage("You can't go down");
        }
        break;
      default:
        break;
    }
  }

  function onChangeEmail(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const cord = getXY(index);
    const x = cord[1];
    const y = cord[3];
    const postObject = { x, y, steps, email };

    axios
      .post(`http://localhost:9000/api/result`, postObject)
      .then((res) => setMessage(res.data.message))
      .finally(setEmail(""));
    console.log(email);
  }
  console.log(email);
  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates {getXY()}</h3>
        <h3 id="steps">
          You moved {steps} {steps === 1 ? "time" : "times"}
        </h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={() => move("left")} id="left">
          LEFT
        </button>
        <button onClick={() => move("up")} id="up">
          UP
        </button>
        <button onClick={() => move("right")} id="right">
          RIGHT
        </button>
        <button onClick={() => move("down")} id="down">
          DOWN
        </button>
        <button onClick={reset} id="reset">
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChangeEmail}
          id="email"
          type="email"
          placeholder="type email"
        ></input>
        <input id="Submit" type="submit"></input>
      </form>
    </div>
  );
}
