import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    try {
        const userCookie = cookies().get('user')?.value;
        if (!userCookie) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const userData = JSON.parse(userCookie);
        const { db } = await connectToDatabase();
        
        const user = await db.collection('users').findOne({ 
            _id: new ObjectId(userData.id)
        });

        return NextResponse.json({ wishlist: user?.wishlist || [] });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const userCookie = cookies().get('user')?.value;
        if (!userCookie) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const userData = JSON.parse(userCookie);
        const { productId } = await req.json();
        const { db } = await connectToDatabase();

        // Find the user and their current wishlist
        const user = await db.collection('users').findOne({ 
            _id: new ObjectId(userData.id)
        });

        // Initialize wishlist if it doesn't exist
        const currentWishlist = user?.wishlist || [];

        // Toggle the product in the wishlist
        const updatedWishlist = currentWishlist.includes(productId)
            ? currentWishlist.filter((id: string) => id !== productId)
            : [...currentWishlist, productId];

        // Update the user's wishlist
        await db.collection('users').updateOne(
            { _id: new ObjectId(userData.id) },
            { $set: { wishlist: updatedWishlist } }
        );

        return NextResponse.json({ wishlist: updatedWishlist });
    } catch (error) {
        console.error('Error updating wishlist:', error);
        return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
    }
} 