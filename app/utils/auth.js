import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || '';

export const createJWT = async (user) => {
    try {
        const { phone, role, deviceId } = user;
        if( !phone || !role || !deviceId ) {
            return Error("Invalid user data");
        }
        const accessToken = jwt.sign({ phone, role, deviceId }, JWT_SECRET, { expiresIn: "30d" });

        if( !accessToken ) {
            return Error("Error creating access token");
        }
        return accessToken
    } catch (error) {
        return error
    }
}