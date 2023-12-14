import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { getCldOgImageUrl } from 'next-cloudinary';

import ContentService from '@/util/content-service';
import SingleBlogPost from '@/layouts/SingleBlogPost';

const contentService = ContentService.instance;

export async function generateMetadata({ params }) {
  const { isEnabled } = draftMode();
  const { slug } = params;

  if(!slug) {
    return notFound();
  }
  
  contentService.setDraftMode(isEnabled);
  const post = await contentService.getPostBySlug(slug);

  if(!post) {
    return notFound();
  }

  return {
    title: post.fields.title,
    description: post.fields.metaDescription,
    openGraph: {
      title: post.fields.title,
      description: post.fields.metaDescription,
      type: 'article',
      section: post.fields.category.fields.name,
      tags: post.fields.tags.map(tag => tag.fields.name),
      images: getCldOgImageUrl({
        src: post.fields.featuredImage[0].public_id
      })
    },
  };
}

export default async function Page({ params }) {
  const { isEnabled } = draftMode();
  const { slug } = params;

  if(!slug) {
    return notFound();
  }

  contentService.setDraftMode(isEnabled);
  const post = await contentService.getPostBySlug(slug);

  if(!post) {
    return notFound();
  }

  console.log('Blog post page', {draftMode: isEnabled, slug, sys: post.sys});

  return <SingleBlogPost post={post} />
}