# Cloudinary Setup Guide for LocaleLoop

## Complete Cloudinary Configuration

### 1. Environment Variables Setup

The `.env.local` file has been created with placeholder values. You need to:

1. **Go to your Cloudinary Dashboard**: https://cloudinary.com/console
2. **Copy your credentials** from the dashboard
3. **Replace the placeholder values** in `.env.local`:
   ```
   CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   CLOUDINARY_API_KEY=your_actual_api_key
   CLOUDINARY_API_SECRET=your_actual_api_secret
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   ```

### 2. Create Upload Preset in Cloudinary Dashboard

The ImageUpload component uses the preset `"locale-loop-upload"`. You need to create this:

1. **Go to Settings > Upload** in your Cloudinary dashboard
2. **Click "Add upload preset"**
3. **Configure the preset**:
   - **Preset name**: `locale-loop-upload`
   - **Signing mode**: `Unsigned` (for client-side uploads)
   - **Folder**: `locale-loop` (optional, for organization)
   - **Allowed formats**: `jpg, jpeg, png, webp`
   - **Transformation**:
     - **Width**: 800
     - **Height**: 600
     - **Crop**: fill
     - **Quality**: auto
     - **Format**: auto
4. **Save the preset**

### 3. Recommended Upload Preset Settings

For optimal performance and security:

```json
{
  "name": "locale-loop-upload",
  "unsigned": true,
  "folder": "locale-loop",
  "allowed_formats": ["jpg", "jpeg", "png", "webp"],
  "transformation": [
    {
      "width": 800,
      "height": 600,
      "crop": "fill",
      "quality": "auto",
      "fetch_format": "auto"
    }
  ],
  "max_file_size": 2000000,
  "overwrite": false,
  "unique_filename": true,
  "use_filename": true
}
```

### 4. Security Considerations

- Keep your API secret secure (never expose it client-side)
- Use unsigned uploads for client-side operations
- Consider implementing server-side uploads for sensitive operations
- Set up proper CORS policies if needed

### 5. Testing the Setup

After configuration:

1. Restart your development server
2. Test image upload in the EditLoopForm
3. Check that images are uploaded to your Cloudinary account
4. Verify images display correctly in the application

### 6. Production Deployment

When deploying to production:

- Add the same environment variables to your hosting platform
- Ensure the upload preset is created in your production Cloudinary account
- Consider using signed uploads for additional security

### 7. Troubleshooting

- **Upload fails**: Check that the upload preset exists and is unsigned
- **Images don't load**: Verify NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is correct
- **CORS errors**: Check Cloudinary settings for allowed domains
- **Size limits**: Adjust max_file_size in both Cloudinary preset and component

## Current Implementation Status

✅ Cloudinary configuration file created
✅ ImageUpload component implemented with modern styling
✅ Environment variables template created
🔥 **ACTION REQUIRED**: Set up actual Cloudinary credentials and upload preset

The image upload system is fully implemented and ready to use once you complete the Cloudinary configuration steps above.
