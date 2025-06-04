import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import { redirect } from "next/navigation";
import { CreateLoopForm } from "@/components/forms/CreateLoopForm";
import Link from "next/link";
import { ArrowLeft, PlusIcon } from "lucide-react";

export default async function NewLoopPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

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
              <PlusIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Create New Loop</h1>
              <p className="text-white/80">
                Share your favorite places and create a curated city guide
              </p>
            </div>
          </div>
        </div>{" "}
        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg">
          <CreateLoopForm />
        </div>
      </div>
    </div>
  );
}
