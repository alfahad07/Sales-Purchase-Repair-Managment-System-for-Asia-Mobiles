package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.configuration.WebSecurity;
import asianmobiles.lk.asianmobiles.entity.User;
import asianmobiles.lk.asianmobiles.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController // this Annotation notify the user the services through the sever when the user request the sever.
@RequestMapping(value = "/user") // Class level Mapping for below functions

public class UserController {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private PrivilegeController privilagecontroller;
    @Autowired// This Annnotation is used to create an instance or copy of an interface. so here UserRepository is an iterface, to create an copy of it this annotation is used.
    private UserRepository userDao;


    //Create get mapping to take all the user data from the database to display on the browser as JSON OBJECT--->[/user]
    @GetMapping(value = "/findall", produces = "application/json") //attribute "produces" used to take the data as which type to display on the browser, "application/json" is used to take the data as JSON OBJECT.
    private List<User> findAll(){

        return userDao.findAll();

    }


    // creating getMapping annotation to get the UserManagement UI.
    @GetMapping
    //creating a function to display the UserManagement UI.
    public ModelAndView userUi(){

        // create ModelAndView object called userui
        ModelAndView userui =  new ModelAndView();

        //set user.html
        userui.setViewName("User_Management.html");

        return userui;


    }

    //METHOD 01 - GET MAPPING SERVICE TO GET USER BY GIVEN PATH VARIABLE ID [ /user.js/getById/1 ] TO GET THE SELECTED USER OBJECT TO THE FORM WHEN CLICKED ON THE EDIT BTN ON THE USER TABLE.
    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public User getUserByPVId(@PathVariable ("id") Integer id){

        return userDao.getReferenceById(id);

    }


    //CREATE POST MAPPING FUNCTION TO ADD EMPLOYEE [/user - POST]
    @PostMapping
    public String addUser( @RequestBody User user ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilagecontroller.getPrivilage(loggedUser.getUsername(), "USER");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")){

            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            User extUserName = userDao.findUserByUsername(user.getUsername());
            if ( extUserName != null ){

                return "User insert not completed : Username Duplicated (Username already Exist)";

            }

            //CHECKING THE EMAIL EXIS OR NOT IN THE DATABASE.
            User extUserEmail = userDao.findUserByEmail(user.getEmail());
            if ( extUserEmail != null ){

                return "User insert not completed : Email Duplicated (Email already Exist)";

            }

            try {

                //SET AUTO INSERT VALUE
                user.setAddeddatetime(LocalDateTime.now());
                user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

                //SAVE THE CHANGES
                userDao.save(user);
                return "0";

            }catch (Exception ex){

                return "User Insert is incomplete : " + ex.getMessage();

            }

        }else {

            return "User insert not completed : You dont have access";

        }

    }


    //Create delete mapping to delete User by using DeleteMapping Annotation
    @DeleteMapping
    public String deleteUser( @RequestBody User user ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilagecontroller.getPrivilage(loggedUser.getUsername(), "USER");

        if(!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")){


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            //checking function to check weather the USER exist in the database
            User existUser = userDao.getReferenceById(user.getId());

            // Creating a function to delete the employee.js from the database after checking the employee's existance.
            if(existUser != null){
                try{

                    //set auto insert Values
                    existUser.setDeleteddatetime(LocalDateTime.now()); // Setting the delete time of the user
                    existUser.setStatus(false); // Setting userStatus to deleted once the delete is done

                    userDao.save(existUser);

                    return "0";


                }catch(Exception ex){

                    return "Delete not completed : " + ex.getMessage();

                }
            }else{

                return "Delete Not Completed : user Not Available";

            }


        }else {

            return "User Delete not completed : You don't have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO ADD EMPLOYEE [/user - POST]
    @PutMapping
    public String updateUser( @RequestBody User user ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilagecontroller.getPrivilage(loggedUser.getUsername(), "USER");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("upd")){


            //CHECKING THE EMAIL EXIST OR NOT IN THE DATABASE COZ IT IS UNIQUE.
            User extUserByEmail = userDao.findUserByEmail(user.getEmail());
            if (extUserByEmail != null && user.getId() != extUserByEmail.getId()) {

                return "User update not completed : E-Mail already Exist";

            }

            try {

                //SET AUTO INSERT VALUE OF THE LAST UPDATED TIME ONCE THE UPDATE IS DONE BY THE USER.
                user.setUpdateddatetime(LocalDateTime.now());

                //SAVE THE CHANGES
                userDao.save(user);

                return "0";

            }catch (Exception ex){

                return "User update is incomplete : " + ex.getMessage();

            }

        }else {

            return "User update not completed : You dont have access";

        }

    }


}
