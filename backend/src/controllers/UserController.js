
class UserController {
    constructor(userService) {
        this.userService = userService;

        this.getAllUsers = this.getAllUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.createUser = this.createUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers()
            return res.status(200).json(users)
        } catch (error) {
            return res.status(500).json({message : error.message})
        }
    }

    async getUserById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
    
            if (isNaN(id)) {
                return res.status(400).json({ message: "User ID must be a number" });
            }
    
            const user = await this.userService.getUserById(id);
    
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    

    async createUser(req, res) {
        try {
            const data = req.body;
            const newUser = await this.userService.createUser(data);
            return res.status(201).json(newUser);
        } catch (error) {
            if (error.code === "USER_EXISTS") {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    }
    

    async updateUser(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
    
            if (isNaN(id)) {
                return res.status(400).json({ message: "User ID must be a number" });
            }
    
            const data = req.body;
            const updated = await this.userService.updateUser(id, data);
    
            if (!updated) {
                return res.status(404).json({ message: "User not found" });
            }
    
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    

    async deleteUser(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
    
            if (isNaN(id)) {
                return res.status(400).json({ message: "User ID must be a number" });
            }
    
            const deleted = await this.userService.deleteUser(id);
    
            if (!deleted) {
                return res.status(404).json({ message: "User not found" });
            }
    
            return res.status(200).json({ message: "User deleted" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
}

module.exports = UserController;
