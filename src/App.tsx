import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import "./App.css";
import camelArray from "./resources/camelArray";
import camelTemplate from "./resources/camelTemplate";
import useOnClickOutside from "./utils/utils";
const camelCase = require("lodash.camelcase");

interface CamelWord {
  id: number;
  camelCase: string;
  description: string;
  normalized: string;
}
const initialCamelWord: CamelWord = {
  id: 0,
  camelCase: "",
  description: "",
  normalized: "",
};

function App() {
  const filterWrapperRef = useRef<any>();

  const [filter, setFilter] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<Array<CamelWord>>([]);
  const [word, setWord] = useState<CamelWord>(initialCamelWord);

  useOnClickOutside(filterWrapperRef, () => {
    setFilteredItems([]);
  });

  useEffect(() => {
    setFilteredItems({ ...camelArray });
  }, []);

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    const wordToken = e.target.value;
    const filtered = camelArray.filter((i) =>
      i?.normalized.includes(wordToken.toLowerCase()),
    );
    setFilteredItems(filtered);
    setFilter(e.target.value);
  };
  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let found;
    if (filter) {
      found = camelArray.find((i) =>
        i?.normalized.includes(camelCase(filter).toLowerCase()),
      );
      const unavailableWord = { ...camelTemplate };
      const isTruthy = found && found?.id !== 0;
      const descriptionTemplate = unavailableWord?.description?.replaceAll(
        "{{WORD}}",
        filter,
      );
      const unavailableMerged = {
        ...unavailableWord,
        camelCase: filter,
        description: descriptionTemplate,
      };

      found = isTruthy ? found : unavailableMerged;
    } else {
      found = { ...initialCamelWord };
    }
    setWord(found as CamelWord);
    setFilteredItems([...camelArray]);
    setFilter("");
  };
  const handleFilteredItemClick = (selectedWord: CamelWord) => {
    setWord(selectedWord);
    setFilteredItems([...camelArray]);
    setFilter("");
  };
  return (
    <div className="camelize-wrapper">
      <div className="form-wrapper">
        <h2 className="title">camelize</h2>
        <h4 className="subtitle">figure out how to camelize your words</h4>

        <form className="form" noValidate onSubmit={handleSearchSubmit}>
          <div className="field-group">
            <div ref={filterWrapperRef} className="search-fields">
              <input
                tabIndex={1}
                placeholder="type word to camelize..."
                type="text"
                value={filter}
                onChange={handleSearchInput}
                className={`search-input ${
                  filter?.length > 0 ? "filter-active" : ""
                }`}
              />
              {filter?.length > 0 && (
                <>
                  {filteredItems?.length > 0 && (
                    <ul tabIndex={2} className="filtered-items">
                      {filteredItems.map((i, index) => (
                        <li
                          role="button"
                          className={`item ${
                            filteredItems.length === 1 ? "single-item" : ""
                          }`}
                          onClick={() => handleFilteredItemClick(i)}
                          tabIndex={-1}
                        >
                          <span>{i.camelCase}</span>
                          {filteredItems.length === 1 && (
                            <span className="help">Press Enter ⏎</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>

            <button tabIndex={3} type="submit" className="search-button">
              Search
            </button>
          </div>
        </form>
        {word && word?.id !== 0 && word?.id !== -1 && (
          <div className="description">
            <>
              <div className="how-to-camelize">
                This is how you should 🐫 the word:
              </div>
              <div className="camel-display">"{word?.camelCase}"</div>
            </>

            <div className="explanation">
              <ReactMarkdown
                linkTarget="_blank"
                plugins={[gfm]}
                children={word?.description}
              />
            </div>
          </div>
        )}

        {word && word?.id === -1 && (
          <div className="description">
            <>
              <div className="how-to-camelize">
                This is how you should 🐫 the word:
              </div>
              <div className="camel-display">
                "{camelCase(word?.camelCase)}"
              </div>
            </>

            <div className="explanation">
              <ReactMarkdown
                linkTarget="_blank"
                plugins={[gfm]}
                children={word?.description}
              />
            </div>
          </div>
        )}

        {!word || (word?.id === 0 && <div className="description-empty" />)}
      </div>
    </div>
  );
}

export default App;
