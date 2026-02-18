import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getServerUser } from '@/app/utils/auth';

export async function POST(request: NextRequest) {
    try {
        const user = await getServerUser();
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const path = join(process.cwd(), 'public', 'uploads', filename);

        await writeFile(path, buffer);

        // Return the public URL
        const url = `/uploads/${filename}`;
        return NextResponse.json({ url }, { status: 200 });
    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
    }
}
