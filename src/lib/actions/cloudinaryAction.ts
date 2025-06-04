"use server";


import { uploadToCloudinary } from "@/lib/utils";




// Image upload action
export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  try {
    const result = (await uploadToCloudinary(file, "locale-loop/covers")) as {
      secure_url: string;
      public_id: string;
    };
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error("Failed to upload image");
  }
}


