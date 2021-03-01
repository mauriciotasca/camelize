import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactGA from "react-ga";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import "./Camelize.scss";
import camelArray from "./resources/camelArray";
import camelTemplate from "./resources/camelTemplate";
import { useOnClickOutside } from "./utils/utils";
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

function Camelize() {
  const filterWrapperRef = useRef<any>();
  const filterListRef = useRef<any>();
  const textInputRef = useRef<any>(null);
  const trackingId = "G-D895Y8CR9P";

  const [textInputWidth, setTextInputWidth] = useState<any>();
  const [filter, setFilter] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<Array<CamelWord>>([]);
  const [word, setWord] = useState<CamelWord>(initialCamelWord);

  useOnClickOutside(filterWrapperRef, () => {
    setFilteredItems([]);
  });

  useEffect(() => {
    ReactGA.initialize(trackingId);
    ReactGA.set({
      userAgentInfo: btoa(navigator?.userAgent),
    });
  }, []);

  useEffect(() => {
    setFilteredItems({ ...camelArray });
  }, []);

  useEffect(() => {
    setTextInputWidth(
      textInputRef.current ? textInputRef.current.offsetWidth : 0,
    );
  }, [textInputRef?.current?.offsetWidth]);

  const handleSearchButtonClick = () => {
    ReactGA.event({
      category: "searchButtonClick",
      action: "User clicked the search button",
    });
  };

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    const wordToken = e.target.value;
    const filtered = camelArray.filter((i) =>
      i?.normalized.includes(
        wordToken
          .toLowerCase()
          .split(" ")
          .join("")
          .split("-")
          .join("")
          .split("_")
          .join(""),
      ),
    );
    setFilteredItems(filtered);
    setFilter(e.target.value);
  };
  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    ReactGA.event({
      category: "searchSubmit",
      action: `User submitted the form with the "${filter}" word`,
    });
    e.preventDefault();
    let found;
    if (filter) {
      found = camelArray.find((i) =>
        i?.normalized.includes(
          camelCase(filter)
            .toLowerCase()
            .split(" ")
            .join("")
            .split("-")
            .join("")
            .split("_")
            .join(""),
        ),
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
    ReactGA.event({
      category: "filteredItemClick",
      action: `User clicked the filtered item with the "${selectedWord}" word the search button`,
    });
    setWord(selectedWord);
    setFilteredItems([...camelArray]);
    setFilter("");
  };
  return (
    <div className="camelize-wrapper d-flex align-items-center justify-content-center flex-column">
      <div className="form-wrapper mt-7">
        <div className="">
          <h2 className="title text-center">camelize</h2>
          <h4 className="subtitle text-center">
            figure out how to camelize your words
          </h4>

          <form noValidate onSubmit={handleSearchSubmit}>
            <div className="dropdown input-group" ref={filterWrapperRef}>
              <input
                ref={textInputRef}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    if (filteredItems?.length) {
                      filterListRef?.current?.children?.[0]?.focus();
                    }
                  }
                }}
                placeholder="type word to camelize..."
                type="text"
                value={filter}
                onChange={handleSearchInput}
                className={`dropdown-toggle search-input form-control ${
                  filter?.length > 0 ? "show" : ""
                } ${
                  filter?.length > 0 && filteredItems.length > 0
                    ? "filter-active"
                    : ""
                }`}
              />

              {filter?.length > 0 && (
                <>
                  <div
                    ref={filterListRef}
                    style={{ width: textInputWidth }}
                    className={`dropdown-menu mt-0 ${
                      filteredItems?.length > 0 ? "show" : ""
                    }`}
                  >
                    {filteredItems.map((i, index) => (
                      <button
                        key={i?.id}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowDown") {
                            if (
                              index + 1 <
                              filterListRef?.current?.children?.length
                            ) {
                              filterListRef?.current?.children?.[
                                index + 1
                              ].focus();
                            }
                          }
                        }}
                        onKeyUp={(e) => {
                          if (e.key === "ArrowUp") {
                            if (index - 1 >= 0) {
                              filterListRef?.current?.children?.[
                                index - 1
                              ].focus();
                            } else if (index - 1 < 0) {
                              textInputRef?.current?.focus();
                            }
                          }
                        }}
                        className={`dropdown-item d-flex justify-content-between ${
                          filteredItems.length === 1 ? "single-item" : ""
                        }`}
                        onClick={() => handleFilteredItemClick(i)}
                      >
                        <span>{i.camelCase}</span>
                        {filteredItems.length === 1 && (
                          <span className="help">Press Enter ⏎</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="input-group-append ml-3">
                <button
                  onClick={handleSearchButtonClick}
                  type="submit"
                  className="btn btn-primary"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="description-wrapper mt-5 d-flex justify-content-center">
        {word && word?.id !== 0 && word?.id !== -1 && (
          <div className="description">
            <>
              <h3 className="how-to-camelize text-center mt-5 mb-3">
                This is how you should 🐫 the word:
              </h3>
              <h2 className="camel-display text-secondary text-center">
                "{word?.camelCase}"
              </h2>
            </>

            <div className="explanation mt-4">
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
              <h3 className="how-to-camelize text-center mt-5 mb-3">
                This is how you should 🐫 the word:
              </h3>
              <h2 className="camel-display text-secondary text-center">
                "{camelCase(word?.camelCase)}"
              </h2>
            </>

            <div className="explanation mt-4">
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

export default Camelize;
