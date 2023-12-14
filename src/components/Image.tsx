"use client";

import { CldImage } from 'next-cloudinary';

interface Props {
  width: number;
  height: number;
  alt: string;
  /** Cloudinary public_id */
  id: string;
  caption?: any; // TODO
}

function getNewHeight(originalHeight: number, originalWidth: number, newWidth: number) {
  return (originalHeight / originalWidth) * newWidth;
}

function Image({width, height, id, caption}: Props) {
  return (
    <figure>
      <CldImage
          width={1110}
          height={getNewHeight(height, width, 1110)}
          src={id}
          sizes="100vw"
          alt=""
        />
        {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export default Image;