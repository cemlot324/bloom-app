import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req: Request) {
    try {
        const { db } = await connectToDatabase();
        
        // Get all users, excluding password field
        const users = await db.collection('users')
            .find({})
            .project({ password: 0 })
            .toArray();

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { userId } = await req.json();
        const { db } = await connectToDatabase();
        
        await db.collection('users').deleteOne({ _id: userId });
        
        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { userId, updates } = await req.json();
        const { db } = await connectToDatabase();
        
        // Remove password from updates if it exists
        const { password, ...safeUpdates } = updates;
        
        await db.collection('users').updateOne(
            { _id: userId },
            { $set: safeUpdates }
        );
        
        return NextResponse.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
} 