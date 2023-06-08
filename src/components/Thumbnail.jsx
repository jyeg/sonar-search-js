import React from "react";
// interface ThumbnailProps {
//   id: number;
//   image?: string;
//   title: string;
//   subTitle: string;
// }

// TODO: write tests for this component.
function Thumbnail({ id, title, image, subTitle, stars, url }) {
  return (
    <div className="thumbnail">
      <div className="header-container">
        <div className="image-container">
          <img className="image" src={image} alt={title} />
        </div>
        <a className="card-title" href={url}>
          {title}
        </a>
        <span className="card-stars">{stars}</span>
      </div>
      <p className="card-subTitle">{subTitle}</p>
    </div>
  );
}

export default Thumbnail;
