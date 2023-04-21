import React from "react";
import axios from "axios";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
};

export default class AppClass extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getXY = () => {
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
    return cordMap[this.state.index];
  };

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  };

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState(initialState);
  };

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  };

  move = (direction) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.

    switch (direction) {
      case "left":
        if (
          this.state.index !== 0 &&
          this.state.index !== 3 &&
          this.state.index !== 6
        ) {
          this.setState({
            ...this.state,
            steps: this.state.steps + 1,
            index: this.state.index - 1,
            message: initialMessage,
          });
        } else {
          this.setState({ ...this.state, message: "You can't go left" });
        }
        break;
      case "right":
        if (
          this.state.index !== 2 &&
          this.state.index !== 5 &&
          this.state.index !== 8
        ) {
          this.setState({
            ...this.state,
            steps: this.state.steps + 1,
            index: this.state.index + 1,
            message: initialMessage,
          });
        } else {
          this.setState({ ...this.state, message: "You can't go right" });
        }
        break;
      case "up":
        if (this.state.index > 2) {
          this.setState({
            ...this.state,
            steps: this.state.steps + 1,
            index: this.state.index - 3,
            message: initialMessage,
          });
        } else {
          this.setState({ ...this.state, message: "You can't go up" });
        }
        break;
      case "down":
        if (this.state.index < 6) {
          this.setState({
            ...this.state,
            steps: this.state.steps + 1,
            index: this.state.index + 3,
            message: initialMessage,
          });
        } else {
          this.setState({ ...this.state, message: "You can't go down" });
        }
        break;
      default:
        break;
    }
  };

  onChangeEmail = (evt) => {
    // You will need this to update the value of the input.
    this.setState({ ...this.state, email: evt.target.value });
  };

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const cord = this.getXY(this.state.index);
    const x = cord[1];
    const y = cord[3];
    const postObject = {
      x,
      y,
      steps: this.state.steps,
      email: this.state.email,
    };
    if (this.state.email.length <= 0) {
      this.setState({ ...this.state, message: "Ouch: email is required" });
    } else {
      axios
        .post(`http://localhost:9000/api/result`, postObject)
        .then((res) =>
          this.setState({ ...this.state, message: res.data.message })
        );
    }
  };

  render() {
    const { className } = this.props;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates {this.getXY()}</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? " active" : ""}`}
            >
              {idx === this.state.index ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={() => this.move("left")} id="left">
            LEFT
          </button>
          <button onClick={() => this.move("up")} id="up">
            UP
          </button>
          <button onClick={() => this.move("right")} id="right">
            RIGHT
          </button>
          <button onClick={() => this.move("down")} id="down">
            DOWN
          </button>
          <button onClick={this.reset} id="reset">
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            onChange={this.onChangeEmail}
            id="email"
            type="email"
            placeholder="type email"
          ></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}
