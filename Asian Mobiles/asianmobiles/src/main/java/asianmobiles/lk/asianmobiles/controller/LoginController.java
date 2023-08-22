package asianmobiles.lk.asianmobiles.controller;


import asianmobiles.lk.asianmobiles.entity.User;
import asianmobiles.lk.asianmobiles.repository.ModuleRepository;
import asianmobiles.lk.asianmobiles.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;

@RestController  // this Annotation notify the user the services through the sever when the user request the sever.
public class LoginController {


    @Autowired
    // This Annnotation is used to create an instance or copy of an interface. so here UserRepository is an iterface, to create an copy of it this annotation is used.
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilageController;

    @Autowired
    private ModuleRepository moduleDao;




    @GetMapping(value = "/login")
    public ModelAndView LoginUi() {

        ModelAndView loginui = new ModelAndView();
        loginui.setViewName("LoginForm.html");
        return loginui;

    }

    @GetMapping(value = "/dashboard")
    public ModelAndView dashboardUi() {

        ModelAndView dashboardui = new ModelAndView();
        dashboardui.setViewName("dashboard.html");
        return dashboardui;

    }

    @GetMapping(value = "/404")
    public ModelAndView accessDeniedUI() {

        ModelAndView accessDeniedui = new ModelAndView();
        accessDeniedui.setViewName("404.html");
        return accessDeniedui;

    }

    @GetMapping(value = "/loggeduser", produces = "application/json")
    public User loggedUser(){

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());

        return loggedUser;

    }

    @GetMapping(value = "/modulename/byuser/{username}")
    public List getModuleNameByUser(@PathVariable ("username") String username){

        return moduleDao.getByUser(username);

    }



    //Privilege by User Module [/userprivilage/bymodule?modulename=]
    @GetMapping(value = "/userprivilage/bymodule", params = {"modulename"})
    //Create function for get all userprivilage data from PrivilageRepository.
    public HashMap<String, Boolean> getPrivilageByModule(@RequestParam("modulename") String modulename) {

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());

        //Created a HashMap instance or copy
        HashMap<String, Boolean> loguserPrivilage = new HashMap<>();


        //Givivng permission to the logged user by checking the authentication
        if (loggedUser == null || authentication instanceof AnonymousAuthenticationToken) {

            //The logged user is not allowed to Select, Insert, Update, Delete Operations, Coz the user is not an authenticated user.
            loguserPrivilage.put("sel", false);
            loguserPrivilage.put("ins", false);
            loguserPrivilage.put("upd", false);
            loguserPrivilage.put("del", false);

            return loguserPrivilage;

        } else {

            //The logged user is allowed to do Select, Insert, Update, Delete Operations, Coz the user is an authenticated user.
            return privilageController.getPrivilage(loggedUser.getUsername(), modulename);

        }


    }
}
