import React, { useEffect, useState } from "react";

import "./style.css";

import getRecentPosts from "../../services/Posts/getRecentPosts";
import Spotlight from "../../components/Spotlight";
import PostList from "../../components/PostList";
import Loading from "../../components/Loading";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [retrievingPosts, setRetrievingPosts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesAmount, setPagesAmount] = useState();
  const [recentPosts, setRecentPosts] = useState([]);
  const [mostRecentPost, setMostRecentPost] = useState();

  // Get more posts based on the page
  async function handleLoadMoreButtonClick() {
    const nextPage = currentPage + 1;

    if (nextPage > pagesAmount) return;
    setRetrievingPosts(true);
    const { data: morePosts } = await getRecentPosts(nextPage);

    setCurrentPage(nextPage);
    setRecentPosts((prevPosts) => [...prevPosts, ...morePosts]);
    setRetrievingPosts(false);
  }

  // Run when the component mount
  useEffect(() => {
    // Get the most recent posts and store them
    async function getInitialPosts() {
      const { data: recentPostList, totalPages } = await getRecentPosts();
      const newestPost = recentPostList[0];

      setPagesAmount(totalPages);
      setMostRecentPost(newestPost);
      setRecentPosts((prevPosts) => [...prevPosts, ...recentPostList]);
      setLoading(false);
    }

    getInitialPosts();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container homepage">
      <Spotlight mostRecentPost={mostRecentPost} />
      <h2 className="homepage__transition-title">
        Fique por dentro dos posts mais recentes
      </h2>
      <PostList posts={recentPosts} />
      <button
        className="homepage__load-button round-borders"
        onClick={handleLoadMoreButtonClick}
        type="button"
      >
        {retrievingPosts ? "Carregando..." : "Carregar mais"}
      </button>
    </div>
  );
}
