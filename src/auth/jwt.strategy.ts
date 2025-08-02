import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? '',
    });
  }

  validate(payload: IValidatePayload) {
    return {
      userId: payload.sub,
      username: payload.username,
    };
  }
}

interface IValidatePayload {
  sub: string;
  username: string;
}
