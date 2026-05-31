import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException, } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "src/users/entities/user.entity";

@Injectable()
export class JwtAdminGuard extends AuthGuard("jwt") {

    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }

        if (user.role !== Role.ADMIN) {
            throw new ForbiddenException("Admins Only");
        }

        return user;
    }
}