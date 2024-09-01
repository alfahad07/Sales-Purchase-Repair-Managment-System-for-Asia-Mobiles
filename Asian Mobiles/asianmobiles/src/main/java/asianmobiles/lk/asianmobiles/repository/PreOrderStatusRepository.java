package asianmobiles.lk.asianmobiles.repository;


import asianmobiles.lk.asianmobiles.entity.PreOrder;
import asianmobiles.lk.asianmobiles.entity.PreOrderStatus;
import asianmobiles.lk.asianmobiles.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PreOrderStatusRepository extends JpaRepository<PreOrderStatus,Integer> {


}
