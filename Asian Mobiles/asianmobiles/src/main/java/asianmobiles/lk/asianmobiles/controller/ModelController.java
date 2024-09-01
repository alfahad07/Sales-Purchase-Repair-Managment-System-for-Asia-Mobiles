package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Items;
import asianmobiles.lk.asianmobiles.entity.Model;
import asianmobiles.lk.asianmobiles.entity.Quotation;
import asianmobiles.lk.asianmobiles.entity.User;
import asianmobiles.lk.asianmobiles.repository.ModelRepository;
import asianmobiles.lk.asianmobiles.repository.ModelStatusRepository;
import asianmobiles.lk.asianmobiles.repository.UserRepository;
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
@RequestMapping(value = "/model")
public class ModelController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private ModelRepository modelDao;

    @Autowired
    private UserRepository userDao;

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PrivilegeController privilegeController;

    @Autowired
    private ModelStatusRepository modelStatusDao;


    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public Model getModelByPVId (@PathVariable("id") int id){

        return modelDao.getReferenceById(id);

    }

    // filltering model for given quotation
    @GetMapping(value = "/listbymodel/{qid}", produces = "application/json")
    public List<Model> modelNameByPurchaseOrderQuotationNo(@PathVariable("qid") Integer qid) {

        return modelDao.findByPurchaseOrderQuotation(qid);

    }

    // filltering model for given purchase-order
    @GetMapping(value = "/listbypurchaseorder/{pid}", produces = "application/json")
    public List<Model> modelNameByPurchaseOrder(@PathVariable("pid") Integer pid) {

        return modelDao.findByPurchaseOrder(pid);

    }

    // filltering model for given purchase-order
    @GetMapping(value = "/listbypurchaseorderquantity/{pid}", produces = "application/json")
    public List<Model> modelByPurchaseOrderQuantity(@PathVariable("pid") Integer pid) {

        return modelDao.findByPurchaseOrderQuantity(pid);

    }


    //filltering all models without the selected models in supplierUI
    @GetMapping(value = "/listwithoutsupplier/{sid}", produces = "application/json")
    public List<Model> getAllModelsWithoutSelectedModels (@PathVariable("sid") int sid){

        return modelDao.getWithoutSupplier(sid);

    }


    // display model UI
    @GetMapping
    public ModelAndView modelUi(){

        ModelAndView modelui = new ModelAndView();

        modelui.setViewName("Model_Management.html");

        return modelui;

    }


    // to get all models
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Model> findAll (){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilage(authentication.getName(), "MODEL");

        if (loggedUserPrivilege != null && loggedUserPrivilege.get("sel")) {

            return modelDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

        }else {

            List<Model> modelList = new ArrayList<>();
            return  modelList;

        }

    }



    // to get all models details with selected columns
    @GetMapping(value = "/list", produces = "application/json")
    public List<Model> modelList () {

        return modelDao.list();

    }

    //Create delete mapping to delete User by using DeleteMapping Annotation
    @DeleteMapping
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
    public String addModel( @RequestBody Model model){

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
    public String updateModel( @RequestBody Model model ){

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

    }


}
