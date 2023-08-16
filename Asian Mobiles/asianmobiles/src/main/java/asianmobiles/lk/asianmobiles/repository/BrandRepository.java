package asianmobiles.lk.asianmobiles.repository;


import asianmobiles.lk.asianmobiles.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BrandRepository extends JpaRepository<Brand,Integer> {

    //Query to get BRAND by given CategoryId for filtering
    @Query(value = "select b from Brand b where b.id in(select bhc.brand_id.id from BrandHasCategory bhc where bhc.category_id.id=?1)")
    List<Brand> findByCategory(Integer cid);


    @Query(value = "select b from Brand b where b.id in(select bhsc.brand_id.id from  BrandHasSubCategory bhsc where  bhsc.sub_catergory_id.id=?1)")
    List<Brand> findBySubCategory(Integer cid);

}
