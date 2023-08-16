package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Privilege;
import asianmobiles.lk.asianmobiles.entity.User;
import asianmobiles.lk.asianmobiles.repository.PrivilageRepository;
import asianmobiles.lk.asianmobiles.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController // this annotation notify the user the services through the sever when the user request the sever.
@RequestMapping(value = "/privilege") //CLASS LEVEL MAPPING FOR ALL THE BELOW CLASSES...

public class PrivilegeController {

    @Autowired
    private PrivilageRepository privilegeDao;

    @Autowired
    private UserRepository userDao;



    // creating getMapping annotation to get the Privilege Management UI.
    @GetMapping
    //creating a function to display the Privilege Management UI.
    public ModelAndView privilegeUi() {

        // create ModelAndView object called userui
        ModelAndView privilegeui =  new ModelAndView();

        //set user.html
        privilegeui.setViewName("Privilege_Management.html");

        return privilegeui;

    }



    //METHOD 01 - GET MAPPING SERVICE TO GET USER BY GIVEN PATH VARIABLE ID [ /user.js/getById/1 ] TO GET THE SELECTED USER OBJECT TO THE FORM WHEN CLICKED ON THE EDIT BTN ON THE USER TABLE.
    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public Privilege getPrivilegeByPVId(@PathVariable("id") Integer id){

        return privilegeDao.getReferenceById(id);

    }


    //Create get mapping to take all the privilage data from the database to display on the browser as JSON OBJECT--->[/privilage]
    @GetMapping(value = "/findall", produces = "application/json")
    //attribute "produces" used to take the data as which type to display on the browser, "application/json" is used to take the data as JSON OBJECT.
    public List<Privilege> findAll() {

        return privilegeDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

    }

    public HashMap<String, Boolean> getPrivilage(String logUsername, String modulename) {

        HashMap<String, Boolean> loguserPrivilage = new HashMap<>();

        //Checking the user is Admin to give the Access to sel, ins, upd, del operations
        if (!logUsername.equals("Admin")) {
            //The logged user is allowed to Select, Insert, Update, Delete Operations, Coz the user is an authenticated user.

            //Creating a String Attribute for the logged user privilage.
            String loggedUsernameAndModulename = privilegeDao.getPrivilageByUserAndModule(logUsername, modulename);
            String[] logUserPriArray = loggedUsernameAndModulename.split(","); //Converting the String into Array, So it can be Access one by one using array index.


            //
            loguserPrivilage.put("sel", logUserPriArray[0].equals("1") );
            loguserPrivilage.put("ins", logUserPriArray[1].equals("1") );
            loguserPrivilage.put("upd", logUserPriArray[2].equals("1") );
            loguserPrivilage.put("del", logUserPriArray[3].equals("1") );

            return loguserPrivilage;


        }else {

            //If the Logged user is Admin then All operations should be permitted to him.
            loguserPrivilage.put("sel", true);
            loguserPrivilage.put("ins", true);
            loguserPrivilage.put("upd", true);
            loguserPrivilage.put("del", true);

            return  loguserPrivilage;

        }


    }

    @DeleteMapping
    public String deletePrivilege (@RequestBody Privilege privilege){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = getPrivilage(loggedUser.getUsername(), "PRIVILEGE");


        if(!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")){


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            //checking function to check weather the privilege exist in the database
            Privilege existPrivilege = privilegeDao.getReferenceById(privilege.getId());

            // Creating a function to delete the employee.js from the database after checking the employee's existance.
            if(existPrivilege != null){
                try{

                    //set auto insert Values
                    existPrivilege.setDelete_datetime(LocalDateTime.now()); //Setting to delete time of the user
                   existPrivilege.setLast_updated_user_id(loggedUser); //Setting userStatus to deleted once the delete is done
                    existPrivilege.setSel(false);
                    existPrivilege.setIns(false);
                    existPrivilege.setUpd(false);
                    existPrivilege.setDel(false);

                    privilegeDao.save(existPrivilege);

                    return "0";


                }catch(Exception ex){

                    return "Delete not completed : " + ex.getMessage();

                }
            }else{

                return "Delete Not Completed : Privilege Not Available";

            }


        }else {

            return "Privilege Delete not completed : You don't have access";

        }
    }

    //CREATE POST MAPPING FUNCTION TO ADD PRIVILEGE DETAILS [/privilege - POST]
    @PostMapping
    public String addPrivilege( @RequestBody Privilege privilege ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = getPrivilage(loggedUser.getUsername(), "PRIVILEGE");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")){

            //checking function to check weather the privilege exist in the database
            Privilege existPrivilege = privilegeDao.getPrivilageByRoleAndModule(privilege.getRole_id().getId(), privilege.getModule_id().getId());


            if(existPrivilege != null){

                return "Privilege Details insert not completed : Privilege Details Duplicated (Privilege Details already Exist)";
            }
                try{

                    //set auto insert Values
                    privilege.setAdded_datetime(LocalDateTime.now()); //Setting to Add time of the privilege
                    privilege.setAdded_user_id(loggedUser);

                    privilegeDao.save(privilege);

                    return "0";


                }catch(Exception ex){

                    return "Insert not completed : " + ex.getMessage();

                }


        }else {

            return "Privilege Insert not completed : You don't have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO ADD EMPLOYEE [/user - POST]
    @PutMapping
    public String updatePrivilege( @RequestBody Privilege privilege ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = getPrivilage(loggedUser.getUsername(), "PRIVILEGE");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("upd")){


            //checking function to check weather the privilege exist in the database
            Privilege existPrivilege = privilegeDao.getReferenceById(privilege.getId());
            if (existPrivilege == null) {

                return "Privilege Details Update not completed : Privilege Details already Exist";

            }

            try {

                //SET AUTO INSERT VALUE OF THE LAST UPDATED TIME ONCE THE UPDATE IS DONE BY THE USER.
                privilege.setLast_update_datetime(LocalDateTime.now());
                privilege.setAdded_user_id(loggedUser);

                //SAVE THE CHANGES
                privilegeDao.save(privilege);

                return "0";

            }catch (Exception ex){

                return "Privilege Details update is incomplete : " + ex.getMessage();

            }

        }else {

            return "Privilege Details update not completed : You dont have access";

        }

    }

}