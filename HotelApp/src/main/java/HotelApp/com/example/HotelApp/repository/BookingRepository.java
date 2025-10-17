package HotelApp.com.example.HotelApp.repository;

import HotelApp.com.example.HotelApp.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId);
    List<Booking> findByRoomId(String roomId);

    // 🔹 New method: find bookings that overlap with the given range for same room
    @Query("{ 'roomId': ?0, 'bookingDate': { $lte: ?2 }, 'leavingDate': { $gte: ?1 } }")
    List<Booking> findConflictingBookings(String roomId, LocalDate bookingDate, LocalDate leavingDate);
}

