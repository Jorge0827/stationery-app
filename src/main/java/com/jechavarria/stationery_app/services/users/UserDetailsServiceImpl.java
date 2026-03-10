package com.jechavarria.stationery_app.services.users;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.jechavarria.stationery_app.exceptions.IdNotFoundException;
import com.jechavarria.stationery_app.repository.users.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    // Objeto de Spring Security
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Ahora interpretamos "username" como correo electrónico
        var userInfo = userRepository.findByEmail(username)
                .orElseThrow(() -> new IdNotFoundException("El usuario no existe"));

        String roleName = userInfo.getRole().getRoleName();

        return User.builder()
                .username(userInfo.getEmail())
                .password(userInfo.getPassword())
                .roles(roleName)
                .build();
    }

}
