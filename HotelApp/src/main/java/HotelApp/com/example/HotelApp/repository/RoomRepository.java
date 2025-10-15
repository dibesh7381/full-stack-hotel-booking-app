package HotelApp.com.example.HotelApp.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import HotelApp.com.example.HotelApp.model.Room;
import java.util.List;

public interface RoomRepository extends MongoRepository<Room, String> {
    List<Room> findBySellerId(String sellerId);
}

