class ProfileController {
    constructor(userService) {
      this.userService = userService
  
      this.getLoggedInUserProfile = this.getLoggedInUserProfile.bind(this)
      this.updateLoggedInUserProfile = this.updateLoggedInUserProfile.bind(this)
    }
  
    async getLoggedInUserProfile(req, res, next) {
      try {
        const userId = req.user.id
        const profile = await this.userService.getUserById(userId)
        
        console.log("REQ USER:", req.user)

        if (!profile) {
          return res.status(404).json({ message: "Utente non trovato." })
        }
  
        res.json(profile)
      } catch (err) {
        next(err)
      }
    }
  
    async updateLoggedInUserProfile(req, res, next) {
      try {
        const userId = req.user.id
        const { role, ...updateDataClean } = req.body
  
        const updatedProfile =
          await this.userService.updateUser(userId, updateDataClean)
  
        res.json({
          message: "Profilo aggiornato con successo.",
          data: updatedProfile
        })
      } catch (err) {
        next(err)
      }
    }
  }
  
  module.exports = ProfileController
  