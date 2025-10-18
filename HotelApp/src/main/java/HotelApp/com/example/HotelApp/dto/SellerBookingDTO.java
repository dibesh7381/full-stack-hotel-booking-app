package HotelApp.com.example.HotelApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerBookingDTO {
    private String bookingId;
    private String userName;
    private int userAge;
    private String userGender;
    private String roomType;
    private String bookingDate;
    private String leavingDate;
    private String roomImage; // 🖼️ New field added
}
