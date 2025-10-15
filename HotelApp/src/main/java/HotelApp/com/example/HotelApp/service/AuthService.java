package HotelApp.com.example.HotelApp.service;

import HotelApp.com.example.HotelApp.dto.*;
import HotelApp.com.example.HotelApp.model.User;
import HotelApp.com.example.HotelApp.model.Room;
import HotelApp.com.example.HotelApp.repository.UserRepository;
import HotelApp.com.example.HotelApp.repository.RoomRepository;
import HotelApp.com.example.HotelApp.security.JwtUtils;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final Cloudinary cloudinary;

    // -------------------- USER METHODS --------------------
    public UserResponseDTO register(UserRequestDTO dto) {
        if(userRepository.existsByEmail(dto.getEmail()))
            throw new RuntimeException("Email already exists");

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("CUSTOMER");

        userRepository.save(user);

        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public String login(LoginRequestDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if(!passwordEncoder.matches(dto.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid email or password");

        return jwtUtils.generateToken(user.getId());
    }

    public UserResponseDTO getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public UserResponseDTO updateProfile(String userId, ProfileUpdateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(dto.getName());
        if(dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        userRepository.save(user);
        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public UserResponseDTO updateRoleToSeller(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if ("CUSTOMER".equalsIgnoreCase(user.getRole())) {
            user.setRole("SELLER");
            userRepository.save(user);
        }
        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole());
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

        // Upload images to Cloudinary
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

        if(!room.getSellerId().equals(sellerId)) throw new RuntimeException("Unauthorized");

        room.setHotelName(dto.getHotelName());
        room.setLocation(dto.getLocation());
        room.setRoomType(dto.getRoomType());
        room.setPrice(dto.getPrice());
        room.setAvailable(dto.getAvailable());

        // Upload new images if provided
        if(dto.getImages() != null && !dto.getImages().isEmpty()) {
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
        if(!room.getSellerId().equals(sellerId)) throw new RuntimeException("Unauthorized");
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
}
