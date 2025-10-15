package HotelApp.com.example.HotelApp.dto;

import lombok.Data;
import java.util.List;

@Data
public class RoomResponseDTO {
    private String id;
    private String hotelName;
    private String location;
    private String roomType;
    private List<String> images;
    private Double price;
    private Boolean available;
    private String sellerId;
}

