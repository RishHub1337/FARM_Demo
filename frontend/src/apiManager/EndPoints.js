export const ENDPOINTS = {
    CREATE_USER: () => (
        "/auth/create-user"        
    ),
    LOGIN: () => (
        "/auth/login"
    ),
    LOGOUT: () => (
        "/auth/logout"
    ),
    SEND_OUT: () => (
        "/auth/send-otp"
    ),
    VERIFY_USER: () => (
        "/auth/verify-user"
    ),
    RESEND_OTP: () => (
        "/auth/resend-otp"
    )
}