package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;


public interface QuotationRepository extends JpaRepository<Quotation,Integer> {

    //TO GET THE LAST QUOTATION REQUEST NUMBER WHICH IS USED IN ADD METHOD IN "QuotationRequestController" TO SET THE NEXT QUOTATION REQUEST NUMBER...
    @Query(value = "select max(q.quotation_number) from Quotation q")
    String getLastQuotationNo();

    @Query(value = "select new Quotation (q.id, q.quotation_number) from Quotation q")
    List<Quotation> list();

    @Query(value = "select q from Quotation q where q.quotation_request_id.supplier_id.id = ?1 and q.quotation_status_id.id=1 and q.expire_date>?2 ")
    List<Quotation> findByPurchaseOrderSupplierName(Integer sid , LocalDate now);

}
