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

    private String roomType;
    private List<String> images;
    private Double price;
    private Boolean available;
    private String sellerId;

    // ✅ Add this manually so you can use room.isAvailable()
    public boolean isAvailable() {
        return available != null && available;
    }
}
