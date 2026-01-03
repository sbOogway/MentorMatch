class BookingController {
    constructor(bookingService) {
      this.bookingService = bookingService;
  
      this.createBooking = this.createBooking.bind(this);
      this.getMyBookings = this.getMyBookings.bind(this);
      this.cancelBooking = this.cancelBooking.bind(this);
      this.completeBooking = this.completeBooking.bind(this);
      this.updateMeetingLink = this.updateMeetingLink.bind(this);
    }
  
    async createBooking(req, res, next) {
        try {
          const { slot_id, meeting_link } = req.body
          const menteeId = req.user.id
          console.log(req.user)

          const booking = await this.bookingService.createBooking({
            slotId: slot_id,
            menteeId,
            meetingLink: meeting_link
          })
      
          return res.status(201).json(booking)
        } catch (err) {
          next(err)
        }
      }
      
  
    async getMyBookings(req, res, next) {
      try {
       
        const userId = req.user.id;
        const role = req.user.role;

        const bookings = await this.bookingService.getBookingsForUser({ userId, role });
        return res.status(201).json(bookings);
      } catch (err) {
        next(err);
      }
    }
  
    async cancelBooking(req, res, next) {
      try {
        
        const role = req.user.role
        const userId = req.user.id 
        const bookingId = req.params.id

        const canceledBooking = await this.bookingService.cancelBooking({ bookingId, userId, role})
        return res.status(201).json(canceledBooking);
      } catch (err) {
        next(err);
      }
    }
  
    async completeBooking(req, res, next) {
      try {
        
        const bookingId = req.params.id
        const mentorId = req.user.id

        const completedBooking = await this.bookingService.completeBooking({ bookingId, mentorId})
        return res.status(201).json(completedBooking);
      } catch (err) {
        next(err);
      }
    }
  
    async updateMeetingLink(req, res, next) {
      try {
       
        const mentorId = req.user.id
        const meetingLink = req.body.meeting_link
        const bookingId = req.params.booking_id
        const updatedLink = await this.bookingService.updateMeetingLink({meetingLink, mentorId, bookingId})
        return res.status(201).json(updatedLink);
      } catch (err) {
        next(err);
      }
    }
  }
  
  module.exports = BookingController;
  