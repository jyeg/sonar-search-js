import React from "react";
import Thumbnail from "../components/Thumbnail";
// import { Repo } from "../types";
export function Results({ repositories, initialState }) {
  return (
    <div className="results-container" data-testid="results-container">
      {repositories?.length ? (
        repositories.map((item) => (
          <Thumbnail
            key={item.id}
            id={item.id}
            image={item.owner.avatar_url}
            title={item.full_name}
            subTitle={item.description}
            stars={item.stargazers_count}
            repoLink={item.url}
          />
        ))
      ) : !initialState ? null : (
        <div>No Repos found :(</div>
      )}
    </div>
  );
}
