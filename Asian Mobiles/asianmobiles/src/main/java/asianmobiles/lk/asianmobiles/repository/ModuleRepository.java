package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.Module;
import asianmobiles.lk.asianmobiles.entity.PhoneModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Integer> {

    @Query(value = "select m from Module m where m.id not in(select p.module_id.id from Privilege p where  p.role_id.id=?1)")
    List<Module> findByRoleName(Integer roleid);

}
