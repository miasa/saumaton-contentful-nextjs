import Image from 'next/image';
import styles from './page.module.css';
import { IPostFields } from '@/@types/contentful';
import ContentService from '@/util/content-service';

interface Props {
  posts: IPostFields[];
}

function Home({ posts }: Props) {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/app/page.tsx</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        {posts.map((post: IPostFields) => (
          <a key={post.slug} href={`/${post.slug}`} className={styles.card}>
            <h2>{post.title}</h2>
          </a>
        ))}
      </div>
    </main>
  )
}

export default async function Page() {
  const posts = (
    await ContentService.instance.getEntriesByType<IPostFields>("post")
  ).map((entry) => entry.fields);

  console.log('Home page', posts);

  return <Home posts={posts} />
}