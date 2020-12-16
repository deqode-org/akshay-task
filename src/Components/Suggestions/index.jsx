import React from "react";
import PropTypes from "prop-types";
import OnOutsiceClick from "react-outclick";
import "./Suggestions.css";

// The Dropdown Box
const Suggestions = ({
  suggestions,
  suggestionSelected,
  selectedIndex,
  hideSuggestions,
}) => (
  <OnOutsiceClick onOutsideClick={hideSuggestions}>
    <ul className="dropdown-menu show">
      {suggestions.map((suggestion, index) => (
        <li 
          key={suggestion}
          className={`dropdown-item ${selectedIndex === index && 'highlight'}`}
          onClick={() => suggestionSelected(suggestion)}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  </OnOutsiceClick>
);

Suggestions.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedIndex: PropTypes.number.isRequired,
  hideSuggestions: PropTypes.func.isRequired,
  suggestionSelected: PropTypes.func.isRequired,
};

export default Suggestions;
