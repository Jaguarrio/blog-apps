import React from "react";

import BlogList from "../components/BlogList";
import Layout from "../components/Layout";
import UserList from "../components/UsersFollowingList";

const MainPage = () => {
  return (
    <Layout>
      <main className="p-5 w-full">
        <h1 className="text-xl font-semibold mb-4 hidden lg:block">Social Apps</h1>
        <article className="grid 2xl:grid-cols-[auto_minmax(auto,350px)] gap-5">
          <BlogList />
          <div className="2xl:block hidden">
            <UserList />
          </div>
        </article>
      </main>
    </Layout>
  );
};

export default MainPage;
