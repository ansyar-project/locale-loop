import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils";
import { redirect } from "next/navigation";
import { db } from "@/lib/utils/db";
import EditLoopForm from "@/components/forms/EditLoopForm";
import { ArrowLeft, EditIcon } from "lucide-react";
import Link from "next/link";

interface EditLoopPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditLoopPage({ params }: EditLoopPageProps) {
  // Await the params to get the actual values
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch the loop with places - now using the awaited id
  const loop = await db.loops.getById(id);

  if (!loop) {
    redirect("/dashboard");
  }

  // Verify ownership
  if (loop.userId !== session.user.id) {
    redirect("/dashboard");
  }

  // Fetch places for this loop - now using the awaited id
  const places = await db.places.getByLoopId(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-green-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <EditIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Loop</h1>
              <p className="text-white/80">
                Update your travel loop details and places
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg">
          <EditLoopForm
            loop={loop}
            places={places.map((place) => ({
              ...place,
              address: place.address === null ? undefined : place.address,
              image: place.image === null ? undefined : place.image,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
