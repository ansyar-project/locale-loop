"use client";

import { useState, useTransition } from "react";
import { updateLoop } from "@/lib/actions/loopAction";
import { useToast } from "@/components/providers/ToastProvider";
import { useRouter } from "next/navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  MapPin,
  ImageIcon,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface Place {
  id?: string;
  name: string;
  description: string;
  category: string;
  mapUrl: string;
  address?: string;
  image?: string;
  order?: number;
}

interface Loop {
  id: string;
  title: string;
  description: string;
  city: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
}

interface EditLoopFormProps {
  loop: Loop;
  places: Place[];
}

export default function EditLoopForm({ loop, places }: EditLoopFormProps) {
  const [formData, setFormData] = useState({
    title: loop.title,
    description: loop.description,
    city: loop.city,
    coverImage: loop.coverImage || "",
    tags: loop.tags,
    published: loop.published,
  });

  const [formPlaces, setFormPlaces] = useState<Place[]>(places);
  const [newTag, setNewTag] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { addToast } = useToast();
  const handleInputChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleAddPlace = () => {
    const newPlace: Place = {
      name: "",
      description: "",
      category: "",
      mapUrl: "",
      address: "",
      image: "",
    };
    setFormPlaces([...formPlaces, newPlace]);
  };

  const handleRemovePlace = (index: number) => {
    setFormPlaces(formPlaces.filter((_, i) => i !== index));
  };

  const handlePlaceChange = (index: number, field: string, value: string) => {
    const updatedPlaces = [...formPlaces];
    updatedPlaces[index] = { ...updatedPlaces[index], [field]: value };
    setFormPlaces(updatedPlaces);
  };
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(formPlaces);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormPlaces(items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formPlaces.length === 0) {
      addToast({
        type: "error",
        title: "Error",
        message: "Please add at least one place",
      });
      return;
    }

    const invalidPlace = formPlaces.find(
      (place) =>
        !place.name || !place.description || !place.category || !place.mapUrl
    );
    if (invalidPlace) {
      addToast({
        type: "error",
        title: "Error",
        message: "Please fill in all required fields for each place",
      });
      return;
    }

    startTransition(async () => {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("city", formData.city);
        formDataToSend.append("coverImage", formData.coverImage);
        formDataToSend.append("tags", JSON.stringify(formData.tags));
        formDataToSend.append("published", formData.published.toString());
        formDataToSend.append("places", JSON.stringify(formPlaces));

        const result = await updateLoop(loop.id, formDataToSend);
        if (result.success) {
          addToast({
            type: "success",
            title: "Success",
            message: "Loop updated successfully!",
          });
          router.push(`/loop/${result.slug}`);
        }
      } catch (error) {
        console.error("Error updating loop:", error);
        addToast({
          type: "error",
          title: "Error",
          message: "Failed to update loop",
        });
      }
    });
  };

  return (
    <div className="p-6 space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Loop Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter loop title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter city name"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-white/90 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your loop"
              required
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2" />
            Cover Image
          </h2>

          <ImageUpload
            value={formData.coverImage}
            onChange={(url) => handleInputChange("coverImage", url)}
            onRemove={() => handleInputChange("coverImage", "")}
          />
        </div>

        {/* Tags */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Tags</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
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
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddTag())
              }
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Add
            </button>
          </div>
        </div>

        {/* Places */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Places ({formPlaces.length})
            </h2>
            <button
              type="button"
              onClick={handleAddPlace}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Place
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="places">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {formPlaces.map((place, index) => (
                    <Draggable
                      key={`place-${index}`}
                      draggableId={`place-${index}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white/5 rounded-lg p-4 border border-white/10 ${
                            snapshot.isDragging ? "shadow-lg" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div
                                {...provided.dragHandleProps}
                                className="mr-3 cursor-grab"
                              >
                                <GripVertical className="w-5 h-5 text-white/60" />
                              </div>
                              <h3 className="text-lg font-medium text-white">
                                Place {index + 1}
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePlace(index)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={place.name}
                              onChange={(e) =>
                                handlePlaceChange(index, "name", e.target.value)
                              }
                              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Place name *"
                              required
                            />
                            <input
                              type="text"
                              value={place.category}
                              onChange={(e) =>
                                handlePlaceChange(
                                  index,
                                  "category",
                                  e.target.value
                                )
                              }
                              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Category (e.g., Restaurant, Museum) *"
                              required
                            />
                          </div>

                          <textarea
                            value={place.description}
                            onChange={(e) =>
                              handlePlaceChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="w-full mt-4 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Place description *"
                            required
                          />

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                            <input
                              type="url"
                              value={place.mapUrl}
                              onChange={(e) =>
                                handlePlaceChange(
                                  index,
                                  "mapUrl",
                                  e.target.value
                                )
                              }
                              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Google Maps URL *"
                              required
                            />
                            <input
                              type="text"
                              value={place.address || ""}
                              onChange={(e) =>
                                handlePlaceChange(
                                  index,
                                  "address",
                                  e.target.value
                                )
                              }
                              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Address (optional)"
                            />
                          </div>

                          <div className="mt-4">
                            <ImageUpload
                              value={place.image || ""}
                              onChange={(url) =>
                                handlePlaceChange(index, "image", url)
                              }
                              onRemove={() =>
                                handlePlaceChange(index, "image", "")
                              }
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Publishing Options */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Publishing</h2>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => handleInputChange("published", e.target.checked)}
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
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5 mr-2" />
            {isPending ? "Updating..." : "Update Loop"}
          </button>
        </div>
      </form>
    </div>
  );
}
