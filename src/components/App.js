import React, { Component } from "react";
import styled, { keyframes } from "styled-components";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/themes/theme-indigo.css";
import Credit from './Credit';
import "./App.scss";
import { isNumber } from "util";

const Button = styled(AwesomeButton)`
  --button-default-border-radius: 6px;
  --button-horizontal-padding: 20px;
  /* --button-anchor-color-light: #ffffff;
  --button-anchor-color: #293b83;
  --button-anchor-color-dark: #ee3253;
  --button-secondary-color-dark: #edce31;
  --button-primary-color-dark: #edce31; */
  --button-raise-level: 3px;
  --button-hover-pressure: 2;
  --transform-speed: 0.185s;
  --button-primary-color-light: white;
  flex-basis: ${props => (props.twocell ? "50%!important" : "")};
  flex-basis: ${props => (props.threecell ? "75%" : "23%")};
  font-size: ${props => (props.threecell ? "2rem" : "3rem")};
  @media screen and (max-width: 365px) {
    font-size: 2rem;
  }
`;
const LCD = styled.div`
  width: 100%;
  position: relative;
  text-align: right;
  height: 19px;
  /* color: rgba(255, 255, 255, 0.4); */
  color: rgba(232, 234, 246, 0.5);
  font-size: 1rem;
  letter-spacing: 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
const Output = styled.div`
  width: 100%;
  text-align: right;
  color: white;
  font-size: 3rem;
  letter-spacing: 2px;
  font-weight: 700;
`;

const blinkAnimation = keyframes`
  from { opacity: 1.0; }
  to { opacity: 0.0; }
`;

const Blinker = styled.span`
  animation: ${blinkAnimation} 1s cubic-bezier(1, 0, 0, 1) infinite;
  //Basic styling
  display: inline-block;
  position: absolute;
  right: 0;
  width: 1px;
  height: 19px;
  margin-left: 10px;
  box-shadow: 0 0 10px rgba(white, 0.3);
  background: white;
  transition: all 0.3s ease;
`;

class Screen extends Component {
  render(e) {
    return (
      <div className="row screen">
        <LCD>
          <span>{this.props.lastFormula}</span>

          <Blinker />
        </LCD>

        <Output>{this.props.results}</Output>
      </div>
    );
  }
}

class App extends Component {
  state = {
    formula: [],
    results: "",
    lastFormula: [],
    areWePuttingDot: false,
    dotIterate: 0,
    wasOperatorLast: false
  };
  handleFormula = (e, currentInput) => {
    const formula = this.state.formula;
    const LastInput = formula[formula.length - 1];
    const wasOperatorLast = this.state.wasOperatorLast;
    const isCurrentInputNumber = isNumber(currentInput);
    const isLastInputNumber = isNumber(LastInput) && !wasOperatorLast;

    const isLastInputsNumbers = isCurrentInputNumber && isLastInputNumber;
    const isLastInputsOperators = !isCurrentInputNumber && !isLastInputNumber;

    const isDifferentInputs =
      (isCurrentInputNumber && !isLastInputNumber) ||
      (!isCurrentInputNumber && isLastInputNumber);

    if (isLastInputsNumbers && this.state.areWePuttingDot && !wasOperatorLast) {
      // Last inputs are Numbers and we're putting dots
      const dotIterate = this.state.dotIterate + 1;
      const lastFormula = this.state.lastFormula;
      const newNumber = LastInput + currentInput / Math.pow(10, dotIterate);
      console.log(newNumber);
      formula.pop();
      formula.push(newNumber);
      lastFormula.pop();
      lastFormula.push(newNumber);
      this.setState({ formula, lastFormula, dotIterate });
      return;
    }

    if (isCurrentInputNumber) {
      this.setState({ wasOperatorLast: false });
    } else {
      this.setState({ wasOperatorLast: true });
    }

    if (isLastInputsNumbers) {
      // Last inputs are Numbers and we're stacking numbers

      // formula
      const newNumber = `${LastInput}${currentInput}`;
      formula.pop();
      formula.push(parseInt(newNumber));

      // lastFormula

      const lastFormula = this.state.lastFormula;
      lastFormula.push(currentInput);

      // setState
      this.setState({ formula, lastFormula });
      return;
    }

    if (isLastInputsOperators) {
      // Last inputs are Operators, just abort.
      this.setState({ areWePuttingDot: false });
      return;
    }

    if (isDifferentInputs) {
      // Last inputs are different and we're changing the formula!
      const formula = this.state.formula;
      const lastFormula = this.state.lastFormula;
      formula.push(currentInput);
      lastFormula.push(currentInput);
      this.setState({
        formula,
        lastFormula,
        areWePuttingDot: false,
        dotIterate: 0
      });
      // if (!isLastInputsNumbers) {
      //   this.handleCalculation();
      // }
      return;
    }
  };
  handleClear = () => {
    const formula = [];
    const lastFormula = [];
    const results = 0;
    this.setState({ formula, results, lastFormula });
  };
  handleCalculation = () => {
    const formula = this.state.formula;
    const isLastInputOperator = isNaN(formula[formula.length - 1]);
    if (!isLastInputOperator) {
      let results = eval(this.state.formula.join(" "));
      results = parseFloat(results.toFixed(2));
      this.setState({
        results,
        formula: [results],
        lastFormula: formula,
        areWePuttingDot: false
      });
    }
  };
  handleDot = () => {
    if (this.state.wasOperatorLast) {
      console.log("wasOperatorLast!");
      return;
    }
    const lastFormula = this.state.lastFormula;
    let LastInput = lastFormula[lastFormula.length - 1];
    LastInput = LastInput.toFixed(2);
    console.log(Number(LastInput));
    lastFormula.pop();
    lastFormula.push(LastInput);
    this.setState({ areWePuttingDot: true, lastFormula });
  };
  render(e) {
    return (
      <div className="container">
        <div className="bar" />
        <Screen
          lastFormula={this.state.lastFormula}
          results={this.state.results}
        />
        <div className="calculator">
          <div className="row">
            <Button
              type="link"
              size="small"
              threecell
              id="clear"
              onPress={this.handleClear}
            >
              AC
            </Button>
            <Button
              type="secondary"
              size="small"
              onPress={e => this.handleFormula(e, "/")}
            >
              ÷
            </Button>
          </div>
          <div className="row">
            <Button
              type="primary"
              size="small"
              onPress={e => this.handleFormula(e, 7)}
            >
              7
            </Button>
            <Button
              type="primary"
              size="small"
              onPress={e => this.handleFormula(e, 8)}
            >
              8
            </Button>
            <Button
              type="primary"
              size="small"
              onPress={e => this.handleFormula(e, 9)}
            >
              9
            </Button>
            <Button
              type="secondary"
              size="small"
              onPress={e => this.handleFormula(e, "*")}
            >
              ×
            </Button>
          </div>

          <div className="row">
            <Button
              type="primary"
              size="small"
              onPress={e => this.handleFormula(e, 4)}
            >
              4
            </Button>
            <Button
              type="primary"
              size="small"
              onPress={e => this.handleFormula(e, 5)}
            >
              5
            </Button>
            <Button
              type="primary"
              size="small"
              onPress={e => this.handleFormula(e, 6)}
            >
              6
            </Button>
            <Button
              type="secondary"
              size="small"
              onPress={e => this.handleFormula(e, "-")}
            >
              -
            </Button>
          </div>

          <div className="row">
            <Button
              type="primary"
              size="small"
              onPress={e => this.handleFormula(e, 1)}
            >
              1
            </Button>
            <Button
              type="primary"
              size="small"
              onPress={e => this.handleFormula(e, 2)}
            >
              2
            </Button>
            <Button
              type="primary"
              size="small"
              onPress={e => this.handleFormula(e, 3)}
            >
              3
            </Button>
            <Button
              type="secondary"
              size="small"
              className="fix"
              onPress={e => this.handleFormula(e, "+")}
            >
              +
            </Button>
          </div>

          <div className="row">
            <Button
              type="primary"
              size="small"
              onPress={e => this.handleFormula(e, 0)}
            >
              0
            </Button>
            <Button
              type="primary"
              size="small"
              className="fix"
              onPress={this.handleDot}
            >
              .
            </Button>
            <Button
              type="secondary"
              size="small"
              twocell
              className="fix"
              onPress={this.handleCalculation}
            >
              =
            </Button>
          </div>
        </div>
        <Credit/>
      </div>
    );
  }
}

export default App;
