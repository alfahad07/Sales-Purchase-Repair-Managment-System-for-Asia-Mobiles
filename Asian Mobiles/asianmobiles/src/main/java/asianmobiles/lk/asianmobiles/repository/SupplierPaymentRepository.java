package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.Customer;
import asianmobiles.lk.asianmobiles.entity.SupplierPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupplierPaymentRepository extends JpaRepository<SupplierPayment, Integer> {


    @Query(value = "select new SupplierPayment (sp.id, sp.bill_number, sp.supplier_id, sp.goods_recieve_note_id, sp.total_amount, sp.payment_method_id, sp.payment_status_id) from SupplierPayment sp")
    List<SupplierPayment> list();
    @Query(value = "select max(sp.bill_number) from SupplierPayment sp")
    String getLastSalesPaymentBillNo();



}
