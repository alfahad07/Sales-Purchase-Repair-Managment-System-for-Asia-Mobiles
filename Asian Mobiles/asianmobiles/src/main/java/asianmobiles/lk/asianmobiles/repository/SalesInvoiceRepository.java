package asianmobiles.lk.asianmobiles.repository;


import asianmobiles.lk.asianmobiles.entity.SalesInvoice;
import asianmobiles.lk.asianmobiles.entity.SupplierPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface SalesInvoiceRepository extends JpaRepository<SalesInvoice,Integer> {

    @Query(value = "select new SalesInvoice (si.id, si.bill_number, si.net_amount) from SalesInvoice si where si.sales_invoice_status_id.id = 2")
    List<SalesInvoice> list();

    @Query(value = "select max(si.bill_number) from SalesInvoice si")
    String getLastSalesInvoiceBillNumber();

}
