package asianmobiles.lk.asianmobiles.repository;


import asianmobiles.lk.asianmobiles.entity.Model;
import asianmobiles.lk.asianmobiles.entity.PreOrderHasModel;
import asianmobiles.lk.asianmobiles.entity.QuotationHasModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuotationHasModelRepository extends JpaRepository<QuotationHasModel,Integer> {

    @Query(value = "select qhm from QuotationHasModel qhm where qhm.quotation_id.id=?1 and qhm.model_id.id =?2")
    QuotationHasModel findByPurchaseOrderModelToGetPurchasePrice(Integer qid,Integer mid);

}
