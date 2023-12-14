import { createClient } from "contentful";
import { loadEnvConfig } from '@next/env';

import { IPost } from '@/@types/contentful';

loadEnvConfig(process.cwd());

/*
 * We tell TypeScript that those environment variables are always defined.
 * If you want to learn more about this madness, read:
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONTENTFUL_SPACE_ID: string;
      CONTENTFUL_ACCESS_TOKEN: string;
      CONTENTFUL_PREVIEW_ACCESS_TOKEN: string;
    }
  }
}


export default class ContentService {
  static get instance() {
    return new ContentService();
  }

  client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });

  previewClient = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
    host: 'preview.contentful.com',
  });

  currentClient = this.client;

  setDraftMode(mode: boolean) {
    this.currentClient = mode ? this.previewClient : this.client;
  }

  async getEntriesByType<T>(type: string) {
    return (
      await this.currentClient.getEntries<T>({
        content_type: type,
      })
    ).items;
  }

  async getPostBySlug(slug: string) {
    return (
      await this.currentClient.getEntries<IPost>({
        content_type: "post",
        "fields.slug": slug,
      })
    ).items[0];
  }
}
