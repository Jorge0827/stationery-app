package com.jechavarria.stationery_app.repository.users;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jechavarria.stationery_app.models.entities.User;


public interface UserRepository extends JpaRepository<User, Integer>{

    Optional<User> findByEmail(String email);

}
