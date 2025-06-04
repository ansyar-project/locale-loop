"use server";
import { cloudinary } from "@/lib/utils/cloudinary.config";

export async function uploadToCloudinary(
  file: File,
  folder: string = "locale-loop"
) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<CloudinaryResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "auto",
          transformation: [
            { width: 1200, height: 800, crop: "fill", quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result as CloudinaryResponse);
          else reject(new Error("Cloudinary upload returned no result."));
        }
      )
      .end(buffer);
  });
}



interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}


