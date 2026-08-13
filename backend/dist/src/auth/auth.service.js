"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
let AuthService = class AuthService {
    client = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
        region: process.env.COGNITO_REGION || 'ap-southeast-1',
    });
    clientId = process.env.COGNITO_CLIENT_ID;
    async signUp(dto) {
        try {
            const response = await this.client.send(new client_cognito_identity_provider_1.SignUpCommand({
                ClientId: this.clientId,
                Username: dto.email.trim().toLowerCase(),
                Password: dto.password,
                UserAttributes: [
                    { Name: 'email', Value: dto.email.trim().toLowerCase() },
                    { Name: 'name', Value: dto.name.trim() },
                ],
            }));
            return {
                confirmed: response.UserConfirmed ?? false,
                userSub: response.UserSub,
                delivery: response.CodeDeliveryDetails,
            };
        }
        catch (error) {
            this.throwCognitoError(error);
        }
    }
    async confirmSignUp(dto) {
        try {
            await this.client.send(new client_cognito_identity_provider_1.ConfirmSignUpCommand({
                ClientId: this.clientId,
                Username: dto.email.trim().toLowerCase(),
                ConfirmationCode: dto.code.trim(),
            }));
            return { confirmed: true };
        }
        catch (error) {
            this.throwCognitoError(error);
        }
    }
    async resendConfirmationCode(email) {
        try {
            const response = await this.client.send(new client_cognito_identity_provider_1.ResendConfirmationCodeCommand({
                ClientId: this.clientId,
                Username: email.trim().toLowerCase(),
            }));
            return { delivery: response.CodeDeliveryDetails };
        }
        catch (error) {
            this.throwCognitoError(error);
        }
    }
    async login(dto) {
        try {
            const response = await this.client.send(new client_cognito_identity_provider_1.InitiateAuthCommand({
                ClientId: this.clientId,
                AuthFlow: 'USER_PASSWORD_AUTH',
                AuthParameters: {
                    USERNAME: dto.email.trim().toLowerCase(),
                    PASSWORD: dto.password,
                },
            }));
            if (!response.AuthenticationResult?.AccessToken) {
                throw new common_1.UnauthorizedException('Cognito did not return an access token');
            }
            return {
                accessToken: response.AuthenticationResult.AccessToken,
                idToken: response.AuthenticationResult.IdToken,
                refreshToken: response.AuthenticationResult.RefreshToken,
                expiresIn: response.AuthenticationResult.ExpiresIn,
                tokenType: response.AuthenticationResult.TokenType,
            };
        }
        catch (error) {
            this.throwCognitoError(error, true);
        }
    }
    async forgotPassword(email) {
        try {
            const response = await this.client.send(new client_cognito_identity_provider_1.ForgotPasswordCommand({
                ClientId: this.clientId,
                Username: email.trim().toLowerCase(),
            }));
            return { delivery: response.CodeDeliveryDetails };
        }
        catch (error) {
            this.throwCognitoError(error);
        }
    }
    async confirmForgotPassword(dto) {
        try {
            await this.client.send(new client_cognito_identity_provider_1.ConfirmForgotPasswordCommand({
                ClientId: this.clientId,
                Username: dto.email.trim().toLowerCase(),
                ConfirmationCode: dto.code.trim(),
                Password: dto.newPassword,
            }));
            return { passwordReset: true };
        }
        catch (error) {
            this.throwCognitoError(error);
        }
    }
    throwCognitoError(error, unauthorized = false) {
        if (error instanceof common_1.UnauthorizedException)
            throw error;
        const cognitoError = error;
        const message = cognitoError.message || 'Cognito request failed';
        if (unauthorized || cognitoError.name === 'NotAuthorizedException') {
            throw new common_1.UnauthorizedException(message);
        }
        throw new common_1.BadRequestException(message);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map