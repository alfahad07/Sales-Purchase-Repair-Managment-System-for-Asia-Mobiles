package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.Brand;
import asianmobiles.lk.asianmobiles.entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SubCategoryRepository extends JpaRepository<SubCategory,Integer> {

    //Query to get SubCategory by given CategoryId for filtering
    @Query(value = "select sc from SubCategory sc where sc.category_id.id = ?1")
    List<SubCategory> findByCategory(Integer cid);


}
