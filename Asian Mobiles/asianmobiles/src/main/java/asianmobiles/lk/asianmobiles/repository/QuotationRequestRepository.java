package asianmobiles.lk.asianmobiles.repository;



import asianmobiles.lk.asianmobiles.entity.Model;
import asianmobiles.lk.asianmobiles.entity.QuotationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface QuotationRequestRepository extends JpaRepository<QuotationRequest,Integer> {

    //TO GET THE LAST QUOTATION REQUEST NUMBER WHICH IS USED IN ADD METHOD IN "QuotationRequestController" TO SET THE NEXT QUOTATION REQUEST NUMBER...
    @Query(value = "select max(qr.qr_number) from QuotationRequest qr")
    String getLastQuotationRequestNo();

    @Query(value = "select new QuotationRequest (qr.id, qr.qr_number, qr.quotation_required_date) from QuotationRequest qr")
    List<QuotationRequest> list();

}
