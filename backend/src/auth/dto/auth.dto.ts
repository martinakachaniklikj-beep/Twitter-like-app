export class RegisterDto {
  email: string;
  username: string;
  password: string;
}

export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    username: string;
    // displayName?: string;
  };
}
