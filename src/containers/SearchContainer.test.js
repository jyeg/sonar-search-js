import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchContainer from "./SearchContainer";
import { useDebounce } from "../hooks/useDebounce";
import { act } from "react-dom/test-utils";

jest.mock("../hooks/useDebounce");

describe("SearchContainer", () => {
  beforeEach(() => {
    useDebounce.mockReturnValue("search-term");
    jest.spyOn(window, "fetch");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders an input field for search term and a clear button", () => {
    render(<SearchContainer />);
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("clear-button")).toBeInTheDocument();
  });

  it("renders loading state when loading is true", async () => {
    useDebounce.mockReturnValue("");
    render(<SearchContainer />);
    expect(screen.queryByText("Loading...")).toBeNull();
    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "search-term" },
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders list of repositories when repositories array is not empty", async () => {
    const fakeRepositories = [
      {
        id: "1",
        full_name: "React",
        owner: { avatar_url: "https://via.placeholder.com/150" },
        description: "A JavaScript library for building user interfaces",
        stargazers_count: 1000,
      },
      {
        id: "2",
        full_name: "Vue",
        owner: { avatar_url: "https://via.placeholder.com/150" },
        description: "A JavaScript library for building user interfaces",
        stargazers_count: 2000,
      },
    ];
    window.fetch.mockReturnValueOnce(
      Promise.resolve({
        json: () =>
          Promise.resolve({ total_count: 2, items: fakeRepositories }),
      })
    );
    render(<SearchContainer />);
    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "search-term" },
    });
    await screen.findByText("Showing 2 of 2 results");
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
  });

  it("should call handleClearSearch function when clear button is clicked", () => {
    const { getByTestId } = render(<SearchContainer />);
    const clearButton = getByTestId("clear-button");
    fireEvent.click(clearButton);
    expect(screen.getByTestId("search-input")).toHaveValue("");
  });

  it("should call fetchGitRepo function with search term and page number when search input is changed", async () => {
    render(<SearchContainer />);
    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "search-term" },
    });
    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "search/repositories?q=search-term&per_page=5&page=1"
      )
    );
  });

  it("should call fetchGitRepo function with updated page number when load more button is clicked", async () => {
    const fakeRepositories = [
      {
        id: "1",
        name: "React",
        owner: { avatar_url: "https://via.placeholder.com/150" },
        description: "A JavaScript library for building user interfaces",
        stargazers_count: 1000,
      },
    ];
    window.fetch.mockReturnValueOnce(
      Promise.resolve({
        json: () =>
          Promise.resolve({ total_count: 1, items: fakeRepositories }),
      })
    );
    render(<SearchContainer />);
    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "search-term" },
    });
    await waitFor(() => screen.findByText("Showing 1 of 1 results"));
    fireEvent.click(screen.getByTestId("load-more-button"));
    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "search/repositories?q=search-term&per_page=5&page=2"
      )
    );
  });
});
