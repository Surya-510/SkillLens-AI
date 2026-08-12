package com.surya.skilllens.repository;

import com.surya.skilllens.entity.ActivityHistory;
import com.surya.skilllens.entity.Resume;
import com.surya.skilllens.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityHistoryRepository extends JpaRepository<ActivityHistory, Long> {
    List<ActivityHistory> findByUserOrderByCreatedAtDesc(User user);
    List<ActivityHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ActivityHistory> findAllByOrderByCreatedAtDesc();
    List<ActivityHistory> findByResume(Resume resume);
    void deleteByUser(User user);
}
