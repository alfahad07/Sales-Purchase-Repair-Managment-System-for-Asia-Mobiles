package asianmobiles.lk.asianmobiles.repository;


import asianmobiles.lk.asianmobiles.entity.PurchaseOrderHasModel;
import asianmobiles.lk.asianmobiles.entity.QuotationHasModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PurchaseOrderHasModelRepository extends JpaRepository<PurchaseOrderHasModel,Integer> {

    @Query(value = "select pohm from PurchaseOrderHasModel pohm where pohm.purchase_order_id.id=?1 and pohm.model_id.id =?2")
    PurchaseOrderHasModel findByPurchaseOrderModelOrderedQuantity(Integer pid,Integer mid);


}
