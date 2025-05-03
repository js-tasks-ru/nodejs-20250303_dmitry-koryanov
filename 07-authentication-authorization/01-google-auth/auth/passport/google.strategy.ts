import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID:
        "209773691791-8vfi0odt8fa93vl75djve8krf6ui38u7.apps.googleusercontent.com", //process.env.GOOGLE_CLIENT_ID,
      clientSecret: "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", //process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google-redirect",
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    // done: VerifyCallback,
  ): Promise<any> {
    console.log({ profile });
    const { id, displayName, photos } = profile;
    const user = {
      id: id,
      displayName: displayName,
      avatar: photos[0].value,
      accessToken,
      refreshToken,
    };
    // done(null, user);
    return user;
  }

  redirect(comOOauth2V2Auth: string) {
    //some code here
  }

  success(result: any) {
    //some code here
  }
}
