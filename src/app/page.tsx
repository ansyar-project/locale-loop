import { Metadata } from "next";
import { db } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import LoopCard from "@/components/LoopCard";
import {
  MapIcon,
  TrendingUpIcon,
  UsersIcon,
  StarIcon,
  ArrowRightIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "LocaleLoop - Discover Authentic Local Experiences",
  description:
    "Join a community of locals sharing their favorite city spots. Discover hidden gems, authentic restaurants, and insider tips from people who know their cities best.",
  keywords: [
    "local travel guides",
    "authentic experiences",
    "city recommendations",
    "local insights",
    "travel community",
    "hidden gems",
  ],
  openGraph: {
    title: "LocaleLoop - Discover Authentic Local Experiences",
    description:
      "Join a community of locals sharing their favorite city spots. Discover hidden gems and authentic experiences.",
    type: "website",
  },
};

export default async function HomePage() {
  // Get featured and recent loops
  const [featuredLoops, recentLoops] = await Promise.all([
    db.loops.getMany({ featured: true, published: true, limit: 6 }),
    db.loops.getMany({ published: true, limit: 8 }),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center text-white">
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-8 border border-white/30">
              <StarIcon className="w-4 h-4" />
              <span>Discover Local Hidden Gems</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
              Discover Amazing Places
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Curated city guides by locals who know their cities best. Explore
              authentic experiences and hidden gems.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group px-8 py-4"
              >
                <Link href="/register" className="flex items-center gap-2">
                  Start Exploring
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white hover:text-blue-600 bg-white/10 backdrop-blur-sm transition-all duration-300 px-8 py-4"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">1,200+</div>
                <div className="text-blue-200 text-sm">City Loops</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">25K+</div>
                <div className="text-blue-200 text-sm">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">180+</div>
                <div className="text-blue-200 text-sm">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Loops */}
      {featuredLoops.loops.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-4">
                <StarIcon className="w-4 h-4" />
                <span>Featured</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Editor&apos;s Choice
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Handpicked loops that showcase the best local experiences
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredLoops.loops.map((loop) => (
                <LoopCard key={loop.id} loop={loop} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Loops */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <TrendingUpIcon className="w-4 h-4" />
              <span>Latest</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recently Added
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fresh loops from our growing community of local explorers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentLoops.loops.map((loop) => (
              <LoopCard key={loop.id} loop={loop} compact />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How LocaleLoop Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to discover or share amazing local experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Explore Loops
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Browse curated guides created by locals who know their cities
                inside out
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <UsersIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Follow Routes
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Follow carefully planned routes to discover hidden gems and
                local favorites
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <StarIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Share & Create
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create your own loops and share your local knowledge with fellow
                travelers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Amazing Loops Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <MapIcon className="w-4 h-4" />
            <span>Explore</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Discover Amazing Loops
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Browse through thousands of travel loops created by our community of
            passionate local explorers
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group px-8 py-4"
          >
            <Link href="/explore" className="flex items-center gap-2">
              Explore All Loops
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-6 border border-white/30">
            <UsersIcon className="w-4 h-4" />
            <span>Join Our Community</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Share Your Local Knowledge?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create your own curated guide and help travelers discover hidden
            gems in your city. Join thousands of local experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group px-8 py-4"
            >
              <Link href="/register" className="flex items-center gap-2">
                Create Your First Loop
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white hover:text-blue-600 bg-white/10 backdrop-blur-sm transition-all duration-300 px-8 py-4"
            >
              <Link href="/explore">Browse Loops</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// // Loop Card Component
// interface LoopCardProps {
//   loop: any;
//   compact?: boolean;
// }

// function LoopCard({ loop, compact = false }: LoopCardProps) {
//   return (
//     <Link
//       href={`/loop/${loop.slug}`}
//       className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//     >
//       <div className={`relative ${compact ? 'h-40' : 'h-48'} bg-gray-200`}>
//         {loop.coverImage ? (
//           <Image
//             src={loop.coverImage}
//             alt={loop.title}
//             fill
//             className="object-cover group-hover:scale-105 transition-transform duration-200"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
//         )}
//         {loop.featured && (
//           <div className="absolute top-2 left-2">
//             <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-medium rounded">
//               Featured
//             </span>
//           </div>
//         )}
//       </div>

//       <div className="p-4">
//         <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
//           {loop.title}
//         </h3>

//         <div className="flex items-center text-sm text-gray-600 mb-2">
//           <MapPinIcon className="w-3 h-3 mr-1" />
//           <span>{loop.city}</span>
//         </div>

//         {!compact && (
//           <p className="text-sm text-gray-600 line-clamp-2 mb-3">
//             {loop.description}
//           </p>
//         )}

//         <div className="flex items-center justify-between">
//           <div className="flex items-center text-xs text-gray-500">
//             <UserIcon className="w-3 h-3 mr-1" />
//             <span>{loop.user.name}</span>
//           </div>

//           <div className="flex items-center gap-3 text-xs text-gray-500">
//             <div className="flex items-center">
//               <HeartIcon className="w-3 h-3 mr-1" />
//               <span>{loop._count?.likes || 0}</span>
//             </div>
//             <div className="flex items-center">
//               <MessageCircleIcon className="w-3 h-3 mr-1" />
//               <span>{loop._count?.comments || 0}</span>
//             </div>
//           </div>
//         </div>

//         {loop.tags.length > 0 && (
//             <div className="flex flex-wrap gap-1 mt-3">
//             {loop.tags.slice(0, 2).map((tag: string) => (
//               <span
//               key={tag}
//               className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
//               >
//               {tag}
//               </span>
//             ))}
//             {loop.tags.length > 2 && (
//               <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
//               +{loop.tags.length - 2}
//               </span>
//             )}
//             </div>
//         )}
//       </div>
//     </Link>
//   );
// }
