package asianmobiles.lk.asianmobiles.repository;



import asianmobiles.lk.asianmobiles.entity.Model;
import asianmobiles.lk.asianmobiles.entity.QuotationRequest;
import asianmobiles.lk.asianmobiles.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface QuotationRequestRepository extends JpaRepository<QuotationRequest,Integer> {

    //TO GET THE LAST QUOTATION REQUEST NUMBER WHICH IS USED IN ADD METHOD IN "QuotationRequestController" TO SET THE NEXT QUOTATION REQUEST NUMBER...
    @Query(value = "select max(qr.qr_number) from QuotationRequest qr")
    String getLastQuotationRequestNo();

    //Quotation Request custom details taken from database
    @Query(value = "select new QuotationRequest (qr.id, qr.qr_number, qr.quotation_required_date) from QuotationRequest qr")
    List<QuotationRequest> list();

    //taking the quotation request object by given supplier
    @Query("select qr from QuotationRequest qr where qr.supplier_id.id=?1 and qr.quotation_request_status_id.id=1")
    List<QuotationRequest> getByActiveSupplierName(int supplierid);

}
