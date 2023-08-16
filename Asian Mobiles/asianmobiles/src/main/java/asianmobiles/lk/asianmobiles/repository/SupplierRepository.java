package asianmobiles.lk.asianmobiles.repository;


import asianmobiles.lk.asianmobiles.entity.Customer;
import asianmobiles.lk.asianmobiles.entity.Model;
import asianmobiles.lk.asianmobiles.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface SupplierRepository extends JpaRepository<Supplier,Integer> {

    @Query(value = "select new Supplier (s.id, s.supplier_company_name, s.supplier_status_id) from Supplier s")
    List<Supplier> list();

    @Query("select s from Supplier s where s.business_reg_no = ?1")
    Supplier getByBusinessRegNo(String SupBusRegNo);

    @Query("select s from Supplier s where s.supplier_company_reg_no = ?1")
    Supplier getByCompanyRegNo(String SupComRegNo);

    @Query("select s from Supplier s where s.supplier_company_email = ?1")
    Supplier getByCompanyEmail(String SupComEmail);

    @Query("select s from Supplier s where s.bank_account_number = ?1")
    Supplier getByCompanyAccountNo(String SupAccountNo);

}
