package asianmobiles.lk.asianmobiles.repository;


import asianmobiles.lk.asianmobiles.entity.Model;
import asianmobiles.lk.asianmobiles.entity.SalesInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface SalesInvoiceRepository extends JpaRepository<SalesInvoice,Integer> {



}
