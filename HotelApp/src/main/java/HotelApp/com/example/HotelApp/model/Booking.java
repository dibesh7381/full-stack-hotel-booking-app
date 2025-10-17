package HotelApp.com.example.HotelApp.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Data
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String userId;   // kis user ne booking ki
    private String roomId;   // kis room ki booking hui

    private String name;
    private int age;
    private String gender;

    private LocalDate bookingDate; // ✅ check-in date
    private LocalDate leavingDate; // ✅ check-out date

    // Optional denormalized data (for easy display)
    private String hotelName;
    private String roomType;
    private String location;
    private Double price;
}

