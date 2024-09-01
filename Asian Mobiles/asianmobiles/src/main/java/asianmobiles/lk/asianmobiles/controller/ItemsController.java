package asianmobiles.lk.asianmobiles.controller;

import asianmobiles.lk.asianmobiles.entity.Customer;
import asianmobiles.lk.asianmobiles.entity.Items;
import asianmobiles.lk.asianmobiles.entity.Model;
import asianmobiles.lk.asianmobiles.entity.User;
import asianmobiles.lk.asianmobiles.repository.CustomerStatusRepository;
import asianmobiles.lk.asianmobiles.repository.ItemStatusRepository;
import asianmobiles.lk.asianmobiles.repository.ItemsRepository;
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
@RequestMapping(value = "/items")
public class ItemsController {

    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private PrivilegeController privilegeController;
    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private ItemsRepository itemsDao;
    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private ItemStatusRepository itemStatusDao;
    @Autowired // USED TO CREATE A COPY OF AN OBJECT AND INTERFACE
    private UserRepository userDao;



    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public Items getItemsByPVId (@PathVariable("id") int id){

        return itemsDao.getReferenceById(id);

    }

    @GetMapping(value = "/getbymodelid/{modelid}", produces = "application/json")
    public List<Items> getItemsByModelId (@PathVariable("modelid") int modelid){

        return itemsDao.getByModel(modelid);

    }
    //CREATED A LIST TO GET THE MAIN DETAILS OF THE ITEMS TO THE ITEM DROPDOWN(COMBO BOX) IN INNER FORM OF THE ITEM MODULE...
    @GetMapping(value = "/list", produces = "application/json")
    public List<Items> itemsList () {

        return itemsDao.list();

    }

    // creating getMapping annotation to get the UserManagement UI.
    @GetMapping
    //creating a function to display the UserManagement UI.
    public ModelAndView itemsUi(){

        // create ModelAndView object called userui
        ModelAndView itemsui =  new ModelAndView();

        //set user.html
        itemsui.setViewName("Items_Management.html");

        return itemsui;


    }

    //Create get mapping to take all the user data from the database to display on the browser as JSON OBJECT--->[/user]
    @GetMapping(value = "/findall", produces = "application/json") //attribute "produces" used to take the data as which type to display on the browser, "application/json" is used to take the data as JSON OBJECT.
    private List<Items> findAll(){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is existing in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilage(authentication.getName(), "ITEMS");

        if (loggedUserPrivilege != null && loggedUserPrivilege.get("sel")) {

            return itemsDao.findAll(Sort.by(Sort.Direction.DESC, "id"));

        }else {

            List<Items> itemsList = new ArrayList<>();
            return  itemsList;

        }

    }


    //Create delete mapping to delete Customer by using DeleteMapping Annotation
    @DeleteMapping
    public String deleteItems( @RequestBody Items items ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "ITEMS");

        if(!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("del")){


            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            //checking function to check wether the employee.js exist in the database
            Items existItems = itemsDao.getReferenceById(items.getId());

            // Creating a function to delete the employee.js from the database after checking the employee.js's existance.
            if(existItems != null){
                try{

                    //set auto insert Values
                    existItems.setDeleted_datetime(LocalDateTime.now()); // Setting the delete time of the employee.js
                    existItems.setItem_status_id(itemStatusDao.getReferenceById(2)); // Setting employeeStatus to deleted once the delete is done
                    existItems.setDeleted_user_id(loggedUser);

                    itemsDao.save(existItems);

                    return "0";


                }catch(Exception ex){

                    return "Delete not completed : " + ex.getMessage();

                }
            }else{

                return "Delete Not Completed : Item Not Available";

            }


        }else {

            return "Item Delete not completed : You don't have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO ADD CUSTOMER [/items - POST]
    @PostMapping
    public String addItem( @RequestBody Items items){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "ITEMS");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("ins")){

            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            Items extItemsIemiNo1 = itemsDao.getByIemiNumber01(items.getIemi_number_1());
            if ( extItemsIemiNo1 != null ){

                return "Item insert not completed : Item IEMI Number 01 Duplicated (IEMI Number 01 already Exist)";

            }

            //CHECKING THE Item IEMI Number 02 EXIST OR NOT IN THE DATABASE.
            Items extItemsIemiNo2 = itemsDao.getByIemiNumber02(items.getIemi_number_2());
            if ( extItemsIemiNo2 != null ){

                return "Item insert not completed : Item IEMI Number 02 Duplicated (Item IEMI Number 02 already Exist)";

            }

            //CHECKING THE Item Serial NumberEXIST OR NOT IN THE DATABASE.
            Items extSerialNumber = itemsDao.getBySerialNumber(items.getSerial_number());
            if ( extSerialNumber != null ){

                return "Item insert not completed : Item Serial Number Duplicated (Item Serial Number already Exist)";

            }

            //CHECKING THE Item Code Number EXIST OR NOT IN THE DATABASE.
            Items extItemCode = itemsDao.getByItemCode(items.getItem_code_number());
            if ( extItemCode != null ){

                return "Item insert not completed : Item Code Number Duplicated (Item Code Number already Exist)";

            }

            try {

                //SET AUTO INSERT VALUE
                items.setAdded_datetime(LocalDateTime.now());
                items.setAdded_user_id(loggedUser);


                //SAVE THE CHANGES
                itemsDao.save(items);
                return "0";

            }catch (Exception ex){

                return "Item Insert is incomplete : " + ex.getMessage();

            }

        }else {

            return "Item insert not completed : You dont have access";

        }

    }


    //CREATE POST MAPPING FUNCTION TO ADD EMPLOYEE [/items - PUT]
    @PutMapping
    public String updateItem( @RequestBody Items items ){

        //NEED TO CHECK PRIVILAGE FOR LOGGED USER --> This is done below...

        //Checking the logged user is exixting in the  database. ( Authenticated user )
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        //Getting authenticated logged user's username
        User loggedUser = userDao.findUserByUsername(authentication.getName());


        //Created a HashMap instance or copy
        HashMap<String, Boolean> loggedUserPrivillage = privilegeController.getPrivilage(loggedUser.getUsername(), "ITEMS");

        if (!(authentication instanceof AnonymousAuthenticationToken) && loggedUser != null && loggedUserPrivillage.get("upd")){

            //NEED TO CHECK DUPLICATION OF THE COLUMNS VALUE
            Items extItemsIemiNo1 = itemsDao.getByIemiNumber01(items.getIemi_number_1());
            if (extItemsIemiNo1 != null && items.getIemi_number_1() == extItemsIemiNo1.getIemi_number_1()) {

                return "Item update not completed : Item IEMI Number 01 already Exist";

            }


            //CHECKING THE EMAIL EXIST OR NOT IN THE DATABASE COZ IT IS UNIQUE.
            Items extItemsIemiNo2 = itemsDao.getByIemiNumber02(items.getIemi_number_2());
            if (extItemsIemiNo2 != null && items.getIemi_number_2() == extItemsIemiNo2.getIemi_number_2()) {

                return "Item update not completed : Item IEMI Number 02 already Exist";

            }

            //CHECKING THE EMAIL EXIST OR NOT IN THE DATABASE COZ IT IS UNIQUE.
            Items extSerialNumber = itemsDao.getBySerialNumber(items.getSerial_number());
            if (extSerialNumber != null && items.getSerial_number() == extSerialNumber.getSerial_number()) {

                return "Item update not completed : Item Serial Number already Exist";

            }

            //CHECKING THE EMAIL EXIST OR NOT IN THE DATABASE COZ IT IS UNIQUE.
            Items extItemCode = itemsDao.getByItemCode(items.getItem_code_number());
            if (extItemCode != null && items.getItem_code_number() == extItemCode.getItem_code_number()) {

                return "Item update not completed : Item Code Number already Exist";

            }

            try {

                //SET AUTO INSERT VALUE OF THE LAST UPDATED TIME ONCE THE UPDATE IS DONE BY THE USER.
                items.setLast_updated_datetime(LocalDateTime.now());
                items.setUpdated_user_id(loggedUser);

                //SAVE THE CHANGES
                itemsDao.save(items);

                return "0";

            }catch (Exception ex){

                return "Item update is incomplete : " + ex.getMessage();

            }

        }else {

            return "Item update not completed : You dont have access";

        }

    }

}
