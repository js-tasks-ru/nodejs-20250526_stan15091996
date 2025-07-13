import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { Public } from "./public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('google'))
  @Get("google")
  google() {
    return "ok";
  }

  @Public()
  @UseGuards(AuthGuard('google'))
  @Get("google/callback")
  async googleCallback(@Request() req) {
    const result: any = await this.authService.login(req.user);
    console.log('result');
    console.log(result);

    // Return an HTML payload that:
    // 1) Displays a message,
    // 2) Stores the token in localStorage,
    // 3) Redirects to /auth/profile.
    return `
    <html>
      <head>
        <title>Login Callback</title>
      </head>
      <body>
        <p>wait until login is complete</p>
        <script>
          localStorage.setItem('token', '${result.access_token}');
          window.location.href = '/';
        </script>
      </body>
    </html>
  `;
  }

  @Get("profile")
  profile(@Request() request) {
    return request.user;
  }
}
