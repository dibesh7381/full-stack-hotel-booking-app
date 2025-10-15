package HotelApp.com.example.HotelApp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;

@Document(collection = "rooms")
@Data
public class Room {

    @Id
    private String id;

    private String hotelName;
    private String location;

    private String roomType; // frontend se string, e.g., "Single", "Double", etc.

    private List<String> images; // image URLs

    private Double price;
    private Boolean available;

    private String sellerId; // user ID who added the room
}
