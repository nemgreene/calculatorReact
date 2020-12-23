import React, { useState } from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { buttons } from "./dictionary";
import "bootstrap/dist/css/bootstrap.min.css";

const buttonMap = buttons || [];

function App() {
  //Student info under the cut
  //#region student note
  //Student note:
  //this project uses React Hooks for state management, using functional components
  //as opposed to class components, for more info :
  // https://reactjs.org/docs/hooks-intro.html

  //To not worry about that, remember a simple naming scheme for state management below:

  //const[value1, changerFunction1] = useState("inital value")

  //functionally the same as
  // this.State({ value1 : "inital value"})
  //instead of this.setState({ value1:" new state"}) format
  //we use changerFunction("new state")

  //observe naming convention for value/changer pair in my state implementation as
  //[stateVal, cStateVal]
  //as you read through just remember that any function format cStateVal("newVal")
  //updates state variable with corresponding name to "newVal"
  //#endregion
  //#region State
  //print to console
  const [val1, cPrint] = useState("");
  //store container obj to contain functor x2 and a function
  const [store, cStore] = useState({ v1: "", v2: "", f: " " });
  //on certain cases we may need second functionality on a button, this will allow for
  //this logic
  const [loop, cLoop] = useState(false);
  //memory store
  const [mem, cMem] = useState(0);
  //#endregion

  //#region Button Clcik
  const onclick = (e, func, trigger) => {
    const value = e.target.value;
    //this is the primary logic of the calc function
    //state stores val1, val2, and functor
    //if there is no functor logic writes on val1
    //else logic writes on val2

    //return context specific state changing function
    let toggle = typeof store.f === "function";
    //return conetxt specific state value
    let toggleVar = toggle ? store.v2 : store.v1;
    //return conetxt specific state changing function
    let writeFunc = (x, y) => {
      //optionally add ability to change store function with ternary
      toggle
        ? cStore({ ...store, v2: x, f: y ? y : store.f })
        : cStore({ ...store, v1: x, f: y ? y : store.f });
    };

    if (value === ".") {
      if (toggleVar.includes(".")) return;
      writeFunc(!toggleVar ? "0." : toggleVar + ".");
      cPrint(!toggleVar ? "0." : toggleVar + ".");
      return;
    }

    //master switch filter
    switch (!isNaN(value)) {
      //if number is clicked
      case true:
        //referenceing context specific state var
        //handle trailing zeros/if we want to reset start of equation]
        //if were looping on the "=", reset equation, hard code override write on v1, stop loop
        if (loop) {
          cStore({ ...store, v1: value, v2: 0, f: " " });
          cPrint(value);
          //stop loop
          cLoop(false);
          //if state == 0 or state needs to be cleared
        } else if (toggleVar === 0 || store.f === "clear") {
          //context specific change state function changes value
          //also clears function if its set on clear, or if empty, we set the function passed in
          writeFunc(value, store.f === "clear" ? " " : func);
          cPrint(value);
        } else {
          //else concat on end of state
          writeFunc(toggleVar + value);
          cPrint(toggleVar + value);
        }
        break;

      //if operator is clicked
      case false:
        //else if button is not a number
        switch (value) {
          //DEL
          case "DEL":
            //overwrite context specific state value
            if (loop) {
              cStore({
                ...store,
                v1: 0,
              });
              return;
            }
            writeFunc(
              //if there is NOT a function
              !toggle || loop
                ? //either remove last or set to zero on v1
                  store.v1.length > 1
                  ? store.v1.slice(0, -1)
                  : 0
                : //or else repeat to v2
                store.v2.length > 1
                ? store.v2.slice(0, -1)
                : 0
            );
            break;

          //memory functions
          case "MC":
            cMem(0);
            break;
          case "MS":
            cPrint(" ");
            cMem(store.v1);
            cStore({ ...store, v1: "", f: " " });
            break;
          case "M-":
            cPrint(mem - store.v1);
            cStore({ ...store, v1: mem - store.v1 });
            cLoop(true);
            break;
          case "M+":
            cPrint(mem + store.v1);
            cStore({ ...store, v1: mem + store.v1 });
            cLoop(true);
            break;
          case "MR":
            cPrint(mem);
            cStore({ ...store, v1: mem, v2: 0 });
            break;

          //clear
          case "C":
            cPrint(0);
            cStore({ v1: "", v2: "", f: " " });
            cMem(0);
            break;
          case "CE":
            cPrint("");
            if (loop) {
              cStore({ ...store, v1: 0, v2: 0 });
            } else {
              writeFunc("");
            }
            // cLoop(false);
            break;
          //equals
          case "=":
            //error catch if no function should be the last chance for this to break
            if (typeof store.f !== "function") return;
            else {
              //set print as the return of functor from state with val1 and val2 input
              cPrint(() => store.f(store.v1, store.v2));
              //prepare store to begin looping by incrementing
              cStore({ ...store, v1: store.f(store.v1, store.v2) });
              //set loop ability
              cLoop(true);
            }
            break;

          //if button has not been specified that means we pass onto the following logic
          default:
            //if function and trigger are present, run function, reset state, prepare
            //"clear" functionality
            //trigger is defined to know that we only need 1 input for our math, not 2
            if (func && trigger) {
              if (!store.v1) return;
              //run func and store in state
              //reset v2
              //set functor to clear
              cStore({ v1: func(store.v1), v2: 0, f: "clear" });
              cPrint(func(store.v1));
              cLoop(false);
            } else if (store.f && !trigger) {
              //if no trigger is passed in, we know were waiting for the second user input
              cStore({
                ...store,
                //note, if we have v1, v2, and func, assume user is chaining inputs. Calculate v1, change
                //function, reset v2
                v1:
                  store.v1 && store.v2 && func && !loop
                    ? store.f(store.v1, store.v2)
                    : store.v1,
                v2: store.v1 && store.v2 && func ? 0 : store.v2,
                //store new function in store
                f: func,
              });
              cLoop(false);
              if (store.v1 && store.v2 && func && !loop)
                cPrint(store.f(store.v1, store.v2));
            }

            break;
        }
        break;
      default:
        break;
    }
  };
  //#endregion

  //#region jsx

  return (
    <div className="App">
      <Card
        style={{
          width: "500px",
          height: "390px",
          background: "grey",
          padding: "10px",
          margin: "auto",
          marginTop: "20px",
        }}
      >
        <Card.Header
          style={{
            textAlign: "right",
            marginRight: "20px",
            marginTop: "10px",
            marginLeft: "20px",
            background: "lightGrey",
          }}
        >
          {/* <br />
          {mem}m
          <br />
          {val1}p
          <br />
          {store.v1}v1
          <br />
          {store.v2}v2
          <br /> */}
          {val1 || 0}
        </Card.Header>
        <Card.Body>
          {buttonMap.map((v, i) => {
            return (
              <div className="btn-toolbar" key={i}>
                {v.map((val, i) => {
                  return (
                    <Button
                      onClick={(e) => {
                        onclick(e, val.func, val.trigger);
                      }}
                      key={val.name}
                      value={val.name}
                      style={{
                        display: "inline-block",
                        width: val.name[0] === "M" ? "87px" : "109px",
                      }}
                    >
                      {val.name}
                    </Button>
                  );
                })}
              </div>
            );
          })}
        </Card.Body>
      </Card>
    </div>
  );
  //#endregion
}

export default App;
