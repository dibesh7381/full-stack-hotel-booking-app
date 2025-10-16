package HotelApp.com.example.HotelApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {
    private String id;
    private String userId;
    private String roomId;
    private String hotelName;
    private String roomType;
    private String name;
    private int age;
    private String gender;
    private String bookingDate;
    private String leavingDate; // ✅ Existing field
    private String imageUrl;     // 🔹 First room image
    private Double price;        // 🔹 Room price
    private String location;     // 🔹 Room location
}
