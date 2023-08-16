package asianmobiles.lk.asianmobiles.repository;



import asianmobiles.lk.asianmobiles.entity.Customer;
import asianmobiles.lk.asianmobiles.entity.PurchaseOrder;
import asianmobiles.lk.asianmobiles.entity.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.parameters.P;

import java.util.List;


public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder,Integer> {

    @Query(value = "select max(po.purchase_order_number) from PurchaseOrder po")
    String getLastPurchaseOrderCode();

    @Query(value = "select new PurchaseOrder (p.id, p.purchase_order_number, p.total_amount) from PurchaseOrder p")
    List<PurchaseOrder> list();

    @Query(value = "select p from PurchaseOrder p where p.quotation_id.quotation_request_id.supplier_id.id = ?1")
    List<PurchaseOrder> findByPurchaseOrderSupplierName(Integer pid);

}
