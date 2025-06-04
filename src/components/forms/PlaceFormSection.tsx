"use client";

import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload";
import { TrashIcon, GripVerticalIcon } from "lucide-react";

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

interface PlaceFormSectionProps {
  place: Place;
  index: number;
  onUpdate: (updatedPlace: Partial<Place>) => void;
  onRemove: () => void;
}

const categories = [
  "Restaurant",
  "Cafe",
  "Bar",
  "Shop",
  "Museum",
  "Park",
  "Attraction",
  "Hotel",
  "Entertainment",
  "Other",
];

export function PlaceFormSection({
  place,
  index,
  onUpdate,
  onRemove,
}: PlaceFormSectionProps) {
  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <GripVerticalIcon className="w-5 h-5 text-white/60 mr-3 cursor-grab" />
          <h3 className="text-lg font-medium text-white">Place {index + 1}</h3>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-400 hover:text-red-300 p-1"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Place Name *
          </label>
          <input
            type="text"
            required
            value={place.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Central Perk Cafe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Category *
          </label>
          <select
            required
            value={place.category}
            onChange={(e) => onUpdate({ category: e.target.value })}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="" className="bg-gray-800 text-white">
              Select a category
            </option>
            {categories.map((category) => (
              <option
                key={category}
                value={category}
                className="bg-gray-800 text-white"
              >
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-white/90 mb-2">
          Description *
        </label>
        <textarea
          required
          rows={2}
          value={place.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="What makes this place special? Why should people visit?"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Google Maps URL *
          </label>
          <input
            type="url"
            required
            value={place.mapUrl}
            onChange={(e) => onUpdate({ mapUrl: e.target.value })}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Address
          </label>
          <input
            type="text"
            value={place.address || ""}
            onChange={(e) => onUpdate({ address: e.target.value })}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="123 Main St, City, Country"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-white/90 mb-2">
          Place Image
        </label>
        <CloudinaryUpload
          value={place.image || ""}
          onChange={(url) => onUpdate({ image: url })}
          folder="locale-loop/places"
        />
      </div>
    </div>
  );
}
