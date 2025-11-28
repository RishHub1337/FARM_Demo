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
    ), 
    // ^ Pending
    GET_USER_INFO: () => (
        "/user/get-user"
    ),
    UPDATE_USER_NAME: () => (
        "/user/update/fullName"
    ),
    UPDATE_PASSWORD: () => (
        "/user/update/password"
    ),
    UPDATE_BIO: () => (
        "/user/update-bio"
    ),
    GET_UNIQUE_ID_AND_BIO: () => (
        "/user/get-users-for-home"
    )
}