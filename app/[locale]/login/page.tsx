import prisma from '@/app/utils/db';
import LoginForm from './LoginForm';

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
    const userCount = await prisma.user.count();
    const showRegister = userCount === 0;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-primary-dark">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl animate-pulse bg-primary" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl animate-pulse delay-700 bg-primary-accent" />
            </div>

            <LoginForm showRegister={showRegister} />
        </div>
    );
}
