import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import imageModel from '@/Models/image.model';
import connectToDatabase from '@/db/Dbconnect';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {

    await connectToDatabase();


    const formData = await req.formData();
    
    const image = formData.get('image');
    const price = formData.get('price') 

    if (!image || !price) {
      console.log('Image or price not provided');
      return NextResponse.json({ error: 'Image or price not provided' }, { status: 400 });
    }

    // Convert the file to a buffer for upload
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'next-cloudinary-uploads' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    console.log('Cloudinary upload result:', result);

    // Save to the database with Cloudinary URL
    const data = await imageModel.create({
      price: parseFloat(price),
      image: result.secure_url,
    });

    console.log('Saved data:', data);

    // Respond with success
    return NextResponse.json(
      {
        message: 'Upload successful',
        imageUrl: result.secure_url,
        price: parseFloat(price),
        _id: data._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}