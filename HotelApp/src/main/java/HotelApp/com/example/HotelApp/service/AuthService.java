package HotelApp.com.example.HotelApp.service;

import HotelApp.com.example.HotelApp.dto.*;
import HotelApp.com.example.HotelApp.model.Booking;
import HotelApp.com.example.HotelApp.model.Room;
import HotelApp.com.example.HotelApp.model.User;
import HotelApp.com.example.HotelApp.repository.BookingRepository;
import HotelApp.com.example.HotelApp.repository.RoomRepository;
import HotelApp.com.example.HotelApp.repository.UserRepository;
import HotelApp.com.example.HotelApp.security.JwtUtils;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final Cloudinary cloudinary;

    // -------------------- USER METHODS --------------------
    public UserResponseDTO register(UserRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail()))
            throw new RuntimeException("Email already exists");

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("CUSTOMER");

        userRepository.save(user);

        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getImage());
    }

    public String login(LoginRequestDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid email or password");

        return jwtUtils.generateToken(user.getId());
    }

    public UserResponseDTO getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getImage());
    }

    public UserResponseDTO updateProfile(String userId, ProfileUpdateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            try {
                Map uploadResult = cloudinary.uploader().upload(dto.getImage(), ObjectUtils.emptyMap());
                String imageUrl = uploadResult.get("secure_url").toString();
                user.setImage(imageUrl);
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload image: " + e.getMessage());
            }
        }

        userRepository.save(user);

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getImage()
        );
    }

    public UserResponseDTO updateRoleToSeller(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if ("CUSTOMER".equalsIgnoreCase(user.getRole())) {
            user.setRole("SELLER");
            userRepository.save(user);
        }
        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getImage());
    }

    // -------------------- ROOM METHODS --------------------
    public RoomResponseDTO addRoom(String sellerId, RoomRequestDTO dto) {
        Room room = new Room();
        room.setHotelName(dto.getHotelName());
        room.setLocation(dto.getLocation());
        room.setRoomType(dto.getRoomType());
        room.setPrice(dto.getPrice());
        room.setAvailable(dto.getAvailable());
        room.setSellerId(sellerId);

        List<String> uploadedUrls = dto.getImages().stream().map(img -> {
            try {
                Map uploadResult = cloudinary.uploader().upload(img, ObjectUtils.emptyMap());
                return uploadResult.get("secure_url").toString();
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload image: " + e.getMessage());
            }
        }).collect(Collectors.toList());

        room.setImages(uploadedUrls);
        Room saved = roomRepository.save(room);
        return mapRoomToDTO(saved);
    }

    public List<RoomResponseDTO> getRoomsBySeller(String sellerId) {
        return roomRepository.findBySellerId(sellerId)
                .stream()
                .map(this::mapRoomToDTO)
                .collect(Collectors.toList());
    }

    public RoomResponseDTO updateRoom(String roomId, String sellerId, RoomRequestDTO dto) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getSellerId().equals(sellerId)) throw new RuntimeException("Unauthorized");

        room.setHotelName(dto.getHotelName());
        room.setLocation(dto.getLocation());
        room.setRoomType(dto.getRoomType());
        room.setPrice(dto.getPrice());
        room.setAvailable(dto.getAvailable());

        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            List<String> uploadedUrls = dto.getImages().stream().map(img -> {
                try {
                    Map uploadResult = cloudinary.uploader().upload(img, ObjectUtils.emptyMap());
                    return uploadResult.get("secure_url").toString();
                } catch (Exception e) {
                    throw new RuntimeException("Failed to upload image: " + e.getMessage());
                }
            }).collect(Collectors.toList());
            room.setImages(uploadedUrls);
        }

        Room updated = roomRepository.save(room);
        return mapRoomToDTO(updated);
    }

    public void deleteRoom(String roomId, String sellerId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        if (!room.getSellerId().equals(sellerId)) throw new RuntimeException("Unauthorized");
        roomRepository.delete(room);
    }

    private RoomResponseDTO mapRoomToDTO(Room room) {
        RoomResponseDTO dto = new RoomResponseDTO();
        dto.setId(room.getId());
        dto.setHotelName(room.getHotelName());
        dto.setLocation(room.getLocation());
        dto.setRoomType(room.getRoomType());
        dto.setImages(room.getImages());
        dto.setPrice(room.getPrice());
        dto.setAvailable(room.getAvailable());
        dto.setSellerId(room.getSellerId());
        return dto;
    }

    public List<RoomResponseDTO> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();

        return rooms.stream()
                .map(room -> {
                    RoomResponseDTO dto = new RoomResponseDTO();
                    dto.setId(room.getId());
                    dto.setHotelName(room.getHotelName());
                    dto.setLocation(room.getLocation());
                    dto.setRoomType(room.getRoomType());
                    dto.setPrice(room.getPrice());
                    dto.setAvailable(room.getAvailable() != null ? room.getAvailable() : false);
                    dto.setImages(room.getImages());
                    dto.setSellerId(room.getSellerId());
                    return dto;
                })
                .collect(Collectors.toList());
    }


    // -------------------- BOOKING METHODS -------------------
// -------------------- BOOKING METHODS -------------------
    public BookingResponseDTO createBooking(String userId, BookingRequestDTO dto) {
        Optional<Room> roomOpt = roomRepository.findById(dto.getRoomId());
        if (roomOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found");
        }

        Room room = roomOpt.get();

        if (room.getAvailable() == null || !room.getAvailable()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room not available");
        }

        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setRoomId(room.getId());
        booking.setHotelName(room.getHotelName());
        booking.setRoomType(room.getRoomType());
        booking.setName(dto.getName());
        booking.setAge(dto.getAge());
        booking.setGender(dto.getGender());
        booking.setBookingDate(dto.getBookingDate());
        booking.setLeavingDate(dto.getLeavingDate());

        Booking saved = bookingRepository.save(booking);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String bookingDateStr = saved.getBookingDate().format(formatter);
        String leavingDateStr = saved.getLeavingDate().format(formatter);

        String imageUrl = room.getImages() != null && !room.getImages().isEmpty() ? room.getImages().get(0) : null;

        return new BookingResponseDTO(
                saved.getId(),
                saved.getUserId(),
                saved.getRoomId(),
                saved.getHotelName(),
                saved.getRoomType(),
                saved.getName(),
                saved.getAge(),
                saved.getGender(),
                bookingDateStr,
                leavingDateStr,
                imageUrl,
                room.getPrice(),    // 🔹 Add price
                room.getLocation()  // 🔹 Add location
        );
    }

    public List<BookingResponseDTO> getBookingsByUser(String userId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return bookingRepository.findByUserId(userId)
                .stream()
                .map(b -> {
                    Room room = roomRepository.findById(b.getRoomId()).orElse(null);
                    String imageUrl = null;
                    Double price = null;
                    String location = null;
                    if (room != null) {
                        if (room.getImages() != null && !room.getImages().isEmpty()) {
                            imageUrl = room.getImages().get(0);
                        }
                        price = room.getPrice();
                        location = room.getLocation();
                    }

                    return new BookingResponseDTO(
                            b.getId(),
                            b.getUserId(),
                            b.getRoomId(),
                            b.getHotelName(),
                            b.getRoomType(),
                            b.getName(),
                            b.getAge(),
                            b.getGender(),
                            b.getBookingDate().format(formatter),
                            b.getLeavingDate().format(formatter),
                            imageUrl,
                            price,      // 🔹 Add price
                            location    // 🔹 Add location
                    );
                })
                .collect(Collectors.toList());
    }

    public List<SellerBookingDTO> getBookingsForSeller(String sellerId) {
        // Pehle seller ke rooms fetch karo
        List<Room> sellerRooms = roomRepository.findBySellerId(sellerId);

        List<String> roomIds = sellerRooms.stream()
                .map(Room::getId)
                .toList();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Seller ke rooms ke bookings fetch karo
        return bookingRepository.findAll().stream()
                .filter(b -> roomIds.contains(b.getRoomId()))
                .map(b -> new SellerBookingDTO(
                        b.getId(),
                        b.getName(),       // user ka name
                        b.getAge(),
                        b.getGender(),
                        b.getRoomType(),
                        b.getBookingDate().format(formatter),
                        b.getLeavingDate().format(formatter)
                ))
                .toList();
    }



    // -------------------- DELETE BOOKING -------------------
    public void deleteBooking(String userId, String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if (!booking.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You can only cancel your own bookings");
        }

        bookingRepository.delete(booking);
    }
}
