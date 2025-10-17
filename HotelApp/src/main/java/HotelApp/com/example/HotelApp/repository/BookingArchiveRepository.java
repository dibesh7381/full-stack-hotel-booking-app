package HotelApp.com.example.HotelApp.repository;

import HotelApp.com.example.HotelApp.model.BookingArchive;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingArchiveRepository extends MongoRepository<BookingArchive, String> {
    List<BookingArchive> findByUserId(String userId);
}
