import { SignUpDto } from './dto/sign-up.dto';
import { ConfirmSignUpDto } from './dto/confirm-sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { ConfirmForgotPasswordDto } from './dto/confirm-forgot-password.dto';
export declare class AuthService {
    private readonly client;
    private readonly clientId;
    signUp(dto: SignUpDto): Promise<{
        confirmed: boolean;
        userSub: string | undefined;
        delivery: import("@aws-sdk/client-cognito-identity-provider").CodeDeliveryDetailsType | undefined;
    }>;
    confirmSignUp(dto: ConfirmSignUpDto): Promise<{
        confirmed: boolean;
    }>;
    resendConfirmationCode(email: string): Promise<{
        delivery: import("@aws-sdk/client-cognito-identity-provider").CodeDeliveryDetailsType | undefined;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        idToken: string | undefined;
        refreshToken: string | undefined;
        expiresIn: number | undefined;
        tokenType: string | undefined;
    }>;
    forgotPassword(email: string): Promise<{
        delivery: import("@aws-sdk/client-cognito-identity-provider").CodeDeliveryDetailsType | undefined;
    }>;
    confirmForgotPassword(dto: ConfirmForgotPasswordDto): Promise<{
        passwordReset: boolean;
    }>;
    private throwCognitoError;
}
