import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ConfirmSignUpDto } from './dto/confirm-sign-up.dto';
import { EmailDto } from './dto/email.dto';
import { LoginDto } from './dto/login.dto';
import { ConfirmForgotPasswordDto } from './dto/confirm-forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('confirm-sign-up')
  confirmSignUp(@Body() dto: ConfirmSignUpDto) {
    return this.authService.confirmSignUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-confirmation-code')
  resendConfirmationCode(@Body() dto: EmailDto) {
    return this.authService.resendConfirmationCode(dto.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  forgotPassword(@Body() dto: EmailDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('confirm-forgot-password')
  confirmForgotPassword(@Body() dto: ConfirmForgotPasswordDto) {
    return this.authService.confirmForgotPassword(dto);
  }
}
