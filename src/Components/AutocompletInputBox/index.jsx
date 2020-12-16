import React from "react";
import getSuggestions from "../../Api";
import Suggestions from "../Suggestions";
import { debounce } from "lodash";

const KEYBOARD_KEYS = {
	ENTER: 13,
	UP:	38,
	DOWN:	40,
};

class AutocompletInputBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: "",
      suggestions: [],
      selectedIndex: 0,
    };

    // Creating the ref to input for the focus
    this.inputBoxRef = React.createRef();
    this.debouncedInputChange = debounce(this.getDataFromServer, 200);
  }

  getDataFromServer = async (textToSearch) => {
    try {
      const response = await getSuggestions(textToSearch);
      this.setState({ suggestions: response, selectedIndex: 0 });
    } catch (error) {
      console.error('Got Error In Fetching Suggestion', error)
    }
  }

	onInputChanged = (event) => {
		const previousText = this.state.inputText.split(' ').slice(-1)[0];
    const textToSearch = event.target.value.split(' ').slice(-1)[0];
    
  	this.setState({ inputText: event.target.value });

		if (!!textToSearch && previousText !== textToSearch) {
      this.debouncedInputChange(textToSearch);
    } else {
      this.hideSuggestions();
    }	
	}
	
	// Maintain all selected text by appending to current state
  suggestionSelected = (suggestion) => {
    const words = this.state.inputText.split(' ')
    words.splice(words.length - 1, 1, suggestion);
    const newInputText = words.join(' ').concat(' ');
    this.setState({ inputText: newInputText });
    this.hideSuggestions();
    this.inputBoxRef.current.focus();
  }
	
	hideSuggestions = () => {
    this.setState({ suggestions: [], selectedIndex: 0 });
  }

	onKeyDown = (e) => {
    const { suggestions, selectedIndex } = this.state;
    if (suggestions.length !== 0) {
      switch(e.which) {
        case KEYBOARD_KEYS.UP: {
          const nextIndex = selectedIndex === 0 ? suggestions.length - 1 : selectedIndex - 1
          this.setState({ selectedIndex: nextIndex });
          return;
        }
        case KEYBOARD_KEYS.DOWN: {
          const nextIndex = selectedIndex === suggestions.length - 1 ? 0 : selectedIndex + 1
          this.setState({ selectedIndex: nextIndex });
          return;
        }
        case KEYBOARD_KEYS.ENTER: {
          this.suggestionSelected(suggestions[selectedIndex])
          return;
        }			
      }
    }
	}
  
  render() {
    const { inputText, suggestions, selectedIndex } = this.state;

    return (
      <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder="Search"
        value={inputText} 
				ref={this.inputBoxRef}
        onChange={this.onInputChanged}
        onKeyDown={this.onKeyDown}
        />
        {suggestions.length > 0 && (
        	<Suggestions
            suggestions={suggestions}
            selectedIndex={selectedIndex}
            hideSuggestions={this.hideSuggestions}
            suggestionSelected={this.suggestionSelected}
          />
        )}
    </div>
    );
  }
}

export default AutocompletInputBox;
