package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.Customer;
import asianmobiles.lk.asianmobiles.entity.Items;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ItemsRepository extends JpaRepository<Items, Integer> {

    @Query("select i from Items i where i.iemi_number_1 = ?1")
    Items getByIemiNumber01(String iemi01);

    @Query("select i from Items i where i.iemi_number_2 = ?1")
    Items getByIemiNumber02(String iemi02);
    @Query("select i from Items i where i.serial_number = ?1")
    Items getBySerialNumber(String serialNo);

    @Query("select i from Items i where i.item_code_number = ?1")
    Items getByItemCode(String itemCodeNumber);

}
