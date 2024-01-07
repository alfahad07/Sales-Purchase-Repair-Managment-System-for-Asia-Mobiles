package asianmobiles.lk.asianmobiles.repository;


import asianmobiles.lk.asianmobiles.entity.Items;
import asianmobiles.lk.asianmobiles.entity.PreOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PreOrderRepository extends JpaRepository<PreOrder,Integer> {

    //TO GET THE LAST PRE-ORDER CODE WHICH IS USED IN ADD METHOD IN "PreOrderController" TO SET THE NEXT PRE-ORDER CODE...
    @Query(value = "select max(po.pre_order_code) from PreOrder po")
    String getLastPreOrderCode();

    @Query(value = "select new PreOrder (p.id, p.pre_order_code) from PreOrder p")
    List<PreOrder> list();

}
