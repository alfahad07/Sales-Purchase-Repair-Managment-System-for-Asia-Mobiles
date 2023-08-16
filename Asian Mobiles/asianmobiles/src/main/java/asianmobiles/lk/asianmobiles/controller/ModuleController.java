package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Module;
import asianmobiles.lk.asianmobiles.entity.PhoneModel;
import asianmobiles.lk.asianmobiles.entity.Role;
import asianmobiles.lk.asianmobiles.repository.ModuleRepository;
import asianmobiles.lk.asianmobiles.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/module")
public class ModuleController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private ModuleRepository moduleDao;


    //Create get mapping to take all the module data from the database to display on the browser as JSON OBJECT--->[/user]
    @GetMapping(value = "/findall", produces = "application/json") //attribute "produces" used to take the data as which type to display on the browser, "application/json" is used to take the data as JSON OBJECT.
    private List<Module> findAll(){

        return moduleDao.findAll();

    }

    //GET MAPPING to get brand by given Brand for filtering [/phonemodel/listbyphoneseries?cid=]
    @GetMapping(value = "/listbyrolename/{id}", produces = "application/json")
    public List<Module> moduleListByRoleName(@PathVariable("id") Integer id) {

        return moduleDao.findByRoleName(id);

    }

}
