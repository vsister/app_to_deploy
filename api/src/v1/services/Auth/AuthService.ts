import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserDAO } from 'daos/UserDAO/UserDAO';
import { BadSecretException } from 'utils/exception/Auth/BadSecretException';
import { BadPasswordException } from 'utils/exception/Auth/BadPasswordException';

const { JWT_SECRET } = process.env;

export interface Credentials {
  username: string;
  password: string;
}

export class AuthService {
  private userDAO = new UserDAO();

  public async authenticate(credentials: Credentials): Promise<string> {
    const { username, password } = credentials;
    const userToAuthenticate = await this.userDAO.getOneByUsername(username);

    const passwordIsValid = await bcrypt.compare(password, userToAuthenticate.password as string);

    if (!passwordIsValid) {
      throw new BadPasswordException();
    }

    return this.generateToken(username);
  }

  private generateToken(username: string): string {
    if (!JWT_SECRET) {
      throw new BadSecretException();
    }

    return jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  }
}
