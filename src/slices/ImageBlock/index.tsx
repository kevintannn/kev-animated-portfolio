import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ImageBlog`.
 */
export type ImageBlogProps = SliceComponentProps<Content.ImageBlogSlice>;

/**
 * Component for "ImageBlog" Slices.
 */
const ImageBlog = ({ slice }: ImageBlogProps): JSX.Element => {
  return (
    <PrismicNextImage field={slice.primary.image} imgixParams={{ w: 600 }} />
  );
};

export default ImageBlog;
