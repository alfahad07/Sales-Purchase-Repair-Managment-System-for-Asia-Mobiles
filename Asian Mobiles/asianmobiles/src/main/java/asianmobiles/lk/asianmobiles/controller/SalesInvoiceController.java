package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Model;
import asianmobiles.lk.asianmobiles.entity.PhoneModel;
import asianmobiles.lk.asianmobiles.entity.SalesInvoice;
import asianmobiles.lk.asianmobiles.entity.User;
import asianmobiles.lk.asianmobiles.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/salesinvoice")
public class SalesInvoiceController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private SalesInvoiceRepository salesInvoiceDao;

    @Autowired
    private UserRepository userDao;

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PrivilegeController privilegeController;

    @Autowired
    private SalesInvoiceStatusRepository salesInvoiceStatusDao;


    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public SalesInvoice getSalesInvoiceByPVId (@PathVariable("id") int id){

        return salesInvoiceDao.getReferenceById(id);

    }


    @GetMapping
    public ModelAndView salesInvoiceUi(){

        ModelAndView salesInvoiceui = new ModelAndView();

        salesInvoiceui.setViewName("salesInvoice_Management.html");

        return salesInvoiceui;

    }


    @GetMapping(value = "/findall", produces = "application/json")
    public List<SalesInvoice> findAll (){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilage(authentication.getName(), "SALES-INVOICE");

        if (loggedUserPrivilege != null && loggedUserPrivilege.get("sel")) {

            return salesInvoiceDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

        }else {

            List<SalesInvoice> salesInvoiceList = new ArrayList<>();
            return  salesInvoiceList;

        }

    }



    //Create delete mapping to delete User by using DeleteMapping Annotation
   /* @DeleteMapping
    public String deleteModel( @RequestBody Model model ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "MODEL");

        if(!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")){


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            //checking function to check weather the Model exist in the database
            Model existModel = modelDao.getReferenceById(model.getId());

            // Creating a function to delete the Model from the database after checking the Model's existance.
            if(existModel != null){
                try{

                    //set auto insert Values
                    existModel.setDeleted_datetime(LocalDateTime.now()); // Setting the delete time of the user
                    existModel.setModel_status_id(modelStatusDao.getReferenceById(3)); // Setting userStatus to deleted once the delete is done

                    modelDao.save(existModel);

                    return "0";


                }catch(Exception ex){

                    return "Delete not completed : " + ex.getMessage();

                }
            }else{

                return "Delete Not Completed : Model Not Available";

            }


        }else {

            return "Model Delete not completed : You don't have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO ADD MODEL [/Model - POST]
    @PostMapping
    public String addItem( @RequestBody Model model){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "MODEL");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")){

            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            Model extModelName = modelDao.getByModelName(model.getModel_name());
            if ( extModelName != null ){

                return "Model insert not completed : Model Name Duplicated (Model Name already Exist)";

            }

            //CHECKING THE Item IEMI Number 02 EXIST OR NOT IN THE DATABASE.
            Model extModelNumber = modelDao.getByModelNumber(model.getModel_number());
            if ( extModelNumber != null ){

                return "Model insert not completed : Model NUmber Duplicated (Model Number already Exist)";

            }

            try {

                //SET AUTO INSERT VALUE
                model.setAdded_datetime(LocalDateTime.now());
                model.setAdded_user_id(loggedUser);


                //SAVE THE CHANGES
                modelDao.save(model);
                return "0";

            }catch (Exception ex){

                return "Model Insert is incomplete : " + ex.getMessage();

            }

        }else {

            return "Model insert not completed : You dont have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO UPDATE MODEL [/Model - PUT]
    @PutMapping
    public String updateItem( @RequestBody Model model ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "MODEL");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("upd")){

            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            Model extModelName = modelDao.getByModelName(model.getModel_name());
            if (extModelName != null && model.getId() != extModelName.getId()) {

                return "Model update not completed : Model Name already Exist";

            }


            //CHECKING THE EMAIL EXIST OR NOT IN THE DATABASE COZ IT IS UNIQUE.
            Model extModelNumber = modelDao.getByModelNumber(model.getModel_number());
            if (extModelNumber != null && model.getId() != extModelNumber.getId()) {

                return "Model update not completed : Model Number already Exist";

            }

            try {

                //SET AUTO INSERT VALUE OF THE LAST UPDATED TIME ONCE THE UPDATE IS DONE BY THE USER.
                model.setUpdated_datetime(LocalDateTime.now());
                model.setUpdated_user_id(loggedUser);

                //SAVE THE CHANGES
                modelDao.save(model);

                return "0";

            }catch (Exception ex){

                return "Model update is incomplete : " + ex.getMessage();

            }

        }else {

            return "Model update not completed : You dont have access";

        }

    }*/


}