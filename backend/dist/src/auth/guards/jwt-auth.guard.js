"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const aws_jwt_verify_1 = require("aws-jwt-verify");
const client_1 = require("@prisma/client");
const users_service_1 = require("../../users/users.service");
let JwtAuthGuard = class JwtAuthGuard {
    usersService;
    verifier = aws_jwt_verify_1.CognitoJwtVerifier.create({
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        clientId: process.env.COGNITO_CLIENT_ID,
        tokenUse: 'access',
    });
    constructor(usersService) {
        this.usersService = usersService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const token = authorization?.startsWith('Bearer ')
            ? authorization.slice(7)
            : undefined;
        if (!token)
            throw new common_1.UnauthorizedException('Missing access token');
        try {
            const payload = await this.verifier.verify(token);
            const email = typeof payload.email === 'string' && payload.email
                ? payload.email
                : typeof payload.username === 'string' && payload.username
                    ? payload.username
                    : undefined;
            if (!email) {
                throw new Error('Cognito token does not contain a valid identity');
            }
            const user = await this.usersService.findOrCreateFromCognito({
                cognitoSub: payload.sub,
                email,
                name: typeof payload.name === 'string' ? payload.name : undefined,
            });
            const groups = Array.isArray(payload['cognito:groups'])
                ? payload['cognito:groups']
                : [];
            const effectiveRole = groups.includes('ADMIN') || user.role === client_1.Role.ADMIN
                ? client_1.Role.ADMIN
                : user.role;
            if (user.role !== effectiveRole) {
                await this.usersService.syncRoleFromCognito(user.id, effectiveRole);
            }
            request.user = {
                userId: user.id,
                cognitoSub: payload.sub,
                email: user.email,
                role: effectiveRole,
            };
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired Cognito access token');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map