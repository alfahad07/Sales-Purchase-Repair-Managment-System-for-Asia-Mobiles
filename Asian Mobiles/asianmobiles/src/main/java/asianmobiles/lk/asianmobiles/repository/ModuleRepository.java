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

    @Query(value = "SELECT m.name FROM asian_mobile_store.module as m where m.id not in " +
            "(select p.module_id from asian_mobile_store.privilage as p where p.sel=1 and p.role_id in " +
            "(select uhr.role_id from asian_mobile_store.user_has_role as uhr where uhr.user_id in " +
            "(select u.id from asian_mobile_store.user as u where u.username=?1)))", nativeQuery = true)
    List getByUser(String username);

}
