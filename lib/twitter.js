export async function getTwitterUserByHandle(twitterHandles) {
  const endpointURL = `https://api.twitter.com/2/users/by?usernames=${twitterHandles}&user.fields=profile_image_url,url,description&expansions=pinned_tweet_id`;
  const res = await fetch(endpointURL, {
    headers: {
      Authorization: "Bearer " + process.env.TWITTER_API_TOKEN,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
  if (res.data) {
    const allUsersPromises = await res.data.map(async (user) => {
      return await getUserTweets(user.id, user.username);
    });
    const resultPromises = await Promise.all(allUsersPromises);
    return resultPromises;
  } else {
    throw new Error("Unsuccessful request");
  }
}

async function getUserTweets(userId, twitterUsername) {
  let userTweets = await getPage(userId);
  const twitterEmbedPromises = await userTweets.map(async (tweetObj) => {
    const embedUrl = `https://publish.twitter.com/oembed?url=https%3A%2F%2Ftwitter.com%2F${twitterUsername}%2Fstatus%2F${tweetObj.id}`;
    return await fetch(embedUrl).then((response) => response.json());
  });
  const twitterEmeds = await Promise.all(twitterEmbedPromises);
  return twitterEmeds;
}

const getPage = async (userId) => {
  const url = `https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=created_at&expansions=author_id&user.fields=created_at&max_results=5 `;
  try {
    const resp = await fetch(url, {
      headers: {
        Authorization: "Bearer " + process.env.TWITTER_API_TOKEN,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data.data;
      });
    return resp;
  } catch (err) {
    throw new Error(`Request failed: ${err}`);
  }
};
