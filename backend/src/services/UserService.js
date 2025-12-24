const bcrypt = require("bcrypt");
const UserRepository = require("../repositories/UserRepository");

class UserService {

    async getAllUsers() {
        return await UserRepository.getAllUsers(); 
    }

    async getUserById(id) {
        const user = await UserRepository.findById(id);
        if (!user) return null;

        const { password_hash, ...safeUser } = user;
        return safeUser;
    }

    async createUser(userData) {
        const { full_name, email, password, role } = userData;

        if (!full_name || !email || !password || !role) {
            throw new Error("Missing field requirement");
        }

        if (role === "admin") {
            throw new Error("can't create admin user");
        }

        const existing = await UserRepository.findByEmail(email);
        if (existing) {
            throw { code: "USER_EXISTS", message: "Email already exists" };
        }

        const hashed = bcrypt.hashSync(password, 10);

        const newUser = await UserRepository.createUser(
            full_name,
            email,
            hashed,
            role
        );

        delete newUser.password_hash;

        return newUser;
    }

    async updateUser(id, updateData) {
        if (!id) {
            throw new Error("id not provided");
        }

        if (!updateData) {
            throw new Error("Missing update information");
        }

        // Impediamo di assegnare ruolo admin
        if (updateData.role === "admin") {
            throw new Error("can't assign admin role");
        }

        // Hash password SOLO SE fornita
        if (updateData.password) {
            updateData.password_hash = bcrypt.hashSync(updateData.password, 10);
            delete updateData.password;
        }

        const result = await UserRepository.updateUser(id, updateData);

        if (!result) return null;

        delete result.password_hash;

        return result;
    }

    async deleteUser(id) {
        if (!id) {
            throw new Error("No id provided");
        }

        const deleted = await UserRepository.deleteUser(id);
        if (!deleted) {
            throw new Error("User not found");
        }

        return deleted;
    }
}

module.exports = UserService;
