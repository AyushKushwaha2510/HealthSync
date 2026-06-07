import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException, } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "src/users/entities/user.entity";

@Injectable()
export class JwtDoctorGuard extends AuthGuard("jwt") {

    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }

        if (user.role !== Role.DOCTOR) {
            throw new ForbiddenException("Doctors Only");
        }

        return user;
    }
}