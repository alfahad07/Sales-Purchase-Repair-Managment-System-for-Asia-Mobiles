package asianmobiles.lk.asianmobiles.repository;


import asianmobiles.lk.asianmobiles.entity.Model;
import asianmobiles.lk.asianmobiles.entity.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ModelRepository extends JpaRepository <Model, Integer> {

    @Query("select m from Model m where m.model_name = ?1")
    Model getByModelName(String ModName);

    @Query("select m from Model m where m.model_number = ?1")
    Model getByModelNumber(String ModNo);

    @Query(value = "select new Model(m.id, m.model_number, m.model_name, m.sales_price) from Model m where m.model_status_id.id = 1")
    List<Model> list();

    @Query(value = "select m from Model m where m.id not in(select shm.model_id.id from SupplierHasModels shm where shm.supplier_id.id =?1)")
    List<Model>getWithoutSupplier(int supplierid);

    @Query(value = "select m from Model m where m.id in(select qhm.model_id.id from QuotationHasModel qhm where qhm.quotation_id.id =?1)")
    List<Model> findByPurchaseOrderQuotation(Integer qid);

    @Query(value = "select m from Model m where m.id in(select pohm.model_id.id from PurchaseOrderHasModel pohm where pohm.purchase_order_id.id =?1)")
    List<Model> findByPurchaseOrder(Integer pid);

    @Query(value = "select m from Model m where m.id in(select pohm.quantity from PurchaseOrderHasModel pohm where pohm.purchase_order_id.id =?1)")
    List<Model> findByPurchaseOrderQuantity(Integer pid);

}
