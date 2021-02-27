import React, { FormEvent, useRef } from "react";
import "./App.css";

function App() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(searchInputRef?.current?.value);
  };
  return (
    <div className="camelize-wrapper">
      <h2 className="title">camelize</h2>
      <form className="form" noValidate onSubmit={handleSearchSubmit}>
        <input ref={searchInputRef} className="search-input" type="text" />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

export default App;
