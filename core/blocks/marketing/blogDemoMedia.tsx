import { blogDemoImage } from './demo-assets/blogDemoImages';
import type { BlogBlockProps } from './BlogBlock/BlogBlock.types';

/** Attach blog post demo covers in Storybook render() — keep out of CSF args. */
export function withBlogDemoMedia(props: BlogBlockProps): BlogBlockProps {
  return {
    ...props,
    posts: props.posts.map((post) => ({
      ...post,
      imageSrc: post.imageSrc ?? (post.id ? blogDemoImage(post.id) : undefined),
      imageAlt: post.imageAlt ?? `${post.title} — cover`,
    })),
  };
}
