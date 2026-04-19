import { AuthController } from '../controllers/auth';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export const authController = new AuthController(authService);
export { authService, userRepository };
