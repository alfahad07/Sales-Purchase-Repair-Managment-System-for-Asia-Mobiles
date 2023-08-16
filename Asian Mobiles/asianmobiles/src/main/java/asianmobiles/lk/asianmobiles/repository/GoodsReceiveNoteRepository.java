package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.GoodsReceiveNote;
import asianmobiles.lk.asianmobiles.entity.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface GoodsReceiveNoteRepository extends JpaRepository<GoodsReceiveNote,Integer> {

    //TO GET THE LAST GoodsReceiveNote Code WHICH IS USED IN ADD METHOD IN "GoodsReceiveNoteRequestController" TO SET THE NEXT GoodsReceiveNote Code NUMBER...
    @Query(value = "select max(grn.grn_code) from GoodsReceiveNote grn")
    String getLastGrnNo();

    /*@Query(value = "select new Quotation (q.id, q.quotation_number) from Quotation q")
    List<GoodsReceiveNote> list();

    @Query(value = "select q from Quotation q where q.quotation_request_id.supplier_id.id = ?1")
    List<GoodsReceiveNote> findByPurchaseOrderSupplierName(Integer qid);*/

}
