import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const files = data.getAll('files') as File[];
        
        const uploadPromises = files.map(async (file) => {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            // Convert buffer to base64
            const base64String = buffer.toString('base64');
            const dataURI = `data:${file.type};base64,${base64String}`;
            
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: 'bloomed-products',
            });
            
            return result.secure_url;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        
        return NextResponse.json({ urls: uploadedUrls });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload images' },
            { status: 500 }
        );
    }
} 