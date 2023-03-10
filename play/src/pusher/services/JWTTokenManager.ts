import { ADMIN_SOCKETS_TOKEN, SECRET_KEY } from "../enums/EnvironmentVariable";
import Jwt from "jsonwebtoken";
import { InvalidTokenError } from "../controllers/InvalidTokenError";

export interface AuthTokenData {
    identifier: string; //will be a email if logged in or an uuid if anonymous
    accessToken?: string;
    username?: string;
    locale?: string;
}
export interface AdminSocketTokenData {
    authorizedRoomIds: string[]; //the list of rooms the client is authorized to read from.
}
export const tokenInvalidException = "tokenInvalid";

export class JWTTokenManager {
    public verifyAdminSocketToken(token: string): AdminSocketTokenData {
        if (!ADMIN_SOCKETS_TOKEN) {
            throw new Error("Missing environment variable ADMIN_SOCKETS_TOKEN");
        }
        return Jwt.verify(token, ADMIN_SOCKETS_TOKEN) as AdminSocketTokenData;
    }

    public createAuthToken(identifier: string, accessToken?: string, username?: string, locale?: string): string {
        return Jwt.sign({ identifier, accessToken, username, locale }, SECRET_KEY, { expiresIn: "30d" });
    }

    public verifyJWTToken(token: string, ignoreExpiration = false): AuthTokenData {
        try {
            return Jwt.verify(token, SECRET_KEY, { ignoreExpiration }) as AuthTokenData;
        } catch (e) {
            if (e instanceof Error) {
                // FIXME: we are loosing the stacktrace here.
                throw new InvalidTokenError(e.message);
            } else {
                throw e;
            }
        }
    }
}

export const jwtTokenManager = new JWTTokenManager();
