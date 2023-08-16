package asianmobiles.lk.asianmobiles.repository;


import asianmobiles.lk.asianmobiles.entity.PreOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PreOrderRepository extends JpaRepository<PreOrder,Integer> {

    //TO GET THE LAST PRE-ORDER CODE WHICH IS USED IN ADD METHOD IN "PreOrderController" TO SET THE NEXT PRE-ORDER CODE...
    @Query(value = "select max(po.pre_order_code) from PreOrder po")
    String getLastPreOrderCode();
}
