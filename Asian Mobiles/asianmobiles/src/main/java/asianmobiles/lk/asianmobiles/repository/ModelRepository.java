package asianmobiles.lk.asianmobiles.repository;


import asianmobiles.lk.asianmobiles.entity.Items;
import asianmobiles.lk.asianmobiles.entity.Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ModelRepository extends JpaRepository <Model, Integer> {

    @Query("select m from Model m where m.model_name = ?1")
    Model getByModelName(String ModName);

    @Query("select m from Model m where m.model_number = ?1")
    Model getByModelNumber(String ModNo);

    @Query(value = "select new Model(m.id, m.model_number, m.model_name, m.sales_price) from Model m")
    List<Model> list();

}
