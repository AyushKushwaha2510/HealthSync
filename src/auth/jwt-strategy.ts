import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayloadType } from "src/types/payload.types";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {

    constructor(private configService: ConfigService) {

        const secret = configService.get<string>("JWT_SECRET");

        if (!secret) {
            throw new Error("SECRET is not defined in environment variables");
        }

        super({
          // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          // using cookie instead to localstorage
          jwtFromRequest: ExtractJwt.fromExtractors([
            (req) => 
              req?.cookies?.accessToken,
          ]),
          ignoreExpiration: false,
          secretOrKey: secret,
        });
    }

    async validate(payload: JwtPayloadType) {
        return {
            userId: payload.userId,
            email: payload.email,
            role:payload.role
        };
    }
}