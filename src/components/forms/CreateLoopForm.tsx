"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/ToastProvider";
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload";
import { PlaceFormSection } from "@/components/forms/PlaceFormSection";
import {
  PlusIcon,
  SaveIcon,
  MapIcon,
  ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { createLoop } from "@/lib/actions";

interface Place {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: string;
  mapUrl: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export function CreateLoopForm() {
  const router = useRouter();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    city: "",
    tags: [] as string[],
    published: false,
  });

  const [places, setPlaces] = useState<Place[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loopData = new FormData();
      loopData.append("title", formData.title);
      loopData.append("description", formData.description);
      loopData.append("coverImage", formData.coverImage);
      loopData.append("city", formData.city);
      loopData.append("tags", JSON.stringify(formData.tags));
      loopData.append("published", formData.published.toString());
      loopData.append("places", JSON.stringify(places));

      const result = await createLoop(loopData);

      if (result.success) {
        addToast({
          type: "success",
          title: "Loop Created!",
          message: "Your loop has been created successfully",
        });
        router.push(`/dashboard`);
      } else {
        addToast({
          type: "error",
          title: "Creation Failed",
          message: result.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Loop creation error:", error);
      addToast({
        type: "error",
        title: "Creation Failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addPlace = () => {
    const newPlace: Place = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      description: "",
      category: "",
      mapUrl: "",
      address: "",
    };
    setPlaces((prev) => [...prev, newPlace]);
  };

  const updatePlace = (id: string, updatedPlace: Partial<Place>) => {
    setPlaces((prev) =>
      prev.map((place) =>
        place.id === id ? { ...place, ...updatedPlace } : place
      )
    );
  };

  const removePlace = (id: string) => {
    setPlaces((prev) => prev.filter((place) => place.id !== id));
  };
  return (
    <div className="p-6 space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Basic Information
          </h2>{" "}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Loop Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Best Coffee Shops in Brooklyn"
                autoComplete="off"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., New York, London, Tokyo"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-white/90 mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your loop and what makes these places special..."
              autoComplete="off"
            />
          </div>
        </div>{" "}
        {/* Cover Image */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2" />
            Cover Image
          </h2>
          <CloudinaryUpload
            value={formData.coverImage}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, coverImage: url }))
            }
            folder="locale-loop/covers"
          />
        </div>
        {/* Tags */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Tags</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-white/80 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a tag..."
              autoComplete="off"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Add
            </button>
          </div>
        </div>{" "}
        {/* Places Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <MapIcon className="w-5 h-5 mr-2" />
              Places ({places.length})
            </h2>
            <button
              type="button"
              onClick={addPlace}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Place
            </button>
          </div>{" "}
          {places.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-white/20 rounded-xl bg-white/5">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapIcon className="w-8 h-8 text-white/60" />
              </div>
              <p className="text-white/90 mb-4 font-medium">
                No places added yet
              </p>
              <p className="text-white/60 text-sm mb-6">
                Start building your loop by adding your first amazing place
              </p>
              <button
                type="button"
                onClick={addPlace}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all mx-auto"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Your First Place
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {places.map((place, index) => (
                <div
                  key={place.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <PlaceFormSection
                    place={place}
                    index={index}
                    onUpdate={(updatedPlace) =>
                      updatePlace(place.id, updatedPlace)
                    }
                    onRemove={() => removePlace(place.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>{" "}
        {/* Publishing Options */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <SaveIcon className="w-5 h-5 mr-2" />
            Publishing Options
          </h2>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  published: e.target.checked,
                }))
              }
              className="mr-3 rounded focus:ring-blue-500"
            />
            <span className="text-white flex items-center">
              {formData.published ? (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Published (visible to everyone)
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Draft (only visible to you)
                </>
              )}
            </span>
          </label>
        </div>{" "}
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SaveIcon className="w-5 h-5 mr-2" />
            {isLoading ? "Creating..." : "Create Loop"}
          </button>
        </div>
      </form>
    </div>
  );
}
