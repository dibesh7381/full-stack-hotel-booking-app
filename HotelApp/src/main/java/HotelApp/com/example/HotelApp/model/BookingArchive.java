package HotelApp.com.example.HotelApp.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "booking_archive")
public class BookingArchive {
    @Id
    private String id;
    private String userId;
    private String roomId;
    private String name;
    private Integer age;
    private String gender;
    private LocalDate bookingDate;
    private LocalDate leavingDate;
    private String hotelName;
    private String roomType;
    private String location;
    private Double price;

    // 🔹 Status field
    private String status;  // e.g. "CANCELLED" or "COMPLETED"

    // 🔹 Image field
    private String imageUrl; // ✅ Add image URL from the room
}
