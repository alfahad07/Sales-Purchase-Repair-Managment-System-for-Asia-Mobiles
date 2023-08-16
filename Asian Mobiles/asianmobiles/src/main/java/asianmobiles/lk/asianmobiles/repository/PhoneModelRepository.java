package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.Brand;
import asianmobiles.lk.asianmobiles.entity.PhoneModel;
import asianmobiles.lk.asianmobiles.entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PhoneModelRepository extends JpaRepository<PhoneModel,Integer> {

    @Query(value = "select ph from PhoneModel ph where ph.phone_series_id.id = ?1")
    List<PhoneModel> findByPhoneSeries(Integer cid);

}
