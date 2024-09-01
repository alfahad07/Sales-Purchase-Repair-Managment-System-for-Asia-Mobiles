package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.Grn_Report;
import asianmobiles.lk.asianmobiles.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ReportRepository extends JpaRepository<PaymentMethod, Integer> {


    @Query(value = "select  grn.grn_code, s.supplier_company_name, grn.bill_invoice_number,p.purchase_order_number, grn.net_total_amount, u.username from asian_mobile_store.goods_receive_note as grn, asian_mobile_store.supplier as s,\n" +
            "            asian_mobile_store.purchase_order as p, asian_mobile_store.user as u\n" +
            "            where grn.added_user_id = u.id and grn.supplier_id=s.id and\n" +
            "            grn.purchase_order_id=p.id and\n" +
            "            grn.bill_date>=?1 and grn.bill_date<=?2", nativeQuery = true)
    String[][] grnReport(String startDate , String endDate);


}
