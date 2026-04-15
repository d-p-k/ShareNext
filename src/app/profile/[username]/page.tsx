import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/actions/profile.action";
import ProfilePageClient from "@/components/ProfilePageClient";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const user = await getProfileByUsername((await params).username);
  return {
    title: user?.name ?? user?.username,
    description: user?.bio || `Check out ${user?.username}'s profile.`,
  };
}

async function ProfilePageServer({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const user = await getProfileByUsername((await params).username);
  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}

export default ProfilePageServer;
