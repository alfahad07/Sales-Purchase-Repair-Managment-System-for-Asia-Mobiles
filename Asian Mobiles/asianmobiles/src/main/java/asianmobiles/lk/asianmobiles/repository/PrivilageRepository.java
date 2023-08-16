package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.Privilege;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PrivilageRepository extends JpaRepository<Privilege,Integer> {

    @Query(value = "SELECT  bit_or(p.sel), bit_or(p.ins), bit_or(p.upd), bit_or(p.del) FROM asian_mobile_store.privilage as p " +
            "where p.role_id in (SELECT role_id FROM asian_mobile_store.user_has_role " +
            "where user_id in (SELECT u.id FROM asian_mobile_store.user as u where u.username =?1)) " +
            "and p.module_id in (SELECT m.id FROM asian_mobile_store.module as m where m.name =?2);",nativeQuery = true)

    String getPrivilageByUserAndModule(String username, String modulename); // "1,1,1,1" -> [1,1,1,1]

    @Query(value = "SELECT p from Privilege p where p.role_id.id = ?1 and p.module_id.id = ?2")
    Privilege getPrivilageByRoleAndModule (Integer role_id, Integer module_id);


}
