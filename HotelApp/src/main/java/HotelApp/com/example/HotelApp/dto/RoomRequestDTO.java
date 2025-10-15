package HotelApp.com.example.HotelApp.dto;

import lombok.Data;
import java.util.List;

@Data
public class RoomRequestDTO {
    private String hotelName;
    private String location;
    private String roomType; // string from frontend
    private List<String> images; // image URLs
    private Double price;
    private Boolean available;
}

