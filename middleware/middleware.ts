import { withAuth } from 'next-auth/middleware'

export default withAuth({
    callbacks: {
        authorized: ({ token, req }) => {
            // Routes admin protégées
            if (req.nextUrl.pathname.startsWith('/admin')) {
                return token?.role === 'ADMIN'
            }
            return !!token
        },
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error'
    }
})

export const config = {
    matcher: ['/admin/:path*']
}