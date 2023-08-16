package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.Brand;
import asianmobiles.lk.asianmobiles.entity.PhoneSeries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PhoneSeriesRepository extends JpaRepository<PhoneSeries,Integer> {

    @Query(value = "select ps from PhoneSeries ps where ps.brand_id.id = ?1")
    List<PhoneSeries> findByBrand(Integer cid);

}
