import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import camelArray from "./resources/camelArray.json";
import useOnClickOutside from "./utils/utils";

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

  useOnClickOutside(filterWrapperRef, () => setFilter(""));

  useEffect(() => {
    setFilteredItems(camelArray);
  }, []);

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    const wordToken = e.target.value;
    const filtered = camelArray.filter((i) =>
      i?.normalized.includes(wordToken),
    );
    setFilteredItems(filtered);
    setFilter(e.target.value);
  };
  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let found;
    if (filter) {
      found = camelArray.find((i) => i?.normalized.includes(filter));
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

        <form className="form" noValidate onSubmit={handleSearchSubmit}>
          <div className="field-group">
            <div ref={filterWrapperRef} className="search-fields">
              <input
                tabIndex={1}
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
                    <div className="filtered-items">
                      {filteredItems.map((i, index) => (
                        <div
                          role="button"
                          onClick={() => handleFilteredItemClick(i)}
                          tabIndex={2 + index}
                        >
                          {i.camelCase}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              tabIndex={filteredItems?.length + 2}
              type="submit"
              className="search-button"
            >
              Search
            </button>
          </div>
        </form>
        {word && word?.id !== 0 ? (
          <div className="description">
            <>
              <div className="how-to-camelize">
                This is how you should 🐫 the word:
              </div>
              <div className="camel-display">"{word?.camelCase}"</div>
            </>

            <div className="explanation">Description - {word?.description}</div>
          </div>
        ) : (
          <div className="description-empty" />
        )}
      </div>
    </div>
  );
}

export default App;
