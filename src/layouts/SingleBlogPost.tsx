'use client'; // Live preview
import {
  ContentfulLivePreviewProvider,
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from '@contentful/live-preview/react';

import Date from '@/components/Date';
import RichTextResponse from '@/components/RichTextResponse';
import Image from '@/components/Image';

import { IPost } from '@/@types/contentful';

interface Props {
  post: IPost;
}

function BlogPost({ post }: Props) {
  const updatedData = useContentfulLiveUpdates(post);
  const inspectorProps = useContentfulInspectorMode({ entryId: post?.sys.id });

  return (
    <>
      <main>
        <h1 {...inspectorProps({ fieldId: 'title' })}>{updatedData.fields.title}</h1>
        <span {...inspectorProps({ fieldId: 'publishDate' })}><Date dateString={updatedData.fields.publishDate} /></span>

        <p>Kategoria: <a href={`/kategoria/${updatedData.fields.category?.fields.slug}`} {...inspectorProps({ fieldId: 'category' })}>{updatedData.fields.category.fields.name}</a></p>

        <p>Avainsanat:</p>
        <ul {...inspectorProps({ fieldId: 'tags' })}>
          {updatedData.fields.tags?.map(tag => (
            <li key={tag.sys.id}><a href={`/avainsana/${tag.fields.slug}`}>{tag.fields.name}</a></li>
          ))}
        </ul>

        <div {...inspectorProps({ fieldId: 'featuredImage' })}>
          {updatedData.fields.featuredImage[0] && <Image
            width={updatedData.fields.featuredImage[0].width}
            height={updatedData.fields.featuredImage[0].height}
            id={updatedData.fields.featuredImage[0].public_id}
            alt=""
            
          />}
        </div>

        <div className="body" {...inspectorProps({ fieldId: 'content' })}>
          <RichTextResponse richTextResponse={updatedData.fields.content} />
        </div>

        <pre>
          {JSON.stringify(updatedData, null, 2)}
        </pre>
      </main>

      {updatedData.fields.allowComments && <p>TODO: comments allowed, insert comment form here</p>}

    </>
  )
}

function BlogPostWrapper({ post }: Props) {
  return (
    <ContentfulLivePreviewProvider locale="fi-FI">
      <BlogPost post={post} />
    </ContentfulLivePreviewProvider>
  )
}

export default BlogPostWrapper;