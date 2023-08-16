package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.CivilStatus;
import asianmobiles.lk.asianmobiles.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DesignationRepository extends JpaRepository<Designation, Integer> {
}
