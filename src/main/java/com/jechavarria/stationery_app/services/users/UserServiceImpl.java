package com.jechavarria.stationery_app.services.users;

import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jechavarria.stationery_app.exceptions.EmailAlreadyExistsException;
import com.jechavarria.stationery_app.exceptions.IdNotFoundException;
import com.jechavarria.stationery_app.models.dtos.dtoLogin.LoginRequest;
import com.jechavarria.stationery_app.models.dtos.dtoLogin.LoginResponse;
import com.jechavarria.stationery_app.models.dtos.dtoUsers.PublicRegisterRequest;
import com.jechavarria.stationery_app.models.dtos.dtoUsers.UserRequest;
import com.jechavarria.stationery_app.models.dtos.dtoUsers.UserResponse;
import com.jechavarria.stationery_app.models.mappers.UserMapper;
import com.jechavarria.stationery_app.repository.roles.RoleRepository;
import com.jechavarria.stationery_app.repository.users.UserRepository;
import com.jechavarria.stationery_app.services.jwt.JwtService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    // Inyeccion de dependencias
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    // Logica pra mostrar todos los usuarios
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        log.debug("Iniciando consulta de usuarios a la BD");
        var users = userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
        return users;

    }

    // Logica para crear un nuevo usuario
    @Override
    @Transactional
    public UserResponse createRegister(UserRequest userRequest) {
        log.debug("Payload recibido: idRol={}", userRequest.getIdRol());

        // verficar existencia de rol
        var role = roleRepository.findById(userRequest.getIdRol())
                .orElseThrow(() -> new IdNotFoundException(
                        "El rol con id " + userRequest.getIdRol() + " no fue encontrado"));

        // Verificar existencia de email
        var existingEmail = userRepository.findByEmail(userRequest.getEmail());
        if (existingEmail.isPresent()) {
            throw new EmailAlreadyExistsException(userRequest.getEmail());
        }

        var newEntity = userMapper.toEntity(userRequest);
        newEntity.setRole(role);

        newEntity = userRepository.save(newEntity);
        log.info("Creación de usuario exitosa: id={}", newEntity.getId());
        return userMapper.toResponse(newEntity);
    }

    @Override
    @Transactional
    public UserResponse publicRegister(PublicRegisterRequest request) {
        log.debug("Registro público de usuario con rol id={}", request.getIdRol());

        var userRequest = new UserRequest();
        userRequest.setUserName(request.getUserName());
        userRequest.setEmail(request.getEmail());
        userRequest.setPassword(request.getPassword());
        userRequest.setIdRol(request.getIdRol());

        return createRegister(userRequest);
    }

    @Override
    public LoginResponse login(LoginRequest credentials) {

        // Ahora usamos el correo electrónico como identificador de login
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                credentials.getUsername(),
                credentials.getPassword()));

        var userDetails = userDetailsService.loadUserByUsername(credentials.getUsername());
        var userInfo = userRepository.findByEmail(credentials.getUsername());

        Map<String, Object> claims = Map.of();
        if (userInfo.isPresent()) {
            claims = Map.<String, Object>of(
                    "name", userInfo.get().getUserName(),
                    "role", userInfo.get().getRole().getRoleName());
        }

        var token = jwtService.generateToken(claims, userDetails);

        return LoginResponse.builder()
                .jwt(token)
                .build();

        /*
         * if (userRepository.existsByUserNameAndPassword(credentials.getUsername(),
         * passwordEncoder.encode(credentials.getPassword()))) {
         * throw new BadLoginException();
         */
        // userRepository.findByUserName(credentials.getUsername())
        // .filter(user -> passwordEncoder.matches(credentials.getPassword(),
        // user.getPassword()))
        // .orElseThrow(() -> new BadLoginException());

    }

    // Logica pra modificar un usuario siempre y cuando exista su id y exista el rol
    @Override
    @Transactional
    public UserResponse update(Integer id, UserRequest userRequest) {

        log.debug("Recibiendo id {} para actualizar", id);
        var existingUser = userRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException("El usuario con id " + id + " no fue encontrado"));

        var role = roleRepository.findById(userRequest.getIdRol())
                .orElseThrow(() -> new IdNotFoundException(
                        "El rol con id " + userRequest.getIdRol() + " no fue encontrado"));

        existingUser.setUserName(userRequest.getUserName());
        existingUser.setEmail(userRequest.getEmail());
        existingUser.setPassword(userRequest.getPassword());
        existingUser.setRole(role);

        var updateUser = userRepository.save(existingUser);
        log.info("Modificación al usuario con id {} exitosa", updateUser.getId());
        return userMapper.toResponse(updateUser);
    }

    // Logica para eliminar un usuario
    @Transactional
    @Override
    public UserResponse delete(Integer id) {
        log.debug("Recibiendo usuario con id {} para eliminar", id);
        var existingUser = userRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException("El usuario con id " + id + " no fue encontrado"));

        userRepository.delete(existingUser);
        log.info("Usuario con id {} eliminado exitosamente.", id);
        return userMapper.toResponse(existingUser);

    }

}
