package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.CivilStatus;
import asianmobiles.lk.asianmobiles.entity.Role;
import asianmobiles.lk.asianmobiles.entity.User;
import asianmobiles.lk.asianmobiles.repository.CivilStatusRepository;
import asianmobiles.lk.asianmobiles.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/role")
public class RoleController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private RoleRepository roleDao;

    @GetMapping(value = "/listbyuser/{userid}", produces = "application/json")
    public List<Role> getListByUser (@PathVariable("userid") int userid){

        return roleDao.getListByUser(userid);

    }

    //Create get mapping to take all the user data from the database to display on the browser as JSON OBJECT--->[/user]
    @GetMapping(value = "/findall", produces = "application/json") //attribute "produces" used to take the data as which type to display on the browser, "application/json" is used to take the data as JSON OBJECT.
    private List<Role> findAll(){

        return roleDao.findAllWithoutAdmin();

    }

}
