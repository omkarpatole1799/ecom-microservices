import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Login to your account</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Don't have account?&nbsp;
                        <Link
                            href="/register"
                            className="font-medium text-blue-600 hover:text-blue-500">
                            Sign up
                        </Link>
                    </p>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
