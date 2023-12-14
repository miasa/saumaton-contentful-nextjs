import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Document } from '@contentful/rich-text-types';

import Image from './Image';

// Create a bespoke renderOptions object to target BLOCKS.EMBEDDED_ENTRY (linked entries e.g. videoEmbed
// and BLOCKS.EMBEDDED_ASSET (linked assets e.g. images)

function renderEntry(node, children) {
  if (node.data.target.sys.contentType.sys.id === 'videoEmbed') {
    return (
      <iframe
        src={node.data.target.fields.embedUrl}
        height="100%"
        width="100%"
        frameBorder="0"
        scrolling="no"
        title={node.data.target.fields.title}
        allowFullScreen={true}
      />
    );
  }

  if (node.data.target.sys.contentType.sys.id === 'image') {
    return (
      <Image
        width={node.data.target.fields.file[0].width}
        height={node.data.target.fields.file[0].height}
        alt={node.data.target.fields.name}
        id={node.data.target.fields.file[0].public_id}
        //caption={node.data.target.fields.caption}
      />
    );
  }
}

function renderAsset(node, children) {
  console.log('renderAsset', node.data.target.fields);
  // render the EMBEDDED_ASSET as you need

  if(node.data.target.fields.file) {
    return (
      <img
        src={`https://${node.data.target.fields.file.url}`}
        height={node.data.target.fields.file.details.image.height}
        width={node.data.target.fields.file.details.image.width}
        alt={node.data.target.fields.description}
      />
    );
  }
}

const renderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: renderEntry,
    [BLOCKS.EMBEDDED_RESOURCE]: renderEntry,
    [BLOCKS.EMBEDDED_ASSET]: renderAsset,
  },
};

export default function RichTextResponse({ richTextResponse }: {richTextResponse: Document}) {
  return <>{documentToReactComponents(richTextResponse, renderOptions)}</>;
}