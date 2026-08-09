import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { SignUpDto } from './dto/sign-up.dto';
import { ConfirmSignUpDto } from './dto/confirm-sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { ConfirmForgotPasswordDto } from './dto/confirm-forgot-password.dto';

@Injectable()
export class AuthService {
  private readonly client = new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION || 'ap-southeast-1',
  });
  private readonly clientId = process.env.COGNITO_CLIENT_ID!;

  async signUp(dto: SignUpDto) {
    try {
      const response = await this.client.send(new SignUpCommand({
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
    } catch (error) {
      this.throwCognitoError(error);
    }
  }

  async confirmSignUp(dto: ConfirmSignUpDto) {
    try {
      await this.client.send(new ConfirmSignUpCommand({
        ClientId: this.clientId,
        Username: dto.email.trim().toLowerCase(),
        ConfirmationCode: dto.code.trim(),
      }));
      return { confirmed: true };
    } catch (error) {
      this.throwCognitoError(error);
    }
  }

  async resendConfirmationCode(email: string) {
    try {
      const response = await this.client.send(new ResendConfirmationCodeCommand({
        ClientId: this.clientId,
        Username: email.trim().toLowerCase(),
      }));
      return { delivery: response.CodeDeliveryDetails };
    } catch (error) {
      this.throwCognitoError(error);
    }
  }

  async login(dto: LoginDto) {
    try {
      const response = await this.client.send(new InitiateAuthCommand({
        ClientId: this.clientId,
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: dto.email.trim().toLowerCase(),
          PASSWORD: dto.password,
        },
      }));
      if (!response.AuthenticationResult?.AccessToken) {
        throw new UnauthorizedException('Cognito did not return an access token');
      }
      return {
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
        expiresIn: response.AuthenticationResult.ExpiresIn,
        tokenType: response.AuthenticationResult.TokenType,
      };
    } catch (error) {
      this.throwCognitoError(error, true);
    }
  }

  async forgotPassword(email: string) {
    try {
      const response = await this.client.send(new ForgotPasswordCommand({
        ClientId: this.clientId,
        Username: email.trim().toLowerCase(),
      }));
      return { delivery: response.CodeDeliveryDetails };
    } catch (error) {
      this.throwCognitoError(error);
    }
  }

  async confirmForgotPassword(dto: ConfirmForgotPasswordDto) {
    try {
      await this.client.send(new ConfirmForgotPasswordCommand({
        ClientId: this.clientId,
        Username: dto.email.trim().toLowerCase(),
        ConfirmationCode: dto.code.trim(),
        Password: dto.newPassword,
      }));
      return { passwordReset: true };
    } catch (error) {
      this.throwCognitoError(error);
    }
  }

  private throwCognitoError(error: unknown, unauthorized = false): never {
    if (error instanceof UnauthorizedException) throw error;
    const cognitoError = error as { name?: string; message?: string };
    const message = cognitoError.message || 'Cognito request failed';
    if (unauthorized || cognitoError.name === 'NotAuthorizedException') {
      throw new UnauthorizedException(message);
    }
    throw new BadRequestException(message);
  }
}
