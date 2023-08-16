package asianmobiles.lk.asianmobiles.repository;

import asianmobiles.lk.asianmobiles.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    @Query("select r from Role r where r.id in(select uhr.role_id.id from UserHasRole uhr where uhr.user_id.id=?1)")
    List<Role> getListByUser(Integer userid);

    @Query("select r from Role r where r.name <> 'Admin' ")
    List<Role>findAllWithoutAdmin();


}
