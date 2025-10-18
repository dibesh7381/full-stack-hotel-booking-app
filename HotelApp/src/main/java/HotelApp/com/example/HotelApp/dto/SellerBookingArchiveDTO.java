package HotelApp.com.example.HotelApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SellerBookingArchiveDTO {
    private String id;
    private String userId;
    private String roomId;
    private String userName;
    private Integer userAge;
    private String userGender;
    private String bookingDate;
    private String leavingDate;
    private String hotelName;
    private String roomType;
    private String location;
    private Double price;
    private String status;
    private String roomImage;
}
