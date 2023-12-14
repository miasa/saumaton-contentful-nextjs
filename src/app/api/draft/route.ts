import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

import ContentService from '@/util/content-service';

export async function GET(request: Request) {
  // Parse query string parameters
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  // This secret should only be known to this route handler and the CMS
  if (secret !== process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || !slug) {
    return new Response('Invalid token', { status: 401 });
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  // getPostBySlug would implement the required fetching logic to the headless CMS
  const contentService = ContentService.instance;
  contentService.setDraftMode(true);
  const post = await contentService.getPostBySlug(slug);

  // If the slug doesn't exist prevent draft mode from being enabled
  if (!post) {
    return new Response('Invalid slug', { status: 401 });
  }

  // Enable Draft Mode by setting the cookie
  draftMode().enable();

  // Override cookie header for draft mode for usage in live-preview
  // https://github.com/vercel/next.js/issues/49927
  const cookieStore = cookies();
  const cookie = cookieStore.get('__prerender_bypass')!;
  cookies().set({
    name: '__prerender_bypass',
    value: cookie?.value,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
  });

  // Redirect to the path from the fetched post
  // We don't redirect to searchParams.slug as that might lead to open redirect vulnerabilities
  redirect(`/${post.fields.slug}`);
}
