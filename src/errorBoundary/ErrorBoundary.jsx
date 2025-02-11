import React, { Component } from "react";

import "./errorBoundary.css";

import magnifingGlass from "../icons/magnifing_glass.png";
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorInfo: null,
    };
  }
  static getDerivedStateFromError(error) {
    // Обновляем состояние, чтобы отобразить запасной UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Ошибка в errorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main>
          <img
            src={magnifingGlass}
            alt="magnifinglass"
            className="magnifing__glass"
          />
          <h1 className="error__logo">
            M<span>K</span>
          </h1>
          <h2 className="error__message">Oops... We found an error.</h2>
          <h3 className="main__page">
            Try to reload page, or come back a little <span>later</span>
          </h3>
        </main>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
