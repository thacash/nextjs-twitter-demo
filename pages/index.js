import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getTwitterUserByHandle } from "../lib/twitter";

export default function Home({ twitterEmbedsArray }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <h2>Tweets</h2>
      {twitterEmbedsArray.map((setOfTweets) => {
        return setOfTweets.map((embedData) => {
          return <div dangerouslySetInnerHTML={{ __html: embedData.html }} />;
        });
      })}
    </Layout>
  );
}

export async function getStaticProps() {
  const twitterEmbedsArray = await getTwitterUserByHandle(
    "twitterdev,twitterapi"
  );

  return {
    props: {
      twitterEmbedsArray,
    },
  };
}
