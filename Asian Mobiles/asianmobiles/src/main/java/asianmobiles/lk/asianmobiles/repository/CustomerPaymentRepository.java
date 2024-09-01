package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.CustomerPayment;
import asianmobiles.lk.asianmobiles.entity.SupplierPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerPaymentRepository extends JpaRepository<CustomerPayment, Integer> {


    @Query(value = "select new CustomerPayment (cp.id, cp.bill_number, cp.sales_invoice_id, cp.total_amount, cp.payment_method_id, cp.payment_status_id) from CustomerPayment cp")
    List<CustomerPayment> list();

    @Query(value = "select max(cp.bill_number) from CustomerPayment cp")
    String getLastCustomerPaymentBillNo();



}
