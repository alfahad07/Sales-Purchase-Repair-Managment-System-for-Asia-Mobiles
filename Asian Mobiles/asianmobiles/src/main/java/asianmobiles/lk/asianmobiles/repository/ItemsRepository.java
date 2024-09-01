package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.Customer;
import asianmobiles.lk.asianmobiles.entity.Items;
import asianmobiles.lk.asianmobiles.entity.Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ItemsRepository extends JpaRepository<Items, Integer> {

    @Query(value = "select new Items(i.id, i.item_code_number, i.item_name, i.model_id) from Items i where i.item_status_id.id=1")
    List<Items> list();

    @Query("select i from Items i where i.iemi_number_1 = ?1")
    Items getByIemiNumber01(String iemi01);

    @Query("select i from Items i where i.iemi_number_2 = ?1")
    Items getByIemiNumber02(String iemi02);
    @Query("select i from Items i where i.serial_number = ?1")
    Items getBySerialNumber(String serialNo);

    @Query("select i from Items i where i.item_code_number = ?1")
    Items getByItemCode(String itemCodeNumber);

    @Query("select new Items(i.model_id.model_name, count (i.id)) from Items i where i.item_status_id.id=1 group by i.model_id.id")
    List<Items> getItemAvalibaleList();

    @Query(value = "SELECT concat('IC', year(current_date()) , lpad(substring(max(i.item_code_number),7)+1, 4,0)) FROM asian_mobile_store.items as i where year(i.added_datetime) = year(current_date());" , nativeQuery = true)
    String getNextCode();


    @Query("select i from Items i where i.item_status_id.id=1 and i.model_id.id=?1")
    List<Items> getByModel(int modelid);
}
