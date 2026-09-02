package com.farmdirect.repository;

import com.farmdirect.model.OtpRecord;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpRecordRepository extends JpaRepository<OtpRecord, Long> {
    Optional<OtpRecord> findByEmail(String email);
    void deleteByEmail(String email);
}
