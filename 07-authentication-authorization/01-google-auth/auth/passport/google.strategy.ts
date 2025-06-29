import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/users.service";
import { User } from "users/entities/user.entity";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
    private usersService: UsersService,
  ) {
    super({
      clientID: '',
      clientSecret: '',
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['profile', 'email', 'openid'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    

    let user = await this.usersService.findOne(profile.username);
    if (!user) {
      const newProfile: User = {
        id: profile.id,
        displayName: profile.displayName,
        avatar: profile.photos[0].value,
      }
      user = await this.usersService.create(newProfile);
    }

    return user;
  }
}
