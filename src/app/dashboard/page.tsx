import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import { redirect } from "next/navigation";
import { db } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { DeleteConfirmDialog } from "@/components/ui/DeleteConfirmDialog";
import Link from "next/link";
import Image from "next/image";
import {
  PlusIcon,
  EditIcon,
  EyeIcon,
  MapIcon,
  HeartIcon,
  MessageCircleIcon,
  TrendingUpIcon,
  UserIcon,
  BarChart3Icon,
  GlobeIcon,
  StarIcon,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Use CRUD operations instead of direct Prisma calls
  const [userLoops, userStats] = await Promise.all([
    db.loops.getMany({
      userId: session.user.id,
      published: undefined, // Get both published and unpublished
      page: 1,
      limit: 20,
    }),
    db.users.getById(session.user.id),
  ]);

  const { loops } = userLoops;
  const publishedLoops = loops.filter((loop) => loop.published);
  const draftLoops = loops.filter((loop) => !loop.published);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 px-4 sm:px-8 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={56}
                        height={56}
                        className="rounded-full w-10 h-10 sm:w-14 sm:h-14"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-3xl font-bold text-white truncate">
                      Welcome back, {session.user.name?.split(" ")[0]}!
                    </h1>
                    <p className="text-blue-100 mt-1 text-sm sm:text-base">
                      Ready to create your next amazing loop?
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <LogoutButton />
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-50 shadow-lg flex-1 sm:flex-none"
                  >
                    <Link href="/dashboard/new-loop">
                      <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="hidden sm:inline">Create Loop</span>
                      <span className="sm:hidden">Create</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                  {" "}
                  Total Loops
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {userStats?._count?.loops || 0}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {publishedLoops.length} published
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                  Total Likes
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {userStats?._count?.likes || 0}
                </p>
                <p className="text-xs text-red-500 mt-1">From all loops</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                  Comments
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {userStats?._count?.comments || 0}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {" "}
                  Conversations started
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                  Engagement
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {Math.round(
                    ((userStats?._count?.likes || 0) +
                      (userStats?._count?.comments || 0)) /
                      Math.max(publishedLoops.length, 1)
                  )}
                </p>
                <p className="text-xs text-green-600 mt-1">Avg per loop</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/profile/${session?.user?.name}`}>
                  View Profile
                </Link>
              </Button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              My Profile
            </h3>
            <p className="text-gray-600 text-sm">
              Manage your public profile and see how others view your content
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <GlobeIcon className="w-6 h-6 text-purple-600" />
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/explore">Explore</Link>
              </Button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Discover More
            </h3>
            <p className="text-gray-600 text-sm">
              Find inspiration from other travelers and discover new
              destinations
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BarChart3Icon className="w-6 h-6 text-green-600" />
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analytics
            </h3>
            <p className="text-gray-600 text-sm">
              Track your loop performance and audience engagement metrics
            </p>
          </div>
        </div>
        {/* Loops Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Loops ({loops.length})
                </h2>
                <p className="text-gray-600 mt-1">
                  {publishedLoops.length} published • {draftLoops.length} drafts
                </p>
              </div>
              {loops.length > 0 && (
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/loops">View All</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/dashboard/new-loop">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      New Loop
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            {loops.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapIcon className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Create Your First Loop
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Share your favorite places and create amazing travel routes
                  for others to discover
                </p>
                <Button size="lg" asChild className="px-8">
                  <Link href="/dashboard/new-loop">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Start Creating
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loops.map((loop) => (
                  <div
                    key={loop.id}
                    className="group bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:scale-105"
                  >
                    {/* Loop Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                      {loop.coverImage ? (
                        <Image
                          src={loop.coverImage}
                          alt={loop.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapIcon className="w-16 h-16 text-white/60" />
                        </div>
                      )}

                      {/* Status Badges */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
                            loop.published
                              ? "bg-green-500/90 text-white"
                              : "bg-yellow-500/90 text-white"
                          }`}
                        >
                          {loop.published ? "Published" : "Draft"}
                        </span>
                        {loop.featured && (
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/90 text-white flex items-center gap-1">
                            <StarIcon className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Loop Content */}
                    <div className="p-6 bg-white">
                      <div className="mb-3">
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mb-1">
                          {loop.title}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
                          <MapIcon className="w-3 h-3" />
                          {loop.city}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {loop.description || "No description provided"}
                      </p>
                      {/* Tags */}
                      {loop.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {loop.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                          {loop.tags.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                              +{loop.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                      {/* Stats */}
                      <div className="flex items-center text-sm text-gray-500 mb-6 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="flex items-center gap-1">
                          <MapIcon className="w-3 h-3" />
                          {loop._count?.places || 0}
                        </span>
                        <span className="mx-3">•</span>
                        <span className="flex items-center gap-1">
                          <HeartIcon className="w-3 h-3" />
                          {loop._count?.likes || 0}
                        </span>
                        <span className="mx-3">•</span>
                        <span className="flex items-center gap-1">
                          <MessageCircleIcon className="w-3 h-3" />
                          {loop._count?.comments || 0}
                        </span>
                      </div>{" "}
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1"
                        >
                          <Link href={`/loop/${loop.slug}`}>
                            <EyeIcon className="w-3 h-3 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1"
                        >
                          <Link href={`/dashboard/edit/${loop.id}`}>
                            <EditIcon className="w-3 h-3 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <DeleteConfirmDialog
                          loopId={loop.id}
                          loopTitle={loop.title}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
