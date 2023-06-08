import React, { useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { Results } from "./Results";

export default function SearchContainer() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [hasSearched, setHasSearched] = React.useState(false);
  const [repositories, setRepositories] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 1500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchRepoText(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, page]);

  const fetchRepoText = async (term) => {
    setError(false);
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${debouncedSearchTerm}&per_page=5&page=${page}`
    );
    const data = await response.json();
    setRepositories((prev) => [...prev, ...data.items]);
    setTotalCount(data.total_count);
    setLoading(false);
  };

  const handleClearSearch = () => {
    setRepositories([]);
    setSearchTerm("");
    setPage(1);
    setHasSearched(false);
  };

  return (
    // an input that will search the github repository api and return a list of repositories
    <>
      <input
        type="text"
        onChange={(e) => {
          setLoading(true);
          setSearchTerm(e.target.value);
          setRepositories([]);
          setPage(1);
          setHasSearched(true);
        }}
        placeholder="Search for a repository"
        aria-label="Search for a repository"
        value={searchTerm}
        className="search-textbox"
        data-testid="search-input"
      />
      {/* button to clear the search */}
      <button
        className="clear-button"
        data-testid="clear-button"
        onClick={handleClearSearch}
      >
        Clear
      </button>

      {error && <div>Error...</div>}
      {searchTerm.length && loading ? (
        <div>Loading...</div>
      ) : (
        <Results repositories={repositories} initialState={hasSearched} />
      )}
      {repositories.length ? (
        <>
          <footer className="footer">
            <p className="footer-text">
              Showing {repositories.length} of {totalCount} results
            </p>
            <button
              className="load-more-button"
              data-testid="load-more-button"
              onClick={() => {
                setLoading(true);
                setPage(page + 1);
              }}
            >
              Load More
            </button>
          </footer>
        </>
      ) : null}
    </>
  );
}
