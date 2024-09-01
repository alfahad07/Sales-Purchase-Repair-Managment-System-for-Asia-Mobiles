package asianmobiles.lk.asianmobiles.repository;


import asianmobiles.lk.asianmobiles.entity.PreOrder;
import asianmobiles.lk.asianmobiles.entity.Repair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RepairRepository extends JpaRepository<Repair,Integer> {


}
