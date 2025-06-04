"use server";

import { db } from "@/lib/utils/db";
import { prisma } from "@/lib/utils/prisma";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils";
// import slugify from "slugify";

// Validation schemas

const PlaceSchema = z.object({
  name: z.string().min(1, "Place name is required"),
  description: z.string().min(1, "Place description is required"),
  category: z.string().min(1, "Category is required"),
  mapUrl: z.string().url("Valid Google Maps URL is required"),
  address: z.string().optional(),
  image: z.string().optional(),
});

const LoopSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  city: z.string().min(1, "City is required"),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  places: z.array(PlaceSchema).min(1, "At least one place is required"),
});

// Create loop with image upload
export async function createLoop(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    city: formData.get("city") as string,
    coverImage: formData.get("coverImage") as string,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    published: formData.get("published") === "true",
    places: JSON.parse((formData.get("places") as string) || "[]"),
  };

  // Validate input
  const validated = LoopSchema.parse(data);

  // Generate slug from title
  const slug = validated.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Check if slug already exists
  let finalSlug = slug;
  let counter = 1;
  while (await db.loops.getBySlug(finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }
  // Create loop
  const loop = await db.loops.create({
    title: validated.title,
    slug: finalSlug,
    description: validated.description,
    city: validated.city,
    coverImage: validated.coverImage || "",
    tags: validated.tags,
    published: validated.published,
    userId: session.user.id, // Use the authenticated user's ID from session
  });

  // Create places
  for (let i = 0; i < validated.places.length; i++) {
    const place = validated.places[i];
    await db.places.create({
      name: place.name,
      description: place.description,
      category: place.category,
      mapUrl: place.mapUrl,
      address: place.address || "",
      image: place.image || "",
      order: i + 1,
      loopId: loop.id,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/");

  return {
    success: true,
    loopId: loop.id,
    message: "Loop created successfully",
  };
}

export async function deleteLoop(loopId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const loop = await prisma.loop.findUnique({
    where: { id: loopId },
    select: { userId: true },
  });

  if (!loop || loop.userId !== session.user.id) {
    throw new Error("Not found or unauthorized");
  }

  await prisma.loop.delete({
    where: { id: loopId },
  });

  revalidatePath("/dashboard");
}

// Update loop with place management
export async function updateLoop(loopId: string, formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const existingLoop = await prisma.loop.findUnique({
    where: { id: loopId },
    select: { userId: true, slug: true },
  });

  if (!existingLoop || existingLoop.userId !== session.user.id) {
    throw new Error("Not found or unauthorized");
  }

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    city: formData.get("city") as string,
    coverImage: formData.get("coverImage") as string,
    tags: JSON.parse((formData.get("tags") as string) || "[]"),
    published: formData.get("published") === "true",
    places: JSON.parse((formData.get("places") as string) || "[]"),
  };

  // Validate input
  const validated = LoopSchema.parse(data);

  // Generate new slug if title changed
  let finalSlug = existingLoop.slug;
  const newSlug = validated.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (newSlug !== existingLoop.slug) {
    // Check if new slug already exists
    finalSlug = newSlug;
    let counter = 1;
    while (await db.loops.getBySlug(finalSlug)) {
      finalSlug = `${newSlug}-${counter}`;
      counter++;
    }
  }

  // Update loop
  await db.loops.update(loopId, {
    title: validated.title,
    slug: finalSlug,
    description: validated.description,
    city: validated.city,
    coverImage: validated.coverImage || "",
    tags: validated.tags,
    published: validated.published,
  });

  // Delete existing places and recreate them (simpler than complex diff)
  await prisma.place.deleteMany({
    where: { loopId: loopId },
  });

  // Create places with new order
  for (let i = 0; i < validated.places.length; i++) {
    const place = validated.places[i];
    await db.places.create({
      name: place.name,
      description: place.description,
      category: place.category,
      mapUrl: place.mapUrl,
      address: place.address || "",
      image: place.image || "",
      order: i + 1,
      loopId: loopId,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath(`/loop/${finalSlug}`);
  revalidatePath("/");

  return {
    success: true,
    loopId: loopId,
    slug: finalSlug,
    message: "Loop updated successfully",
  };
}

// Reorder places within a loop
export async function reorderPlaces(loopId: string, placeIds: string[]) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const loop = await prisma.loop.findUnique({
    where: { id: loopId },
    select: { userId: true, slug: true },
  });

  if (!loop || loop.userId !== session.user.id) {
    throw new Error("Not found or unauthorized");
  }

  // Update place orders
  for (let i = 0; i < placeIds.length; i++) {
    await db.places.update(placeIds[i], { order: i + 1 });
  }

  revalidatePath(`/loop/${loop.slug}`);
  revalidatePath("/dashboard");

  return { success: true };
}
