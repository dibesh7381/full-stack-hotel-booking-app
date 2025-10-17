package HotelApp.com.example.HotelApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingArchiveDTO {
    private String id;
    private String userId;
    private String roomId;
    private String name;
    private Integer age;
    private String gender;
    private String bookingDate;
    private String leavingDate;
    private String hotelName;
    private String roomType;
    private String location;
    private Double price;
    private String status; // ✅ New
    private String imageUrl;
}

